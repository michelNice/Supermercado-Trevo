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
import DepartmentMobile from "../DepartmentsMobile/DepartmentsMobile";
function NavMobile({ menuOpen, closeMenu ,onLoginClick}) {

  const mobileMenu = [
    {
      icon: <FaHome className="icon" />,
      title: "Início",
      desc: "Acesse nossa loja",
      link: "#"
    },

    {

    icon: <FaThLarge className="icon" />,
    title: "Departamentos",
    desc: "Produtos separados por departamentos",
    link: "#"
    },
     {
    icon: <FaGift className="icon" />,
    title: "Combos",
    desc: "Combos de produtos",
    link: "#"
    },
     {
    icon: <FaTag className="icon" />,
    title: "Ofertas",
    desc: "Descontos imperdíveis para você",
    link: "#"
  },
  {
    icon: <FaLeaf className="icon" />,
    title: "Coleções",
    desc: "Produtos veganos, fitness e muito mais",
    link: "#"
  },
  {
    icon: <FaUtensils className="icon" />,
    title: "Receitas",
    desc: "Aprenda a fazer as melhores receitas",
    link: "#"
  },
   {
    icon: <FaEnvelope className="icon" />,
    title: "Fale Conosco",
    desc: "Entre em contato com nosso time",
    link: "#"
  },
    {
    icon: <FaInfoCircle className="icon" />,
    title: "Institucional",
    desc: "Saiba um pouco mais sobre nós",
    link: "#"
  },
  {
    icon: <FaFileAlt className="icon" />,
    title: "Termos de Uso",
    desc: "Confira nossos termos de uso",
    link: "#"
  }

  ]
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
          {mobileMenu.map((item,index)=>{
            return(
            <li 
            key={index}
            onClick={()=> {
              if(index === 1){
                console.log('hiiii!!!!')
              }
            }}
            >
              <a href={item.link}>
                  {item.icon}
                  <div className="text">
                    <span>{item.title}</span>
                    <p>{item.desc}</p>
                  </div>
              </a>
          </li>
           )
          })}
         
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
