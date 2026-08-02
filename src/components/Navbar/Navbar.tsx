import "./Navbar.scss";
import trevo from "../../assets/imgs/trevo_logo.png"
import {
  FaUser,
  FaShoppingCart,
  FaStore,
  FaBars,
  FaTh,
  FaChevronDown,
} from "react-icons/fa";
import { useState,useRef,useEffect} from "react";
import NavMobile from "../NavMobile/NavMobile";
import DeliveryOptions from "../DeliveryOptions/DeliveryOptions";
import DepartmentsDropdown from "../DepartmentsDropdown/DepartmentsDropdown";
import { useNavigate ,Link} from "react-router-dom";
import { getSelectedAddress } from "../../utils/storage.ts";
import { useCart } from "../../context/useCart";
import SearchProducts from "../SearchProducts/SearchProducts";
import { type productApi } from "../../Types/Product";
import { useAuth } from "../../context/useAuth";
type NavbarProp = {
      products: productApi[];
  }
const Navbar = ({products}:NavbarProp) => {
  const [menuOpen,setMenuOpen] = useState(false)
  const [showDelivery, setShowDelivery] = useState(false)
  const [departments, setDepartments] = useState(false)
  const defaultAddress = "Rua Barão de Souza Leão, 1170 — Boa Viagem, Recife - PE";
  const deliveryRef = useRef<HTMLDivElement>(null);
  const [currentAddress, setCurrentAddress] = useState(
     getSelectedAddress() ?? defaultAddress
  )
  const {cartItem} = useCart()
  const {user} =  useAuth()

  const firstName =
  user?.user_metadata?.full_name
    ?.split(" ")[0]
    ?.replace(/^./, (letter: string) => letter.toUpperCase()) || "Cliente";
  const totalItems = cartItem.reduce(
  (total, item) => total + item.quantity,
  0
);

  useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    console.log("clicou", event.target);

    if (
      deliveryRef.current &&
      !deliveryRef.current.contains(event.target as Node)
    ) {
      setShowDelivery(false);
    }
  };
  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  const navigate = useNavigate();
 return (
  <header className="header">
    <div className="promo__bar">
      <div className="promo__track">
        <span>Compre acima de R$199 e ganhe R$10 com cupom PRIMEIRACOMPRA10</span>
        <span>Receba em casa ou retire na loja</span>
        <span>Sua primeira compra com desconto</span>
      </div>
    </div>

    <nav className="navbar">
      <div className="row">
        <div className="hamburger" onClick={() => setMenuOpen(true)}>
          <FaBars />
        </div>

        <Link className="logo" to="/">
          <img src={trevo} alt="Trevo" />
        </Link>

        <SearchProducts products={products} />

        <div className="actions">
          <div className="store__wrapper">
            <div
              className="store"
              onClick={() => setShowDelivery(!showDelivery)}
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
                className={`arrow ${showDelivery ? "rotate" : ""}`}
              />
            </div>

            {showDelivery && (
              <div className="delivery__dropdown">
                <DeliveryOptions
                  onSelectStore={(address) => {
                    setCurrentAddress(address);
                  }}
                  onClose={() => setShowDelivery(false)}
                />
              </div>
            )}
          </div>

          <Link
            to={user ? "/minha-conta" : "/login"}
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

          <a
            className="cart"
            onClick={() => navigate("/carrinho")}
          >
            <FaShoppingCart className="icon" />

            {totalItems > 0 && (
              <span className="cart-badge">
                {totalItems}
              </span>
            )}
          </a>
        </div>
      </div>
    </nav>

    <div className="nav__down">
      <div className="row">
        <ul className="main__nav">
          <li
            className="departamentos"
            onClick={() => setDepartments((prev) => !prev)}
          >
            <FaTh className="fath" />
            <span>Departamentos</span>

            <FaChevronDown
              className={`arrow ${departments ? "rotate" : ""}`}
            />
          </li>

          <div className="divider"></div>

          <li><a href="#">Mais Vendidos</a></li>
          <li><a href="#">Ofertas</a></li>
          <li><a href="#">Combos</a></li>
          <li><a href="#">Coleções</a></li>
          <li><a href="#">Dicas e Receitas</a></li>
          <li><a href="#">Faça seu Cartão</a></li>
          <li><a href="#">Acesse o App</a></li>
        </ul>
      </div>
    </div>

    {departments && <DepartmentsDropdown />}

    <NavMobile
      menuOpen={menuOpen}
      closeMenu={() => setMenuOpen(false)}
      onLoginClick={() => navigate("/login")}
      onDepartmentsClick={() => navigate("/departments")}
    />

    {menuOpen && (
      <div
        className="overlay"
        onClick={() => setMenuOpen(false)}
      />
    )}
  </header>
);
    
};
export default Navbar;