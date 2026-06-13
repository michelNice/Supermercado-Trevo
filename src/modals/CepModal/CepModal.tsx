import { useState } from "react";
import './CepModal.scss'
import  {formatCep,isCepValid} from './CepModalUtils'

type CepModalProps = {
    show:boolean;
    onClose:()=> void
    cep:string
    setCep: React.Dispatch<React.SetStateAction<string>>;
    onSubmit:()=> void
}
const CepModal: React.FC<CepModalProps> = ({
  show,
  onClose,
  cep,
  setCep,
  onSubmit
}) => {
  
    const [cepError,setCepError] = useState('')
     if (!show) return null;

    const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>)=> {
        const value = formatCep(e.target.value)
          setCep(value)
          setCepError("")
    }
    const handleSubmit = ()=>{
        if(!isCepValid(cep)){
            setCepError("CEP inválido");
            return;
        }
        setCepError("")
        onSubmit()
    }
    
    return(
       <section className="modal__overlay" onClick={onClose}>
      <div className="modal__wrapper" onClick={(e) => e.stopPropagation()}>
        <div className="modal modal__trans">

          <button className="modal__close" onClick={onClose}>×</button>

          <h2 className="modal__title">Qual o seu CEP?</h2>

          <p className="modal__description">
            Precisamos validar seu CEP para saber se o nosso serviço atende a sua região.
          </p>

          <div className="modal__inputBox">
            <input
              className={`modal__input ${cepError ? "input--error" : ""}`}
              type="text"
              placeholder=" "
              value={cep}
              onChange={handleCepChange}
              maxLength={9}
              required
            />

            <label
              className={`modal__label ${cepError ? "label--error" : ""}`}
            >
              Digite seu CEP*
            </label>
          </div>

          <div className="error__space">
            {cepError && <p className="error__text">{cepError}</p>}
          </div>

          <div className="modal__footer">
            <button className="modal__button" onClick={handleSubmit}>
              Verificar Disponibilidade
            </button>
          </div>

        </div>
      </div>
    </section>
    )
}
export default CepModal;