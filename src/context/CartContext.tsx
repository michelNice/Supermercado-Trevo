import { createContext, useState } from "react";
import type { ReactNode } from "react";

export  interface Product {
    id:string
    name:string;
    price:number
}

export interface  CartItem extends Product{
  quantily:number;
}

type CartAction =
  | { type: "ADD_TO_CART"; payload: Product }
  | { type: "REMOVE_FROM_CART"; payload: { id: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };


  interface CartContextType {
    cart:CartItem[];
    addToCart:(product:Product)=> void
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    cartTotal: number;
  }

 



