{/*import './Payment.scss'
import { useCheckout} from '../../context/CheckoutContext'
import { useCart } from '../../context/CartContext'
import { initMercadoPago } from "@mercadopago/sdk-react";
//import { CardPayment } from "@mercadopago/sdk-react";
import { Payment as MercadoPagoPayment } from "@mercadopago/sdk-react";
import { useEffect } from 'react';
//import { createOrder } from '../../services/Supabase/orderService'
interface PaymentData {
    method: string
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
    installments: string
}
const Payment = () => {
    //const { payment, setPayment,address,setAddress} = useCheckout()
    useEffect(()=> {
        initMercadoPago(
        import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY
    );
    },[])
    const { payment, setPayment } = useCheckout()
    const {cartItem} = useCart()
    const total = cartItem.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
).toFixed(2)
    const paymentMethods = [
        {
            type: 'radio',
            value: 'pix',
            label: 'Pix'
        },
        {
            type: 'radio',
            value: 'credit',
            label: 'Cartão de crédito'
        },
        {
            type: 'radio',
            value: 'debit',
            label: 'Cartão de débito'
        }
    ]
    const cardFields = [
         {
            type: 'text',
            name: 'cardName',
            placeholder: 'Nome no cartão'
        },
        {
            type: 'text',
            name: 'cardNumber',
            placeholder: 'Número do cartão'
        },
        {
            type: 'text',
            name: 'expiryDate',
            placeholder: 'Validade MM/AA'
        },
        {
            type: 'text',
            name: 'cvv',
            placeholder: 'CVV'
        }
    ]
    const installments = [
        {
            value: '1',
            label: '1x'
        },
        {
            value: '2',
            label: '2x'
        },
        {
            value: '3',
            label: '3x'
        }
    ]
    const formatCardNumber = (value:string)=>{
        return value
            .replace(/\D/g,'') 
            .replace(/(\d{4})(?=\d)/g,'$1 ') 
            .slice(0,19) 
    }
    const formatExpiryDate = (value:string)=>{
        return value
        .replace(/\D/g, '') 
        .replace(/(\d{2})(\d)/, '$1/$2') 
        .slice(0, 5) 
    }
    const formatCardName = (value: string) => {
    return value
        .replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
        .replace(/\s+/g, ' ')
        .split(' ')
        .slice(0, 2)
        .map(word => 
            word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(' ')
}
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {

        const { name, value } = e.target

        let newValue = value

        if(name == 'cardNumber'){
            newValue =  formatCardNumber(value)
        }

        if(name === 'expiryDate'){

            newValue = formatExpiryDate(value)
        }
        if(name === 'cardName'){
            newValue = formatCardName(value)
        }

        if(name === 'cvv'){
             newValue = value.replace(/\D/g,'')
        }

         setPayment((prev) => ({
            ...prev,
            [name]: newValue
        }))
    }
  const createMercadoPagoPayment = async () => {

    const response = await fetch(
        "http://localhost:3001/payment/create-preference",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                items: cartItem
            })
        }
    )
    const data = await response.json()
    if(data.initPoint){
        window.location.href = data.initPoint
    }
}
 const handlePayment = async (e: React.FormEvent) => {

    e.preventDefault()

    const isValid = validatePayment()

    if(!isValid) return
    try {

        //await createMercadoPagoPayment()
        console.log("Pagamento enviado")

    } catch (error) {

        console.log("Erro no pagamento:", error)
    }
}
    const validatePayment = () => {

    if(!payment.method){
        alert('Escolha uma forma de pagamento')
        return false
    }

    if(payment.method === 'credit' || payment.method === 'debit'){

        const cardNumber = payment.cardNumber.replace(/\s/g,'')

        if(cardNumber.length !== 16){
            alert('Número do cartão inválido')
            return false
        }
        if(payment.cvv.length !== 3){
            alert('CVV inválido')
            return false
        }
        if(!payment.cardName || !payment.expiryDate){
            alert('Preencha todos os dados do cartão')
            return false
        }
        if(payment.cardName.trim().split(/\s+/).length < 2){
              alert('Digite nome e sobrenome')
             return false
        }
        if(payment.method === 'credit' && !payment.installments){
            alert('Escolha as parcelas')
            return false
        }
    }
    return true
}
 return (
    <section className="payment">

    <h2>Forma de pagamento</h2>

    <form onSubmit={handlePayment}>

        <div className="payment__methods">

            {paymentMethods.map((pay) => (

                <label
                    key={pay.value}
                    className="payment__method"
                >

                    <input
                        type={pay.type}
                        id={pay.value}
                        name="method"
                        value={pay.value}
                        checked={payment.method === pay.value}
                        onChange={handleChange}
                    />

                    <span>{pay.label}</span>

                </label>

            ))}

        </div>

        {payment.method === "pix" && (

            <div className="payment__card">

                <h3>Pagamento via Pix</h3>

                <p>
                    O QR Code será gerado após clicar em
                    <strong> Finalizar Pedido</strong>.
                </p>

            </div>

        )}

        {(payment.method === "credit" ||
            payment.method === "debit") && (

            <div className="payment__card">

                <h3>Dados do cartão</h3>

                <div className="payment__mercadopago">

                    <MercadoPagoPayment
    initialization={{
        amount: Number(total),
    }}
    customization={{
        paymentMethods: {
            creditCard: "all",
            debitCard: "all",
            pix: "all",
        },
    }}
    onSubmit={async (formData) => {
        console.log(formData);
    }}
/>

                </div>

            </div>

        )}

        <button
            type="submit"
            className="payment__button"
        >
            Finalizar Pedido
        </button>

    </form>

</section>
  )
    
}


export default Payment
*/}

import "./Payment.scss";
import { useEffect } from "react";
import { initMercadoPago, Payment as MercadoPagoPayment } from "@mercadopago/sdk-react";
import { useCart } from "../../context/CartContext";

const Payment = () => {
    const { cartItem } = useCart();

    useEffect(() => {
        initMercadoPago(import.meta.env.VITE_MERCADO_PAGO_PUBLIC_KEY);
    }, []);

    const total = cartItem.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
    );

    return (
        <section className="payment">
            <h2>Forma de pagamento</h2>

            <div className="payment__mercadopago">
                <MercadoPagoPayment
                    initialization={{
                        amount: total,
                    }}
                    customization={{
                        paymentMethods: {
                            creditCard: "all",
                            debitCard: "all",
                        },
                    }}
                    onSubmit={async (formData) => {
                        try {
                            const response = await fetch(
                                "http://localhost:3001/payment/process-payment",
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify(formData),
                                }
                            );

                            const result = await response.json();

                            console.log(result);
                        } catch (error) {
                            console.error(error);
                        }
                    }}
                />
            </div>
        </section>
    );
};

export default Payment;