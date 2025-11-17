import "./CepModal.css";
function CepModal({ show, onClose, cep, setCep, onSubmit }) {
  if (!show) return null;

  const handleCepChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 5) value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    setCep(value);
  };

  return (
    <section className="modal__overlay" onClick={onClose}>
      <div className="modal__wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="modal">
          <button className="modal__close" onClick={onClose}>×</button>

          <h2 className="modal__title">Qual o seu CEP?</h2>

          <p className="modal__description">
            Precisamos validar seu CEP para saber se o nosso serviço atende a sua região.
          </p>

          <div className="modal__inputBox">
            <input
              className="modal__input"
              type="text"
              placeholder=" "
              value={cep}
              onChange={handleCepChange}
              maxLength={9}
              required
            />
            <label className="modal__label">Digite seu CEP*</label>
          </div>

          <div className="modal__footer">
            <button className="modal__button" onClick={onSubmit}>
              Verificar Disponibilidade
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CepModal;
