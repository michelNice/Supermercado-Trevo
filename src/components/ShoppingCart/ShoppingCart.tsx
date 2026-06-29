import { useCart } from "../../context/useCart";
import "./ShoppingCart.scss";

export default function ShoppingCart() {
  const {
    cartItem,
    cartTotal,
    removeFromCart,
    decreaseQuantity,
    //increaseQuantity,
  } = useCart();

  return (
    <div className="shopping-cart">
      <h2 className="shopping-cart__title">
        Meu Carrinho
      </h2>

      {cartItem.length === 0 && (
        <p className="shopping-cart__empty">
          Seu carrinho está vazio.
        </p>
      )}

      {cartItem.map((item) => (
        <div
          className="shopping-cart__item"
          key={item.id}
        >
          <img
            className="shopping-cart__image"
            src={item.image}
            alt={item.name}
          />

          <div className="shopping-cart__info">
            <h3>{item.name}</h3>

            <span className="shopping-cart__price">
              R$ {item.price.toFixed(2)}
            </span>
          </div>

          <div className="shopping-cart__quantity">

            <button
              onClick={() => decreaseQuantity(item.id)}
            >
              -
            </button>

            <span>{item.quantity}</span>

           

          </div>

          <div className="shopping-cart__subtotal">

            R$
            {(item.price * item.quantity).toFixed(2)}

          </div>

          <button
            className="shopping-cart__remove"
            onClick={() => removeFromCart(item.id)}
          >
            Remover
          </button>
        </div>
      ))}

      <div className="shopping-cart__footer">

        <h2>
          Total: R$ {cartTotal.toFixed(2)}
        </h2>

        <button className="shopping-cart__finish">
          Finalizar Compra
        </button>

      </div>
    </div>
  );
}