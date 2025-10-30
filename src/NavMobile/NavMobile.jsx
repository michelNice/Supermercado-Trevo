
import {
  FaTimes,
  FaHome,
  FaGift,
  FaTag,
  FaLeaf,
  FaUtensils,
  FaInfoCircle,
  FaFileAlt,
  FaStore,
  FaUser,
  FaShoppingCart,
  FaArrowLeft,
  FaThLarge,
  FaEnvelope
} from "react-icons/fa";
import trevo from "../imgs/bebe2.png";
import "./NavMobile.css";

function NavMobile({ menuOpen, closeMenu ,onLoginClick}) {
  return (
    <header className="mobile__header">
      <div className={`mobile__menu ${menuOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="mobile__menu-header">
          <FaArrowLeft className="close__icon" onClick={closeMenu} />
          <div className="mobile__user">
            <h3>
              Olá, <span>Visitante</span>
            </h3>
            <p>Entre ou cadastre-se</p>
          </div>
        </div>
        {/* Logo */}
        <div className="mobile__logo">
          <img src={trevo} alt="Logo Trevo" />
        </div>
        {/* Menu Links */}
        <ul className="mobile__nav">
          <li>
              <a href="#">
                  <FaHome className="icon" />
                  <div className="text">
                    <span>Início</span>
                    <p>Acesse nossa loja</p>
                  </div>
              </a>
          </li>
          <li>
              <a href="#">
                  <FaThLarge className="icon" />
                  <div className="text">
                      <span>Departamentos</span>
                      <p>Produtos separados por departamentos</p>
                  </div>
              </a>
          </li>
          <li>
              <a href="#">
                  <FaGift className="icon" />
                  <div className="text">
                       <span>Combos</span>
                      <p>Combos de produtos</p>
                  </div>
              </a>
          </li>
          <li>
            <a href="#">
                <FaTag className="icon" />
                <div className="text">
                    <span>Ofertas</span>
                    <p>Descontos imperdíveis para você</p>
                </div>
            </a>
          </li>
          <li>
              <a href="#">
                  <FaLeaf className="icon" />
                  <div className="text">
                     <span>Coleções</span>
                    <p>Produtos veganos, fitness e muito mais</p>
                  </div>
              </a>
          </li>
          <li>
              <a href="#">
                <FaUtensils className="icon"/>
                <div className="text">
                  <span>Receitas</span>
                  <p>Aprenda a fazer as melhores receitas</p>
                </div>
              </a>
          </li>
          <li>
          <a href="#">
            <FaEnvelope className="icon" />
            <div className="text">
              <span>Fale Conosco</span>
              <p>Entre em contato com nosso time</p>
            </div>
          </a>
          </li>
          <li>
              <a href="#">
                  <FaInfoCircle  className="icon"/>
                  <div className="text">
                    <span>Institucional</span>
                    <p>Saiba um pouco mais sobre nós</p>
                  </div>
              </a>
          </li>
          <li>
              <a href="#">
                  <FaFileAlt className="icon" />
                  <div className="text">
                          <span>Termos de Uso</span>
                        <p>Confira nossos termos de uso</p>
                  </div>
              </a>
          </li>
          
        </ul>

    
        {/* Extra Options */}
        
        <div className="mobile__button">
             <button
              onClick={() => {
                closeMenu();
                setTimeout(() => onLoginClick()); // pequeno delay
              }}
            >Já tenho uma conta
            </button>
            <button>Ainda nao tenho uma Conta </button>
        </div>
      </div>
    </header>
  );
}

export default NavMobile;
