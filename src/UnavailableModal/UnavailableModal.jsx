//import "./UnavailableModal.css";
import  '../CepModal/CepModal.css'

function UnavailableModal({ show, onClose }) {

  if (!show) return null;

  return (
    <section className="modal__overlay" onClick={onClose}>
      <div className="modal__wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="modal">

          <button className="modal__close" onClick={onClose}>×</button>

          <h2 className="modal__title">Atenção</h2>

          <p className="modal__description">
            Nosso serviço de entrega está temporariamente suspenso.
            Estamos trabalhando para trazer um serviço ainda melhor.
            Voltaremos em breve!
          </p>

          <div className="modal__footer">
            <button className="modal__button" onClick={onClose}>
              Ok, entendi
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default UnavailableModal;
