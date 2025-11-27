import { useState } from 'react';
import './DepartmentsDropdown.css';
import { FiChevronRight } from "react-icons/fi";

function DepartmentsDropdown() {
  const [activeIndex, setActiveIndex] = useState(null);

  const departamentos = [
    {
      nome:"Limpeza",
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
      nome:"Saúde e bem-estar",
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
      nome:"Hortifruti",
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
      nome:"Bebidas",
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
      nome:"Salgados",
      sub:[
        "Bacalhau",
        "Fígado bovino",
        "Cortes suínos salgados"
      ]
    }
  ];

  return (
    <div 
      className="dropdown-wrapper"
      onMouseLeave={() => setActiveIndex(null)}  // só fecha quando sai do wrapper
    >
      
      <ul className="dropdown-menu">
        {departamentos.map((dep, index) => (
          <li
            key={index}
            className="item"
            onMouseEnter={() => setActiveIndex(index)} // abre ao passar o mouse
          >
            {dep.nome}
            <FiChevronRight className="arrow-icon" />
          </li>
        ))}
      </ul>

      {activeIndex !== null && (
        <ul 
          className="submenu"
          onMouseEnter={() => setActiveIndex(activeIndex)} // NÃO fecha
        >
          {departamentos[activeIndex].sub.map((sub, i) => (
            <li key={i} className="subitem">
              <a href="#">{sub}</a>
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}

export default DepartmentsDropdown;
