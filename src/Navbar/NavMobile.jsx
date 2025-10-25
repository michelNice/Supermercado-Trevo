import React from "react";
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
  FaArrowLeft
} from "react-icons/fa";
import trevo from "../imgs/bebe2.png";
import "./NavMobile.css";

function NavMobile({ menuOpen, closeMenu }) {
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

        {/* Search */}
        <div className="mobile__search">
        
        </div>

        {/* Menu Links */}
        <ul className="mobile__nav">
          <li>
            <FaHome className="icon" /> <a href="#">Início</a>
          </li>
          <li>
            <FaGift className="icon" /> <a href="#">Ofertas</a>
          </li>
          <li>
            <FaTag className="icon" /> <a href="#">Combos</a>
          </li>
          <li>
            <FaLeaf className="icon" /> <a href="#">Coleções</a>
          </li>
          <li>
            <FaUtensils className="icon" /> <a href="#">Dicas e Receitas</a>
          </li>
          <li>
            <FaInfoCircle className="icon" /> <a href="#">Sobre</a>
          </li>
          <li>
            <FaFileAlt className="icon" /> <a href="#">Faça seu Cartão</a>
          </li>
          <li>
              <FaStore className="icon" /> <a href="#">Retirar na loja</a>
          </li>
          <li>
              <FaUser className="icon" /><a href="#">Minha Conta</a>
          </li>

          <li>
              <a href="#"><FaUser className="icon" /><span>Inicio</span><p>Acesse nossa loja</p></a>
          </li>
          
        </ul>

    
        {/* Extra Options */}
        
        <div className="mobile__button">
            <button>Ja tenho um conta</button>
            <button>Ainda nao tenho uma Conta </button>
        </div>
      </div>
    </header>
  );
}

export default NavMobile;
