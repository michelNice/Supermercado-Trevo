import React from "react";
import "../CepModal/CepModal.scss";

type UnavailableModalProp = {
  show: boolean;
  onClose: () => void;
  deliveryAvailable: boolean;
};

const UnavailableModal: React.FC<UnavailableModalProp> = ({
  show,
  onClose,
  deliveryAvailable,
}) => {
  if (!show) return null;

  return (
    <section className="modal__overlay" onClick={onClose}>
      <div
        className="modal__wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal">
          <button className="modal__close" onClick={onClose}>
            ×
          </button>

          <h2 className="modal__title">
            {deliveryAvailable ? "Entrega disponível!" : "Atenção"}
          </h2>

          <p className="modal__description">
            {deliveryAvailable
              ? "Boas notícias! Seu endereço está dentro da nossa área de entrega."
              : "No momento, ainda não realizamos entregas nessa região. Estamos trabalhando para ampliar nossa área de entrega e atender você em breve."}
          </p>

          <div className="modal__footer">
            <button className="modal__button" onClick={onClose}>
              {deliveryAvailable ? "Continuar" : "Ok, entendi"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UnavailableModal;