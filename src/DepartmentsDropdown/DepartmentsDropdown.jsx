import { useState } from 'react';
import './DepartmentsDropdown.css'
import { FiChevronRight } from "react-icons/fi";


function DepartmentsDropdown() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);

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
    }
  ];

  return (
    <>
      <ul onClick={handleClick} className={click ? 'dropdown-menu clicked' : 'dropdown-menu'}>
        {departamentos.map((dep, index) => {
          return (
            <li key={index} className='item'>
              {dep.nome}
               <FiChevronRight className="arrow-icon" />
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default DepartmentsDropdown;
