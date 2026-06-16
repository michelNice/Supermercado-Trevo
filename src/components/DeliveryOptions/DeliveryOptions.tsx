import type React from "react";
import { useState, useEffect,useRef } from "react";
import { trevoAddress } from "./AdressDelivery";
import CepModal from "../../modals/CepModal/CepModal";
import { useLockBodyScroll } from "../../modals/CepModal/CepModalUtils";
import { useModal } from "../../modals/CepModal/CepModalUtils";

import './DeliveryOptions.scss';
import {
  getSelectedStore,
  getSelectedAddress,
  setSelectedStore as saveSelectedStore,
  setSelectedAddress,
} from "../../utils/storage.ts";
import UnavailableModal from "../../modals/UnavailableModal/UnavailableModal";
type props = {
    onSelectStore:(adress:string)=> void
    onClose: () => void;
}
const DeliveryOptions: React.FC <props> = ({ onSelectStore,onClose}) => {
    const [selected, setSelected] = useState("home");
     const deliveryRef = useRef<HTMLDivElement>(null);
    const {openModal,closeModal,showModal} = useModal()
    const [selectedStore, setSelectedStore] = useState<number | null>(null);
    const [showUnavailable,setShowUnavailable] = useState(false)
    const [cep,setCep] = useState('')
    useEffect(()=> {
      const savedStore = getSelectedStore()
      const savedAdress = getSelectedAddress()
      if (savedStore) setSelectedStore(Number(savedStore));
      if (savedAdress) onSelectStore(savedAdress)
    },[])
    useEffect(() => {
    if (selectedStore !== null) {
      saveSelectedStore(selectedStore)
  
    }
  }, [selectedStore]);
  const handleCepSubmit = ()=>{
   closeModal()
   setShowUnavailable(true)
 }

 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
  console.log("clicou fora?", event.target);

  if (
    deliveryRef.current &&
    !deliveryRef.current.contains(event.target as Node)
  ) {
    console.log("fechando");
    onClose();
  }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [onClose]);
 useLockBodyScroll(showModal || showUnavailable)

    return(
      <>
        <div className="delivery" ref={deliveryRef}>
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
    <button
      onClick={openModal}
      >
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
               setSelectedAddress(store.address);
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
 <CepModal 
        show={showModal}
        onClose={closeModal}
        cep={cep}
        setCep={setCep}
        onSubmit={handleCepSubmit}
      />

    <UnavailableModal 
       show={showUnavailable}
       onClose={() => setShowUnavailable(false)}
    />
 </>
 
)
    
}

export default DeliveryOptions;