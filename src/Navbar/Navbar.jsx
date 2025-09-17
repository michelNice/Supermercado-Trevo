import React from "react";
import "./Navbar.css";
import { FaSearch, FaUser, FaShoppingCart, FaStore } from "react-icons/fa";

function Navbar() {
  return (
    <header className="header">
      {/* Barra promocional */}
      <div className="promo__bar">
        <div className="promo__track">
          <span>Compre acima de R$199 e ganhe R$10 com cupom PRIMEIRACOMPRA10</span>
          <span>Receba em casa ou retire na loja</span>
          <span>Sua primeira compra com desconto</span>
        </div>
      </div>

      {/* Navbar principal */}
      <div className="navbar">
        {/* Logo */}
        <div className="logo">Logo</div>

        {/* Caixa de pesquisa */}
        <div className="search__box">
          <input type="text" placeholder="O que você precisa?" />
          <FaSearch className="icon" />
        </div>

        {/* Ações */}
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

          <div className="cart">
            <FaShoppingCart className="icon" />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;

