import { Children, createContext, useContext, useState } from "react"
import { CartContext } from "./CartContext"
interface PaymentData {
    method: string
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
    installments: string
}
interface AddressData {
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
})
    return (
        <CheckoutContext.Provider 
           value={{
                payment,
                setPayment,
                address,
               setAddress
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

