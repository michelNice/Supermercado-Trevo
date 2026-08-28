import "./Navbar.scss";

import trevo from "../../assets/imgs/trevo_logo.png";

import {
  FaUser,
  FaShoppingCart,
  FaStore,
  FaBars,
  FaTh,
  FaChevronDown,
} from "react-icons/fa";

import { useState, useRef, useEffect } from "react";

import NavMobile from "../NavMobile/NavMobile";

import DeliveryOptions from "../DeliveryOptions/DeliveryOptions";

import DepartmentsDropdown from "../DepartmentsDropdown/DepartmentsDropdown";

import CartMessage from "../CartMessage/CartMessage";

import { useNavigate, Link } from "react-router-dom";

import { getSelectedAddress } from "../../utils/storage.ts";

import { useCart } from "../../context/useCart";

import SearchProducts from "../SearchProducts/SearchProducts";

import { type productApi } from "../../Types/Product";

import { useAuth } from "../../context/useAuth";


type NavbarProp = {
  products: productApi[];
};


const Navbar = ({ products }: NavbarProp) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const [showDelivery, setShowDelivery] =
    useState(false);

  const [departments, setDepartments] =
    useState(false);

  const [cartMessage, setCartMessage] =
    useState("");

  const defaultAddress =
    "Rua Barão de Souza Leão, 1170 — Boa Viagem, Recife - PE";

  const deliveryRef =
    useRef<HTMLDivElement>(null);

  const [currentAddress, setCurrentAddress] =
    useState(
      getSelectedAddress() ?? defaultAddress
    );

  const { cartItem } = useCart();

  const { user } = useAuth();

  const navigate = useNavigate();


  const firstName =
    user?.user_metadata?.full_name
      ?.split(" ")[0]
      ?.replace(
        /^./,
        (letter: string) =>
          letter.toUpperCase()
      ) || "Cliente";


  const totalItems = cartItem.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );


  // Abre o carrinho somente se existir produto
  const handleCartClick = () => {
    if (cartItem.length === 0) {
      setCartMessage(
        "Seu carrinho está vazio. Adicione um produto antes de acessar o carrinho."
      );

      return;
    }

    navigate("/carrinho");
  };


  // Remove a mensagem automaticamente
  useEffect(() => {
    if (!cartMessage) return;

    const timer = setTimeout(() => {
      setCartMessage("");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [cartMessage]);


  // Fecha somente quando clicar fora do dropdown
  useEffect(() => {
    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (!showDelivery) return;

      if (
        deliveryRef.current &&
        !deliveryRef.current.contains(
          event.target as Node
        )
      ) {
        setShowDelivery(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [showDelivery]);


  return (
    <header className="header">

      {/* PROMOÇÃO */}
      <div className="promo__bar">
        <div className="promo__track">

          <span>
            Compre acima de R$199 e ganhe R$10
            com cupom PRIMEIRACOMPRA10
          </span>

          <span>
            Receba em casa ou retire na loja
          </span>

          <span>
            Sua primeira compra com desconto
          </span>

        </div>
      </div>


      {/* NAVBAR PRINCIPAL */}
      <nav className="navbar">
        <div className="row">

          {/* MENU MOBILE */}
          <div
            className="hamburger"
            onClick={() =>
              setMenuOpen(true)
            }
          >
            <FaBars />
          </div>


          {/* LOGO */}
          <Link
            className="logo"
            to="/"
          >
            <img
              src={trevo}
              alt="Trevo"
            />
          </Link>


          {/* PESQUISA */}
          <SearchProducts
            products={products}
          />


          <div className="actions">

            {/* DELIVERY / RETIRADA */}
            <div
              className="store__wrapper"
              ref={deliveryRef}
            >

              <div
                className="store"
                onClick={() =>
                  setShowDelivery(
                    (prev) => !prev
                  )
                }
              >

                <FaStore className="icon" />

                <div>

                  <div className="actions__address2">
                    Retirar na loja:
                    <br />
                  </div>

                  <div className="actions__address">
                    {currentAddress}
                  </div>

                </div>


                <FaChevronDown
                  className={`arrow ${
                    showDelivery
                      ? "rotate"
                      : ""
                  }`}
                />

              </div>


              {showDelivery && (
                <div className="delivery__dropdown">

                  <DeliveryOptions
                    onSelectStore={(
                      address
                    ) => {
                      setCurrentAddress(
                        address
                      );
                    }}

                    onClose={() =>
                      setShowDelivery(false)
                    }
                  />

                </div>
              )}

            </div>


            {/* USUÁRIO */}
            <Link
              to={
                user
                  ? "/minha-conta"
                  : "/login"
              }
              className="store"
            >

              <FaUser className="icon" />

              <span>

                {user ? (
                  <>
                    <div className="actions__address2">
                      Olá, {firstName}
                    </div>

                    <div className="actions__address">
                      Minha conta
                    </div>
                  </>
                ) : (
                  <>
                    <div className="actions__address2">
                      Olá, faça seu login
                    </div>

                    <div className="actions__address">
                      ou cadastre-se
                    </div>
                  </>
                )}

              </span>

            </Link>

          </div>


          {/* CARRINHO */}
          <button
            type="button"
            className="cart"
            onClick={handleCartClick}
            aria-label="Abrir carrinho"
          >

            <FaShoppingCart className="icon" />

            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems}
              </span>
            )}

          </button>

        </div>
      </nav>


      {/* MENU INFERIOR */}
      <div className="nav__down">
        <div className="row">

          <ul className="main__nav">

            <li
              className="departamentos"
              onClick={() =>
                setDepartments(
                  (prev) => !prev
                )
              }
            >

              <FaTh className="fath" />

              <span>
                Departamentos
              </span>

              <FaChevronDown
                className={`arrow ${
                  departments
                    ? "rotate"
                    : ""
                }`}
              />

            </li>


            <div className="divider"></div>


            <li>
              <a href="#">
                Mais Vendidos
              </a>
            </li>

            <li>
              <a href="#">
                Ofertas
              </a>
            </li>

            <li>
              <a href="#">
                Combos
              </a>
            </li>

            <li>
              <a href="#">
                Coleções
              </a>
            </li>

            <li>
              <a href="#">
                Dicas e Receitas
              </a>
            </li>

            <li>
              <a href="#">
                Faça seu Cartão
              </a>
            </li>

            <li>
              <a href="#">
                Acesse o App
              </a>
            </li>

          </ul>

        </div>
      </div>


      {/* DROPDOWN DE DEPARTAMENTOS */}
      {departments && (
        <DepartmentsDropdown />
      )}


      {/* MENU MOBILE */}
      <NavMobile
        menuOpen={menuOpen}

        closeMenu={() =>
          setMenuOpen(false)
        }

        onLoginClick={() =>
          navigate("/login")
        }

        onDepartmentsClick={() =>
          navigate("/departments")
        }
      />


      {/* OVERLAY MOBILE */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() =>
            setMenuOpen(false)
          }
        />
      )}


      {/* MENSAGEM DE CARRINHO VAZIO */}
      <CartMessage
        message={cartMessage}
      />

    </header>
  );
};


export default Navbar;