import "./Navbar.css";
import trevo from "../imgs/trevo_logo.png";
import {
  FaSearch,
  FaUser,
  FaShoppingCart,
  FaStore,
  FaBars,
  FaTh,
  FaChevronDown,
} from "react-icons/fa";
import { useState } from "react";
import NavMobile from "../NavMobile/NavMobile";
import '../NavMobile/NavMobile.css'
interface NavbarProps {
  onLoginClick:()=> void
  onDepartmentsClick: () => void
}
const Navbar: React.FC<NavbarProps> =({ onLoginClick, onDepartmentsClick }) => {
  const [menuOpen,setMenuOpen] = useState<boolean>(false)
  const [showDelivery, setShowDelivery] = useState<boolean>(false)
  const [departments, setDepartments] = useState(false)
  //const deliveryRef = useRef<HTMLDivElement | null>(null);
  const defaultAddress = "Rua Barão de Souza Leão, 1170 — Boa Viagem, Recife - PE";
  const [currentAddress, setCurrentAddress] = useState<string>(
    localStorage.getItem("selectedAddress") ?? defaultAddress
  )
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
            <a className="logo" href="/">
            <img src={trevo} alt="Trevo" />
          </a>
          <div className="search__box">
            <input type="text" placeholder="O que você precisa?" aria-label="Buscar produtos"/>
             <FaSearch className="icon seacher" />
         </div>
           <div className="actions">
            <div className="store__wrapper">
              <div
                className="store"
                onClick={() => setShowDelivery(!showDelivery)}
              >
                <FaStore className="icon" />
                <span>
                  <div className="actions__address2">
                    Retirar na loja: <br />
                  </div>
                  <div className="actions__address">{currentAddress}</div>
                </span>
                 <FaChevronDown
                  className={`arrow ${showDelivery ? "rotate" : ""}`}
                />
              </div>
            </div>
            <div
              className="store"
              onClick={onLoginClick}
              style={{ cursor: "pointer" }}
            >
              <FaUser className="icon" />
              <span>
                <div className="actions__address2">
                  Olá, faça seu login <br />
                </div>
                <div className="actions__address"> ou cadastre-se</div>
              </span>
            </div>
            
          </div>
         <a className="cart" href="#">
            <FaShoppingCart className="icon" />
          </a>
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
        <NavMobile
        menuOpen={menuOpen}
        closeMenu={() => setMenuOpen(false)}
        onLoginClick={onLoginClick}
        onDepartmentsClick={onDepartmentsClick} 
      />
      {menuOpen && (
        <div className="overlay" onClick={() => setMenuOpen(false)}></div>
      )}
      </header>
  );
};

export default Navbar;