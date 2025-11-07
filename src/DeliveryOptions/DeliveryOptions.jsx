import { useState } from "react";
import './DeliveryOptions.css'
function DeliveryOptions() {
  const [selected, setSelected] = useState("home");

  const [selectedStore,setSelectedStore] = useState(null)

  const  trevoAdress = [

    {
      id:1,
      name:"Trevo - Boa Viagem",
      address: "Rua Barão de Souza Leão, 1170 — Boa Viagem",
    },

    {
      id:2,
      name:"Trevo - Cohab",
      address: "Rua Dr. Otávio de Moraes Vasconcelos, 39 — Cohab",
    }
    ,
     {

      id:3,
       name: "Trevo - Domingos Ferreira",
      address: "Av. Engenheiro Domingos Ferreira, 1990 — Boa Viagem",
    }
    ,
    {
      id:4,
      name:"Trevo - Setúbal",
      address:"Rua Dr. Luiz Inácio Pessoa de Melo, 342 - Boa Viagem"
    }
  ]
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
                <i className="pickup__icon fas fa-walking"></i> 
                <span>Retirar na Loja</span>
                </button>
          </div>
        </div>

        {selected === 'home' ? (
  <div className="delivery__home">
    <h3>Em qual endereço deseja receber?</h3>
    <button>Informar um CEP</button>
  </div>
) : (
  <div className="store__conteiner">
      <h4>Em qual loja deseja retirar sua compra?</h4>
    <ul className="store__list">
    {trevoAdress.map((store) => {
      const isSelected = selectedStore === store.id
      return (
        <li key={store.id} className={`store__item ${isSelected ? "selected" : ""}`} 
        
        onClick={()=> setSelectedStore(store.id)}>
          <i className="fas fa-map-marker-alt store-icon"></i>
          <div className="store-info">
            <strong>{store.name}</strong>
            <p>{store.address}</p>
          </div>

          {isSelected && <i className="fas fa-check check-icon"></i>}
        </li>
      );
    })}
  </ul>
  </div>
)}

    </div>
  );
}

export default DeliveryOptions;
