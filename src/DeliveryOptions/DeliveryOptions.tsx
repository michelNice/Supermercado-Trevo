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
    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [store, setStore] = useState<TrevoAddress | null>(null);
    useEffect(()=> {
      const savedStore = localStorage.getItem('selectedStore')
      const savedAdress = localStorage.getItem('selectedAddress')
      if (savedStore) setSelectedStore(Number(savedStore));
      if (savedAdress) onSelectStore(savedAdress)
    },[])
    useEffect(() => {
    if (selectedStore !== null) {
      localStorage.setItem("selectedStore", String(selectedStore));
    }
  }, [selectedStore]);
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
            {selected === 'home' ? (
  <div className="delivery__home">
    <h3>Em qual endereço deseja receber?</h3>
    <button onClick={() => setShowModal(true)}>
      Informar um CEP
    </button>
  </div>
) : (
  <div className="store__conteiner">
    <h4>Em qual loja deseja retirar sua compra?</h4>

    <ul className="store__list">
      {trevoAddress.map((store) => {
        const isSelected = selectedStore === store.id;

        return (
          <li
            key={store.id}
             className={`store__item ${isSelected ? "selected" : ""}`}
            onClick={() => {
              setSelectedStore(store.id);
              onSelectStore(store.address);
              localStorage.setItem("selectedAddress", store.address);
            }}
          >
            <i className="fas fa-map-marker-alt store-icon"></i>

            <div className="store-info">
              <strong>{store.name}</strong>
              <p>{store.address}</p>
            </div>

            <i
              className={`fas fa-check check-icon ${
                isSelected ? "visible" : ""
              }`}
            ></i>
          </li>
        );
      })}
    </ul>
  </div>
)}
             
 </div>
    )
}

export default DeliveryOptions;