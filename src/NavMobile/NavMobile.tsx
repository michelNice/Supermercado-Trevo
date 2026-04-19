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
import '../NavMobile/NavMobile.css';
import trevo from '../imgs/trevo_logo.png';
interface NavMobileProps {
    menuOpen:boolean
    closeMenu:()=> void
    onLoginClick: () => void
    onDepartmentsClick: () => void
}
type MobileMenuItems = {
  icon: React.ReactNode;
  title: string;
  desc: string;
   link?: string
}
const NavMobile:React.FC<NavMobileProps> = ({
    menuOpen,
    closeMenu,
    onLoginClick,
    onDepartmentsClick
    
})=> {
    const menuMobile:MobileMenuItems[] = [
        {
      icon: <FaHome />,
      title: "Início",
      desc: "Acesse nossa loja",
       link: "/"

    },
    {
      icon: <FaThLarge />,
      title: "Departamentos",
      desc: "Produtos separados por departamentos",
       link: "/"
    },
    {
      icon: <FaGift />,
      title: "Combos",
      desc: "Combos de produtos",
       link: "/"
    },
    {
      icon: <FaTag />,
      title: "Ofertas",
      desc: "Descontos imperdíveis para você",
       link: "/"
    },
    {
      icon: <FaLeaf />,
      title: "Coleções",
      desc: "Produtos veganos, fitness e muito mais"
      , link: "/"
    },
    {
      icon: <FaUtensils />,
      title: "Receitas",
      desc: "Aprenda a fazer as melhores receitas",
       link: "/"
    },
    {
      icon: <FaEnvelope />,
      title: "Fale Conosco",
      desc: "Entre em contato com nosso time",
       link: "/"
    },
    {
      icon: <FaInfoCircle />,
      title: "Institucional",
      desc: "Saiba um pouco mais sobre nós",
       link: "/"
    },
    {
      icon: <FaFileAlt />,
      title: "Termos de Uso",
      desc: "Confira nossos termos de uso",
       link: "/"
    }
    ]
    return(
      <header className="mobile__header">
  <div className={`mobile__menu ${menuOpen ? "open" : ""}`}>
    
    <div className="mobile__menu-header">
      <FaArrowLeft className="close__icon" onClick={closeMenu} />

      <div className="mobile__user">
        <h3>Olá, <span>Visitante</span></h3>
        <p>Entre ou cadastre-se</p>
      </div>
    </div>

    <div className="mobile__logo">
      <img src={trevo} alt="Logo Trevo" />
    </div>

    <ul className="mobile__nav">
      {menuMobile.map((item, index) => (
        <li key={index}>
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

    <div className="mobile__button">
      <button onClick={() => {
        closeMenu();
        onLoginClick();
      }}>
        Já tenho uma conta
      </button>

      <button>Ainda não tenho uma conta</button>
    </div>

  </div>
</header>
    )
}
export default NavMobile;