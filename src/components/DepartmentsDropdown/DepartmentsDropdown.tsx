import React, { useState } from "react";
import './DepartmentsDropdown.scss'
import { FiChevronRight } from "react-icons/fi";
type  Department = {
  name:string;
  sub:string[]
}

const DepartmentsDropdown: React.FC = ()=> {
     const [activeIndex, setActiveIndex] = useState<number | null>(null)

const departmentos:Department[] = [
     {
      name:"Limpeza",
      sub:[
        "Sabão pó, barra e líquido",
        "Alvejantes",
        "Água sanitária",
        "Acessórios de limpeza",
        "Amaciantes",
        "Purificador de ar",
        "Papel higiênico",
        "Multiuso",
        "Limpeza geral",
        "Limpadores",
        "Inseticidas",
        "Desodorizador",
        "Desinfetantes",
        "Desengordurantes",
        "Banheiro",
        "Cuidados com a louça"
      ],
    },
    {
      name:"Saúde e bem-estar",
      sub:[
        "Achocolatado light diet",
        "Açúcares",
        "Adoçantes",
        "Enlatados e conservas",
        "Lanches e sobremesas",
        "Molhos e condimentos",
        "Soja e derivados",
        "Barra cereal e granolas",
        "Bebidas especiais",
        "Biscoitos saudáveis",
        "Farináceos",
        "Leites especiais",
        "Massas integrais"
      ]
    },
    { 
      name:"Hortifruti",
      sub:[
        "Folhagem",
        "Frutas",
        "Legumes",
        "Oleaginosas e condimentos",
        "Ovos",
        "Goma de mandioca",
        "Raízes",
        "Empório"
      ]
    },
    {
      name:"Bebidas",
      sub:[
        "Bebidas ice",
        "Cervejas",
        "Destilados",
        "Energéticos e isotônicos",
        "Refrigerantes",
        "Sucos e refrescos em pó",
        "Whisky",
        "Águas",
        "Aperitivo",
        "Licor",
        "Espumantes e vinhos",
        "Aguardente e cachaça",
        "Gin e vodkas"
      ]
    },
    {
      name:"Resfriado e congelado",
      sub:[
        "Batata cong. e vegetais",
        "Hamburguer e empanados",
        "Iogurtes",
        "Manteigas e margarinas",
        "Queijos",
        "Requeijão e creme queijo",
        "Salsichas e embutidos",
        "Pizzas",
        "Polpa de fruta",
        "Sorvete",
        "Pratos prontos",
        "Lasanhas",
        "Açaí e cupuaçu"
      ]
    },
    {
      name:"Mercearia",
      sub:[
         "Biscoitos e bolinhos",
        "Bomboniere e doces",
        "Nutrição infantil",
        "Salgadinhos e aperitivos",
        "Sopas",
        "Queijo ralado",
        "Catchup",
        "Maionese",
        "Catchup",
        "Mostarda",
        "Matinais",
        "Conservas vegetais",
        "Enlatados",
        "Sal, caldos e temperos",
        "Farinhas e farofas",
        "Arroz",
        "Feijão",
        "Azeites, óleos e vinagres"
      ]
    },
    {
      name:"Padaria",
      sub:[
         "Pães",
          "Pães de forma",
          "Tortas e sobremesas",
          "Farinha de rosca",
          "Bolos e broas",
          "Bolachas",
          "Torradas",
          "Salgados",
          "Panetones"
      ]
    },
    {
      name:"Higiene e Beleza",
      sub:[
      "Desodorantes",
      "Barba e depilação",
      "Hidratantes e óleos",
      "Higiene bucal",
      "Manicure e maquiagem",
      "Protetor e repelente",
      "Sabonetes",
      "Utilidades para o corpo",
      "Cabelo",
      "Coloração",
      "Absorventes",
      "Incontinência"
      ]
    }
]
    return(
        <>
           <div className="dropdown-wrapper" onMouseLeave={()=> setActiveIndex(null)}>
                <ul className="dropdown-menu">
                                        {
                    departmentos.map((dep, index) => (
                        <li 
                        key={index}
                        className="item"
                        onMouseEnter={()=> setActiveIndex(index)}
                        >
                        {dep.name}
                         <FiChevronRight className="arrow-icon" />
                        </li>
                    ))
                    }
                </ul>
              {activeIndex !== null && (
                    <ul className="submenu" onMouseEnter={() => setActiveIndex(activeIndex)}>
                        {departmentos[activeIndex]?.sub.map((sub, i) => {
                        return (
                            <li key={i}>
                            <a href="#">{sub}</a>
                            </li>
                        );
                        })}
                    </ul>
                    )}
           </div>
        </>
    )
}

export default DepartmentsDropdown;