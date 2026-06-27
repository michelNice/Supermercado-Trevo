import React,{useState,createContext,useContext,useMemo, Children, useEffect} from "react";
import type { ReactNode } from 'react';

interface Product{
  id:number
  name:string
  price:number
}
interface CartItem  extends Product{
  quantity:number;
}
export interface  CartContextType {
  cartItem:CartItem[],
  AddToCart:(Product:Product)=> void
  removeFromCart:(id:number)=> void
  decreaseQuantity:(id:number)=> void
  clearCart:()=> void
  cartTotal:number
}
export const CartContext = createContext<CartContextType | undefined>(undefined)

const CartProvider = ({children}:{children:ReactNode})=> {

const [cartItems,setCartItems] = useState<CartItem[]>(() => {
  const savedCart  = localStorage.getItem('cart')

  return savedCart ? JSON.parse(savedCart) : [];
});

useEffect(()=> {
  localStorage.setItem('cart',JSON.stringify(cartItems))
},[cartItems])


  const  addProduct = (product:Product)=> {

    setCartItems((provItems)=> {
      const existingItem = provItems.find((item)=> item.id === product.id)
      if(existingItem){
         return provItems.map((item) =>
          item.id === product.id  ? {...item,quantity:item.quantity + 1 } : item
        )
      }

       return [...provItems, {...product,quantity:1}]
    })

  }
  const removeFromCart = (id:number)=> {
    setCartItems((provItems)=> provItems.filter(item => item.id !== id))
  }

  const decreaseQuantity = (id: number) => {
  setCartItems((prevItems) =>
    prevItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item).filter((item) => item.quantity > 0)
  );
};
 const clearCart = ()=> setCartItems([])


const totalCart = useMemo(
  () => cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  ),
  [cartItems]
)

  return (
    <CartContext.Provider
     value={{
    cartItem: cartItems,
    AddToCart: addProduct,
    removeFromCart,
    decreaseQuantity,
    clearCart,
    cartTotal: totalCart,
}}
    >

      {children}
    </CartContext.Provider>

  )

};

export default CartProvider
