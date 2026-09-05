import type React from "react";
import { useState, useEffect } from "react";
import { trevoAddress, getNearestStoreByCep } from "./AdressDelivery";
import CepModal from "../../modals/CepModal/CepModal"
import {useLockBodyScroll,useModal,} from "../../modals/CepModal/CepModalUtils";
import "./DeliveryOptions.scss";
import { useCheckout } from "../../context/CheckoutContext";
import {
  getSelectedStore,
  getSelectedAddress,
  setSelectedStore as saveSelectedStore,
  setSelectedAddress,
} from "../../utils/storage.ts";
import UnavailableModal from "../../modals/UnavailableModal/UnavailableModal";

type Props = {
  onSelectStore: (address: string) => void;
  onClose: () => void;
};

const DeliveryOptions: React.FC<Props> = ({
  onSelectStore,
  onClose,
}) => {
  const [selected, setSelected] = useState<"home" | "store">("home");

  const {
    openModal,
    closeModal,
    showModal,
  } = useModal();

  const [selectedStore, setSelectedStore] =
    useState<number | null>(null);

  const [showUnavailable, setShowUnavailable] =
    useState(false);

  const [deliveryAvailable, setDeliveryAvailable] =
    useState(false);

  const [cep, setCep] = useState("");

  const {
    setDeliveryMethod,
    setSelectedStore: setCheckoutStore,
  } = useCheckout();

  useEffect(() => {
    const savedStore = getSelectedStore();
    const savedAddress = getSelectedAddress();

    if (savedStore) {
      setSelectedStore(Number(savedStore));
      setSelected("home");
    }

    if (savedAddress) {
      onSelectStore(savedAddress);
    }
  }, []);

  useEffect(() => {
    if (selectedStore !== null) {
      saveSelectedStore(selectedStore);
    }
  }, [selectedStore]);

  const handleCepSubmit = async () => {
    try {
      const result = await getNearestStoreByCep(cep);

      closeModal();

      if (
        result.nearestStore &&
        result.nearestStore.distanceKm > 3
      ) {
        setDeliveryAvailable(false);
        setShowUnavailable(true);
      } else {
        setDeliveryAvailable(true);
        setShowUnavailable(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleHomeDelivery = () => {
    setSelected("home");
    setDeliveryMethod("delivery");
  };

  const handleStorePickup = () => {
    setSelected("store");
    setDeliveryMethod("pickup");
  };

  const handleSelectStore = (
    store: (typeof trevoAddress)[number]
  ) => {
    setSelectedStore(store.id);
    setDeliveryMethod("pickup");

    setSelectedAddress(store.address);

    setCheckoutStore({
      id: String(store.id),
      name: store.name,
      address: store.address,
    });

    onSelectStore(store.address);
    onClose();
  };

  useLockBodyScroll(
    showModal || showUnavailable
  );
  return (
    <>
      <div className="delivery">
        <div className="delivery__container">
          <h2 className="delivery__title">
            Você deseja:
          </h2>

          <div className="delivery__options">
            <button
              type="button"
              className={`delivery__option ${
                selected === "home" ? "active" : ""
              }`}
              onClick={handleHomeDelivery}
            >
              <i className="pickup__icon fas fa-truck"></i>

              <span>
                Receber em Casa
              </span>
            </button>

            <button
              type="button"
              className={`delivery__option ${
                selected === "store" ? "active" : ""
              }`}
              onClick={handleStorePickup}
            >
              <i className="pickup__icon fas fa-walking"></i>

              <span>
                Retirar na Loja
              </span>
            </button>
          </div>
        </div>

        {selected === "home" && (
          <div className="delivery__home">
            <h3>
              Em qual endereço deseja receber?
            </h3>

            <button
              type="button"
              onClick={openModal}
            >
              Informar um CEP
            </button>
          </div>
        )}

        {selected === "store" && (
          <div className="store__conteiner">
            <h4>
              Em qual loja deseja retirar sua compra?
            </h4>

            <ul className="store__list">
              {trevoAddress.map((store) => {
                const isSelected =
                  selectedStore === store.id;

                return (
                  <li
                    key={store.id}
                    className={`store__item ${
                      isSelected ? "selected" : ""
                    }`}
                    onClick={() =>
                      handleSelectStore(store)
                    }
                  >
                    <i className="fas fa-map-marker-alt store-icon"></i>

                    <div className="store-info">
                      <strong>
                        {store.name}
                      </strong>

                      <p>
                        {store.address}
                      </p>
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
        onClose={() =>
          setShowUnavailable(false)
        }
        deliveryAvailable={deliveryAvailable}
      />
    </>
  );
};

export default DeliveryOptions;