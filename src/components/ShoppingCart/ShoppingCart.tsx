import { useCart } from "../../context/useCart";


export default function ShoppingCart(){
    const {cartItem,cartTotal} = useCart();

    return (
        <div>
            <h2>Carrinho</h2>
             {cartItem.map((item) => (
        <div key={item.id}>
          {item.name} - {item.quantity}
        </div>
      ))}

      <div>{cartTotal}</div>
        </div>
    )
}