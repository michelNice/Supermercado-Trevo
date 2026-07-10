import { useState } from 'react'
import './Payment.scss'
import { useCheckout} from '../../context/CheckoutContext'
import { useCart } from '../../context/CartContext'
import { createOrder } from '../../services/Supabase/orderService'
interface PaymentData {
    method: string
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
    installments: string
}
const Payment = () => {
    const { payment, setPayment,address} = useCheckout()
    const {cartItem} = useCart()
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
    const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    const isValid = validatePayment()

    if(!isValid) return
         
    const order = {
       produtos: cartItem,
       endereco: address,
       pagamento: payment
    }

    const response = await createOrder(order)

    console.log(response)
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
        <section>
            <h2>Forma de pagamento</h2>
            <form onSubmit={handlePayment}>
                {paymentMethods.map((pay) => (
                    <div key={pay.value}>

                        <label htmlFor={pay.value}>
                            {pay.label}
                        </label>

                        <input
                            type={pay.type}
                            id={pay.value}
                            name="method"
                            value={pay.value}
                            checked={payment.method === pay.value}
                            onChange={handleChange}
                        />
                    </div>
                ))}
                {payment.method === 'pix' && (

                    <div>

                        <h3>
                            Pagamento via Pix
                        </h3>

                    </div>

                )}
                {(payment.method === 'credit' ||
                payment.method === 'debit') && (

                    <div>
                        <h3>Dados do cartão</h3>
                        {cardFields.map((field) => (

                            <input
                                key={field.name}
                                type={field.type}
                                name={field.name}
                                placeholder={field.placeholder}
                                value={
                                    payment[field.name as keyof PaymentData]
                                }
                                onChange={handleChange}
                                maxLength={
                                    field.name === 'cardNumber' ? 19 :
                                    field.name === 'cvv' ? 3 :
                                     field.name === 'expiryDate' ? 5 :
                                     undefined
                                }
                            />
                        ))}
                        {payment.method === 'credit' && (

                            <select
                                name="installments"
                                value={payment.installments}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Parcelas
                                </option>
                                {installments.map((item)=>(

                                    <option
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}
                <button type="submit">
                    Finalizar Pedido
                </button>
            </form>

        </section>

    )
}


export default Payment