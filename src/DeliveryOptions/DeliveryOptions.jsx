import { useState } from "react";
import './deliveryOptions.css'
function Delivery() {
  const [selected, setSelected] = useState("home");

  return (
    <div className="delivery">
        <div className="delivery__container">
            <h2 className="delivery__title">Você deseja:</h2>
            <div className="delivery__options">
                <button
                className={`delivery__option ${
                    selected === "home" ? "active" : ""
                }`}
                onClick={() => setSelected("home")}
                >
                <i className="pickup__icon fas fa-truck"></i>
                <span>Receber em Casa</span>
                </button>

                <button
                className={`delivery__option ${
                    selected === "store" ? "active" : ""
                }`}
                onClick={() => setSelected("store")}
                >
                <i className="pickup__icon fas fa-walking"></i> {/* 👈 ícone certo */}
                <span>Retirar na Loja</span>
                </button>
          </div>
        </div>

        {selected === 'home' ? (
  <div className="delivery__home">
    <p>Em qual endereço deseja receber?</p>
    <a href="#">Informar um CEP</a>
  </div>
) : (
  <div>test</div>
)}

    </div>
  );
}

export default Delivery;
