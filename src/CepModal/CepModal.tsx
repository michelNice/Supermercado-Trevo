import { useState } from "react";
const CepModal:React.FC = ()=> {
  
    const [cepError,setCepError] = useState('')

    return(
        <section className="modal__overlay">
            <div className="modal__wrapper">
                <div className="modal modal_trans">
                     <button className="modal__close">×</button>
                       <h2 className="modal__title">Qual o seu CEP?</h2>
                </div>
            </div>
        </section>
    )
}

export default CepModal;