/*import './DepartmentMobile.css'
import {
  Splay,
  HeartPulse,
  Apple,
  Wine,
  Sandwich,
  ShoppingBasket,
  Fish,
  Snowflake
} from 'lucide-react';

const  departaments = [

    {
        name:'Limpeza',
        icon: <Splay />
    },
    {
        name:'Saúde e bem-estar',
        icon:<HeartPulse />
    },
    {
        name:"Hortifruti",
        icon:<Apple />
    }
    ,
    {
       name:"Bebidas",
       icon:<Wine />
    },
    {
      name:"Salgados",
      icon: <Sandwich />
    },
    {
        name:"Mercearia",
        icon:<ShoppingBasket />

    },
    {
        name:"Aves, carnes e pescados",
        icon: <Fish />
    },
    { name: "Resfriados e congelados",
         icon: <Snowflake />
    }
]
function DepartmentMobile(){

    return(
        <>
          <ul>
              {departaments.map((item,index)=> {
                  <li key={index}>{item.icon}</li>
              })}
          </ul>
        </>
    );

}

export default DepartmentMobile;

*/