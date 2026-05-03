import type React from 'react'
import './DepartmentsMobile.scss'
import {
  FaPumpSoap,
  FaHeartbeat,
  FaCarrot,
  FaWineBottle,
  FaUtensils,
  FaShoppingBasket,
  FaDrumstickBite,
  FaSnowflake,
  FaBaby,
  FaBath,
  FaStore,
  FaBreadSlice,
  FaBacon,
  FaMobileAlt,
  FaPaw
} from "react-icons/fa";
type deparmentMobile = {
    name:string;
    icon:React.ReactNode;
}

const DepartmentMobile:React.FC = ()=> {
    const  departaments:deparmentMobile[] = [
                {
        name: "Limpeza",
        icon: <FaPumpSoap />
        },
        {
        name: "Saúde e bem-estar",
        icon: <FaHeartbeat />
        },
        {
        name: "Hortifruti",
        icon: <FaCarrot />
        },
        {
        name: "Bebidas",
        icon: <FaWineBottle />
        },
        {
        name: "Salgados",
        icon: <FaUtensils />
        },
        {
        name: "Mercearia",
        icon: <FaShoppingBasket />
        },
        {
        name: "Aves, carnes e pescados",
        icon: <FaDrumstickBite />
        },
        {
        name: "Resfriados e congelados",
        icon: <FaSnowflake />
        },
        {
        name: "Infantil e bebê",
        icon: <FaBaby />
        },
        {
        name: "Higiene e beleza",
        icon: <FaBath />
        },
        {
        name: "Bazar",
        icon: <FaStore />
        },
        {
        name: "Padaria",
        icon: <FaBreadSlice />
        },
        {
        name: "Linguiças e defumados",
        icon: <FaBacon />
        },
        {
        name: "Eletro e telefonia",
        icon: <FaMobileAlt />
        },
        {
        name: "Pet",
        icon: <FaPaw />
        }
    ]
    return(
        <>

        </>
    )
}

export default DepartmentMobile