import type React from "react";
import { useState, useEffect } from "react";
const DeliveryOptions: React.FC = () => {
    const [selected, setSelected] = useState<string>("home");
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
        </div>
    )
}

export default DeliveryOptions;