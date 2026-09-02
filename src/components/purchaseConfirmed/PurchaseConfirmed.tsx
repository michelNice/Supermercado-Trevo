import { FaCheckCircle, FaHome, FaShoppingBasket } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./PurchaseConfirmed.scss";

const PurchaseConfirmed = () => {
  const deliveryMethod = localStorage.getItem("deliveryMethod");

  const isPickup = deliveryMethod === "pickup";

  return (
    <section className="purchase-confirmed">
      <div className="confirmation-card">
        <FaCheckCircle className="success-icon" />

        <h1>Compra Confirmada!</h1>

        <p className="subtitle">
          Obrigado por comprar no Trevo Supermercado.
        </p>

        <div className="status-box">
          <h3>Seu pedido foi recebido</h3>

          <p>
            Já estamos separando seus produtos e em breve iniciaremos o
            processamento do seu pedido.
          </p>
        </div>

        <div className="info">
          {/* E-MAIL */}
          <div className="info-item">
            <strong>Confirmação por E-mail</strong>

            <span>
              Enviamos um e-mail de confirmação com os detalhes do seu pedido.
            </span>
          </div>

          {/* ENTREGA OU RETIRADA */}
          <div className="info-item">
            <strong>
              {isPickup ? "Retirada na Loja" : "Receber em Casa"}
            </strong>

            <span>
              {isPickup
                ? "Seu pedido está sendo preparado. Aguarde a confirmação de que ele está pronto para retirada."
                : "Seu pedido está sendo preparado e será entregue em breve."}
            </span>
          </div>

          {/* PAGAMENTO */}
          <div className="info-item">
            <strong>Status do Pagamento</strong>

            <span className="approved">
              Aprovado
            </span>
          </div>
        </div>

        <div className="buttons">
          <Link to="/">
            <button className="primary">
              <FaHome />
              Continuar Comprando
            </button>
          </Link>

          <button className="secondary">
            <FaShoppingBasket />
            Meus Pedidos
          </button>
        </div>
      </div>
    </section>
  );
};

export default PurchaseConfirmed;