import { useCart } from "../../context/useCart";

export default function ShoppingCart() {
  const { cartItem, cartTotal, removeFromCart ,decreaseQuantity} = useCart();

  return (
    <div>
      <h2>Carrinho</h2>

     {cartItem.map((item) => {
  console.log(item);

  return (
    <div key={item.id}>
      <img src={item.image} alt={item.name} />
      <p>{item.name}</p>
      <p>{item.quantity}</p>

       <button onClick={() => decreaseQuantity(item.id)}>
    -
  </button>

      <button onClick={() => removeFromCart(item.id)}>
        Remover
      </button>
    </div>
  );
})}

      <div>Total: {cartTotal}</div>
    </div>
  );
}