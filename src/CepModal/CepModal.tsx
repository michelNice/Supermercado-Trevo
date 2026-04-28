import { useState } from "react";
import './CepModal.scss'

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

    return(
        <section className="modal__overlay">
            <div className="modal__wrapper">
                <div className="modal modal_trans">
                     <button className="modal__close">×</button>
                       <h2 className="modal__title">Qual o seu CEP?</h2>
                       <p className="modal_descripition">
                             Precisamos validar seu CEP para saber se o nosso serviço atende a sua região.
                       </p>
                       <div className="modal__input">
                            <input 
                            className={`modal__input ${cepError ? "input--error" : ""}`}
                            type="text"
                            placeholder=""
                            maxLength={9}
                            />
                            <label htmlFor="" className={`$modal__label ${cepError ? "label--error" : ""}`}>
                                Digite seu CEP*
                            </label>
                       </div>
                       <div className="error__space">
                           {cepError && <p className="error__text">{cepError}</p>}
                       </div>

                       <div className="modal__footer">
                         <button className="modal__button">
                            Verificar Disponibilidade
                         </button>
                       </div>
                </div>
            </div>
        </section>
    )
}

export default CepModal;