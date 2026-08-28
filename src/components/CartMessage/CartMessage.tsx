import "./CartMessage.scss";

type CartMessageProps = {
  message: string;
};

export default function CartMessage({
  message,
}: CartMessageProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      className="cart-message"
      role="alert"
    >

      <p className="cart-message__text">
        {message}
      </p>
    </div>
  );
}