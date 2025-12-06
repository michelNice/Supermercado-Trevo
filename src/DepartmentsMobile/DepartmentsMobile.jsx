
const departaments = [
    {
        name:'Limpeza'
    },
    {
        name:'Saúde e bem-estar'
    },
    {
        name:'Hortifruti'
    },
    {
        name:"Bebidas"
    },
    {
        name: "Salgados",
    },
    {
        name:"Mercearia",
    },
    {
        name:"Aves, carnes e pescados",
    },
    { 
        name: "Pescados",
      
    },
    {
     name: "Resfriados e congelados",
   
    },
]

function DepartmentMobile(){

    return(
        <>
            <ul>
            {departaments.map((item,index)=>{
                return(
                    <li key={index}>
                    {item.name}
                    </li>
                )
            })}

            </ul>
        </>
    );

}

export default DepartmentMobile;