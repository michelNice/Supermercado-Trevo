import React,{useState,createContext,useMemo, useEffect} from "react";
import type { ReactNode } from 'react';

interface Product{
  id:string
  name:string
  price:number
  image:string
  unit:"UN" | "KG"
}
interface CartItem  extends Product{
  quantity:number;
}
export interface  CartContextType {
  cartItem:CartItem[],
  AddToCart:(Product:Product)=> void
  removeFromCart:(id:string)=> void
  decreaseQuantity:(id:string)=> void
  increaseQuantity:(id:string)=> void
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
      console.log(product)
      const existingItem = provItems.find((item)=> item.id === product.id)
      if(existingItem){
         return provItems.map((item) =>
          item.id === product.id  ? {...item,quantity:item.quantity + 1 } : item
        )
      }
      console.log(product)

       return [...provItems, {...product,quantity:1}]
    })

  }
  
const removeFromCart = (id: string) => {
  console.log("Remover:", id);

  setCartItems((prev) => {
    console.log("Antes:", prev);

    const updated = prev.filter((item) => item.id !== id);

    console.log("Depois:", updated);

    return updated;
  });
};

  const decreaseQuantity = (id: string) => {
  setCartItems((prevItems) =>
    prevItems
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item).filter((item) => item.quantity > 0)
  );
};

const increaseQuantity = (id:string) => {
  setCartItems((prevItems) => 
    prevItems.map((item) =>
      item.id === id ? {...item, quantity:item.quantity + 1} : item
    ).filter((item)=> item.price)
  )
}
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
     increaseQuantity,
    clearCart,
    cartTotal: totalCart,
}}
    >

      {children}
    </CartContext.Provider>

  )

};

export default CartProvider
