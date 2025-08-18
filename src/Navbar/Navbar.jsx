function Navbar() {
  return (
    <header>
      
      <div className="promo__bar">
        <span>
          Compre acima de R$199 e ganhe R$10 com cupom PRIMEIRACOMPRA10
        </span>
        <span className="right">
          Receba em casa ou retire na loja
        </span>
      </div>

      
      <div className="main__header">
        {/* Logo */}
        <div className="logo">
          <img src="" alt="Arco-Mix Logo" />
        </div>

        
        <div className="search__bar">
          <input type="text" placeholder="O que você precisa?" />
          <button></button>
        </div>

       
        <div className="header__actions">
          <div className="store__info">
            <span>Retirar na loja:</span>
            <strong>Avenida Zequinha Barreto...</strong>
          </div>

          <div className="login">
            <span>
              Olá, faça seu login <strong>ou cadastre-se</strong>
            </span>
          </div>
          <div className="cart"></div>
        </div>
      </div>
      <nav className="main__nav">
        <ul>
          <li>
            <strong>Departamentos</strong> ⌄
          </li>
          <li>Mais Vendidos</li>
          <li>Ofertas</li>
          <li>Combos</li>
          <li>Coleções</li>
          <li>Dicas e Receitas</li>
          <li>Faça seu Cartão</li>
          <li>Acesse o App</li>
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;
