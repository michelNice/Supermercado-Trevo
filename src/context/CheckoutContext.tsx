import { Children, createContext, useContext, useState } from "react"
interface PaymentData {
    method: string
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
    installments: string
}
interface CheckoutContextType{
     payment: PaymentData
    setPayment: React.Dispatch<React.SetStateAction<PaymentData>>
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
    return (
        <CheckoutContext.Provider 
           value={{
                payment,
                setPayment
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