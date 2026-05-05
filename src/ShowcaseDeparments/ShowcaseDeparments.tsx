import imgDepartments1 from '../imgs/dec1.png'
import imgDepartments2 from '../imgs/dec2.png'
import imgDepartments3 from '../imgs/dec3.png'
import imgDepartments4 from '../imgs/dec4.png'
import imgDepartments5 from '../imgs/dec5.png'
import './ShowcaseDeparments.scss'

const imgsShowcase = [
    imgDepartments1,
    imgDepartments2,
    imgDepartments3,
    imgDepartments4,
    imgDepartments5
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