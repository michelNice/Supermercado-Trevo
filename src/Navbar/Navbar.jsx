import React from "react";
import "./Navbar.css"
import { FaSearch, FaUser, FaShoppingCart, FaStore } from "react-icons/fa";

function Navbar() {

  return (
  <header className="header">
    <div className="promo__bar">
      <div className="promo__track">
        <span>Compre acima de R$199 e ganhe R$10 com cupom PRIMEIRACOMPRA10</span>
        <span>Receba em casa ou retire na loja</span>
        <span>Sua primeira compra com desconto</span>
        <span>Compre acima de R$199 e ganhe R$10 com cupom PRIMEIRACOMPRA10</span>
        <span>Receba em casa ou retire na loja</span>
        <span>Sua primeira compra com desconto</span>
      </div>
    </div>

    <div className="navbar">
      <div className="logo">logo</div>

      <div className="seach__box">
        <input type="text" placeholder="O que você precisa?" />
        <FaSearch className="icon" />
      </div>

      <div className="actions">
        <div className="store">
          <FaStore />{" "}
          <span>
            Retirar na loja:<br />Rua Eliza Cabral de Souza, 78
          </span>
        </div>
        <div className="login">
          <FaUser />{" "}
          <span>
            Olá, faça seu login<br />ou cadastre-se
          </span>
        </div>
        <div className="cart">
          <FaShoppingCart />
        </div>
      </div>
    </div>
  </header>
);

}


export default Navbar;