import React from "react"
import '../CepModal.scss'
type UnavailableModalProp = {
    show:boolean
    onClose:()=> void
}
const UnavailableModal: React.FC<UnavailableModalProp> = ({
 show,
 onClose
    
})=> {
    if(!show)return null
    return(
        <>
            <section className="overlay__modal" onClick={onClose}>
                    <div className="modal__wrapper">
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
        </>
    )
}

export default UnavailableModal