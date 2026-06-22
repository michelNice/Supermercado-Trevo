interface Product{
  id:string
  name:string
  price:number
}

interface CartItem  extends Product{
  quantity:number;
}
import React,{useState} from "react";


export default function ShoppingCart(product:Product){

  const [cart, setCart] = useState<CartItem[]>([]);

  const itemExists = cart.find((item)=> item.id === product.id)
     if (itemExists) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };


