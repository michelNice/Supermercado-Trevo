import React from "react";
import "./Navbar.css";
import trevo from   "../imgs/bebe2.png"
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
        <div className="row">
          {/* Hamburger (mobile only) */}
          <div className="hamburger">
            <FaBars />
          </div>
       
          <div className="logo"> <img src={trevo} alt="" /></div>
         
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
                <div className="actions__address2">Retirar na loja: <br /></div>
                <div className="actions__address">Rua Eliza Cabral de Souza</div>
              </span>
            </div>

             <div className="store">
              <FaUser className="icon" />
              <span>
                <div className="actions__address2">Olá, faça seu login <br /></div>
                <div className="actions__address"> ou cadastre-se</div>
              </span>
            </div>
            
          </div>

          {/* Cart */}
          <div className="cart">
            <FaShoppingCart className="icon" />
          </div>
        </div>
      </div>
      
    </header>
  );
}

export default Navbar;
