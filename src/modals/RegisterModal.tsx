import Register from "./Register/Register";
import { useLockBodyScroll } from "./CepModal/CepModalUtils";
import "./RegisterModal.scss";

type RegisterModalProps = {
  show: boolean;
  onClose: () => void;
};

const RegisterModal = ({ show, onClose }: RegisterModalProps) => {
  useLockBodyScroll(show);

  if (!show) return null;

  return (
    <section
      className="register-modal__overlay"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div className="register-modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="register-modal__close"
          onClick={onClose}
          aria-label="Fechar"
          type="button"
        >
          ×
        </button>
        <Register onClose={onClose} />
      </div>
    </section>
  );
};

export default RegisterModal;
