//import './DepartmentMobile.css'

const departaments = [
    {
        name:'hi there'
    },
    {
        name:'it working'
    }
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