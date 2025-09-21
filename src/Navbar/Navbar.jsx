import React from "react";
import "./Navbar.css";
import { FaSearch, FaUser, FaShoppingCart, FaStore, FaBars } from "react-icons/fa";

function Navbar() {
  return (
    <header className="header">
      {/* Promo Bar */}
      <div className="promo__bar">
        <div className="promo__track">
          <span>Compre acima de R$199 e ganhe R$10 com cupom PRIMEIRACOMPRA10</span>
          <span>Receba em casa ou retire na loja</span>
          <span>Sua primeira compra com desconto</span>
        </div>
      </div>

      {/* Navbar */}
      <div className="navbar">
        {/* Hamburger (mobile only) */}
        <div className="hamburger">
          <FaBars />
        </div>

        {/* Logo */}
        <div className="logo">Arco-Mix</div>


        {/* Search Box */}
        <div className="search__box">
          <input type="text" placeholder="O que você precisa?" />
          <FaSearch className="icon" />
        </div>

        {/* Actions (desktop only) */}
        <div className="actions">
          <div className="store">
            <FaStore className="icon" />
            <span>
              Retirar na loja: <br />
              Rua Eliza Cabral de Souza
            </span>
          </div>

          <div className="store">
            <FaUser className="icon" />
            <span>
              Olá, faça seu login<br />
              ou cadastra-se
            </span>
          </div>
        
        </div>
          <div className="cart">
              <FaShoppingCart className="icon" />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
