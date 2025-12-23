import {
  FaPumpSoap,
  FaHeartbeat,
  FaCarrot,
  FaWineBottle,
  FaUtensils,
  FaShoppingBasket,
  FaDrumstickBite,
  FaSnowflake,
} from "react-icons/fa";
import "./DepartmentsMobile.css";
const departaments = [
  { 
    name: "Limpeza",
    icon: <FaPumpSoap /> 
  },
  {
    name: "Saúde e bem-estar",
     icon: <FaHeartbeat /> 
   },
  { name: "Hortifruti",
     icon: <FaCarrot /> 
  },
  { 
    name: "Bebidas",
     icon: <FaWineBottle /> 
  },
  { name: "Salgados", 
    icon: <FaUtensils /> 
  },
  {
     name: "Mercearia",
     icon: <FaShoppingBasket /> }
     ,
  { 
    name: "Aves, carnes e pescados",
     icon: <FaDrumstickBite /> },
  { 
    name: "Resfriados e congelados", 
    icon: <FaSnowflake /> 
  },
];


function DepartmentMobile(){
    return(
    <>
        <div className="DepartmentMobile">
          <h3>Departaments</h3>
          <ul>
            {departaments.map((item, index) => (
              <li key={index}>
                <a href="">
                  {item.icon}
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
    </>
  );
}

export default DepartmentMobile;