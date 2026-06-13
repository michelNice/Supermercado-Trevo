import imgDepartments1 from '../../assets/imgs/dec1.png'
import imgDepartments2 from '../../assets/imgs/dec2.png'
import imgDepartments3 from '../../assets/imgs/dec3.png'
import imgDepartments4 from '../../assets/imgs/dec4.png'
import imgDepartments5 from '../../assets/imgs/dec5.png'
import imgDepartments6 from '../../assets/imgs/dec6 (2).png'
import './ShowcaseDeparments.scss'
const imgsShowcase = [
    imgDepartments1,
    imgDepartments2,
    imgDepartments3,
    imgDepartments4,
    imgDepartments5,
    imgDepartments6
   
]
const ShowcaseDeparments: React.FC = () => {
    return (
        <>
            <div className="imgs">
                {imgsShowcase.map((img,index)=> {
                    return(
                        <img key={index} src={img}/>
                    )
                })}
            </div>
        </>
    )
}

export default ShowcaseDeparments