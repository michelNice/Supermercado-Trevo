
import type React from "react";
import { useState, useEffect } from "react";

import { trevoAddress } from "./AdressDelivery";

import CepModal from "../../modals/CepModal/CepModal";

import {
  useLockBodyScroll,
  useModal,
} from "../../modals/CepModal/CepModalUtils";

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
  const [selected, setSelected] = useState<
    "home" | "store"
  >("home");

  const {
    openModal,
    closeModal,
    showModal,
  } = useModal();

  const [selectedStore, setSelectedStore] =
    useState<number | null>(null);

  const [showUnavailable, setShowUnavailable] =
    useState(false);

  const [cep, setCep] = useState("");

  const {
    setDeliveryMethod,
    setSelectedStore: setCheckoutStore,
  } = useCheckout();

  /*
   * ============================================================
   * RECUPERA DADOS SALVOS
   * ============================================================
   */

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

  /*
   * ============================================================
   * SALVA A LOJA SELECIONADA
   * ============================================================
   */

  useEffect(() => {
    if (selectedStore !== null) {
      saveSelectedStore(selectedStore);
    }
  }, [selectedStore]);

  /*
   * ============================================================
   * CEP
   * ============================================================
   */

  const handleCepSubmit = () => {
    closeModal();
    setShowUnavailable(true);
  };

  /*
   * ============================================================
   * SELECIONAR RECEBER EM CASA
   * ============================================================
   */

  const handleHomeDelivery = () => {
    setSelected("home");
    setDeliveryMethod("delivery");
  };

  /*
   * ============================================================
   * SELECIONAR RETIRADA
   * ============================================================
   */

  const handleStorePickup = () => {
    setSelected("store");
    setDeliveryMethod("pickup");
  };

  /*
   * ============================================================
   * SELECIONAR UMA LOJA
   * ============================================================
   */

  const handleSelectStore = (
    store: (typeof trevoAddress)[number]
  ) => {
    // Seleciona visualmente a loja
    setSelectedStore(store.id);

    // Define retirada na loja
    setDeliveryMethod("pickup");

    // Salva endereço
    setSelectedAddress(store.address);

    // Salva loja no CheckoutContext
    setCheckoutStore({
      id: String(store.id),
      name: store.name,
      address: store.address,
    });

    // Atualiza o Navbar
    onSelectStore(store.address);

    // Fecha o dropdown
    onClose();
  };

  useLockBodyScroll(
    showModal || showUnavailable
  );

  return (
    <>
      <div className="delivery">

        {/* =====================================================
            TIPO DE ENTREGA
        ===================================================== */}

        <div className="delivery__container">

          <h2 className="delivery__title">
            Você deseja:
          </h2>

          <div className="delivery__options">

            {/* RECEBER EM CASA */}

            <button
              type="button"
              className={`delivery__option ${
                selected === "home"
                  ? "active"
                  : ""
              }`}
              onClick={handleHomeDelivery}
            >
              <i className="pickup__icon fas fa-truck"></i>

              <span>
                Receber em Casa
              </span>
            </button>

            {/* RETIRAR NA LOJA */}

            <button
              type="button"
              className={`delivery__option ${
                selected === "store"
                  ? "active"
                  : ""
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

        {/* =====================================================
            RECEBER EM CASA
        ===================================================== */}

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

        {/* =====================================================
            RETIRAR NA LOJA
        ===================================================== */}

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
                      isSelected
                        ? "selected"
                        : ""
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
                        isSelected
                          ? "visible"
                          : ""
                      }`}
                    ></i>

                  </li>
                );
              })}

            </ul>

          </div>
        )}

      </div>

      {/* =====================================================
          MODAL CEP
      ===================================================== */}

      <CepModal
        show={showModal}
        onClose={closeModal}
        cep={cep}
        setCep={setCep}
        onSubmit={handleCepSubmit}
      />

      {/* =====================================================
          SERVIÇO INDISPONÍVEL
      ===================================================== */}

      <UnavailableModal
        show={showUnavailable}
        onClose={() =>
          setShowUnavailable(false)
        }
      />
    </>
  );
};

export default DeliveryOptions;

