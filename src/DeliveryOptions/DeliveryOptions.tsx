import type React from "react";
import { useState, useEffect } from "react";
import type { TrevoAddress } from "./AdressDelivery";
import { trevoAddress } from "./AdressDelivery";
import './DeliveryOptions.scss'
type props = {
    onSelectStore:(adress:string)=> void
}
const DeliveryOptions: React.FC <props> = ({ onSelectStore}) => {
    const [selected, setSelected] = useState("home");
    const [showModal,setShowModal] = useState(false)
    
    return(
        <div className="delivery">
                <div className="delivery__container">
                      <h2 className="delivery__title">Você deseja:</h2>
                      <div className="delivery__options">
                    <button
                        className={`delivery__option ${selected === "home" ? "active" : ""}`}
                        onClick={() => setSelected("home")}
                    >
                        <i className="pickup__icon fas fa-truck"></i>
                        <span>Receber em Casa</span>
                    </button>
                    <button
                    className={`delivery__option ${selected === "store" ? "active" : ""}`}
                    onClick={() => setSelected("store")}
                    >
                 <i className="pickup__icon fas fa-walking"></i>
                <span>Retirar na Loja</span>
              </button>
                </div>
            </div>
            <div className="delivery__home">
                 <h3>Em qual endereço deseja receber?</h3>
                 <button onClick={()=> setShowModal(true)}>Informar um CEP</button>
            </div>
            <div className="store__conteiner">
                   <h4>Em qual loja deseja retirar sua compra?</h4>
                   <ul className="store__list">
                       {trevoAddress.map((store) => (
                            <div key={store.id}>
                                <h3>{store.name}</h3>
                                <p>{store.address}</p>
                                
                            </div>
                         ))}
                   </ul>
            </div>
        </div>
    )
}

export default DeliveryOptions;