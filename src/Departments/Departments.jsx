import imgDepartments5  from './imgs/img1.png'
import imgDepartments2  from './imgs/img2.png'
import imgDepartments3  from './imgs/img3.png'
import imgDepartments4  from './imgs/img4.png'
import "./css/Deparments.css";


function Departments(){

    return (

        <>
            <div className='imgs'>
                <img src={imgDepartments5} alt="" />
                <img src={imgDepartments2} alt="" />
                <img src={imgDepartments3} alt="" />
                <img src={imgDepartments4} alt="" />
            </div>
            
        </>
    )

}

export default Departments;

