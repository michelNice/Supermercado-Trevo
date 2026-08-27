import {createContext, useContext, useState } from "react"

type   DeliveryMethod = 'delivery' | 'pickup'

interface Store {
    id:string
    name:string
    adress:string
}
interface PaymentData {
    method: string
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
    installments: string
}
interface AddressData {
    name:string,
    email:string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    complemento: string
}
interface CheckoutContextType{
    payment: PaymentData
    setPayment: React.Dispatch<React.SetStateAction<PaymentData>>
    address: AddressData
    setAddress: React.Dispatch<React.SetStateAction<AddressData>>


    deliveryMethod:DeliveryMethod;
    setDeliveryMethod: React.Dispatch<React.SetStateAction<DeliveryMethod>>;
    selectedStore:Store | null
    setSelectedStore: React.Dispatch<React.SetStateAction<Store | null>>;
}
const CheckoutContext  = createContext<CheckoutContextType | null>(null)

export const CheckoutProvider = ({
children
}:{
    children: React.ReactNode
}) => {
       const [payment, setPayment] = useState<PaymentData>({
        method: '',
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: '',
        installments: ''
    })
    const [address, setAddress] = useState<AddressData>({
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    complemento: "",
    name:'',
    email:''
})

const [deliveryMethod, setDeliveryMethod] =  useState<DeliveryMethod>("delivery");

const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    return (
        <CheckoutContext.Provider 
           value={{
                payment,
                setPayment,
                address,
                setAddress,
                deliveryMethod,
                setDeliveryMethod,
                setSelectedStore
                ,selectedStore
            }}
         >
            {children}
        </CheckoutContext.Provider>
    )
}
export const useCheckout = () => {
    const context = useContext(CheckoutContext)
    if(!context){
        throw new Error(
            'useCheckout deve estar dentro do CheckoutProvider'
        )
    }
    return context
}

