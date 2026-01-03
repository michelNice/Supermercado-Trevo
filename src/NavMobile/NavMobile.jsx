import {
  FaHome,
  FaGift,
  FaTag,
  FaLeaf,
  FaUtensils,
  FaInfoCircle,
  FaFileAlt,
  FaArrowLeft,
  FaThLarge,
  FaEnvelope
} from "react-icons/fa";

import trevo from "../imgs/bebe2.png";
import "./NavMobile.css";

function NavMobile({
  menuOpen,
  closeMenu,
  onLoginClick,
  onDepartmentsClick
}) {

  const mobileMenu = [
    {
      icon: <FaHome />,
      title: "Início",
      desc: "Acesse nossa loja"
    },
    {
      icon: <FaThLarge />,
      title: "Departamentos",
      desc: "Produtos separados por departamentos"
    },
    {
      icon: <FaGift />,
      title: "Combos",
      desc: "Combos de produtos"
    },
    {
      icon: <FaTag />,
      title: "Ofertas",
      desc: "Descontos imperdíveis para você"
    },
    {
      icon: <FaLeaf />,
      title: "Coleções",
      desc: "Produtos veganos, fitness e muito mais"
    },
    {
      icon: <FaUtensils />,
      title: "Receitas",
      desc: "Aprenda a fazer as melhores receitas"
    },
    {
      icon: <FaEnvelope />,
      title: "Fale Conosco",
      desc: "Entre em contato com nosso time"
    },
    {
      icon: <FaInfoCircle />,
      title: "Institucional",
      desc: "Saiba um pouco mais sobre nós"
    },
    {
      icon: <FaFileAlt />,
      title: "Termos de Uso",
      desc: "Confira nossos termos de uso"
    }
  ];

  return (
    <header className="mobile__header">
      <div className={`mobile__menu ${menuOpen ? "open" : ""}`}>

        {/* Header */}
        <div className="mobile__menu-header">
          <FaArrowLeft className="close__icon" onClick={closeMenu} />

          <div className="mobile__user">
            <h3>Olá, <span>Visitante</span></h3>
            <p>Entre ou cadastre-se</p>
          </div>
        </div>

        {/* Logo */}
        <div className="mobile__logo">
          <img src={trevo} alt="Logo Trevo" />
        </div>

        {/* Menu */}
        <ul className="mobile__nav">
          {mobileMenu.map((item, index) => (
            <li
              key={index}
              onClick={() => {
                if (item.title === "Departamentos") {
                  closeMenu();
                  onDepartmentsClick();
                }
              }}
            >
                <a href={item.link}>
                  <div className="icon">{item.icon}</div>
                  <div className="text">
                    <span>{item.title}</span>
                    <p>{item.desc}</p>
                  </div>
              </a>
            </li>
          ))}
        </ul>

        {/* Buttons */}
        <div className="mobile__button">
          <button
            onClick={() => {
              closeMenu();
              onLoginClick();
            }}
          >
            Já tenho uma conta
          </button>

          <button>Ainda não tenho uma conta</button>
        </div>

      </div>
    </header>
  );
}

export default NavMobile;
