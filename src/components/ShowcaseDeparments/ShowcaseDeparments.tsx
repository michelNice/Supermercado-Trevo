import imgDepartments1 from '../../assets/imgs/dec1.png'
import imgDepartments2 from '../../assets/imgs/dec2.png'
import imgDepartments3 from '../../assets/imgs/dec3.png'
import imgDepartments4 from '../../assets/imgs/dec4.png'
import imgDepartments5 from '../../assets/imgs/dec5.png'
import imgDepartments6 from '../../assets/imgs/dec6 (2).png'
import { useNavigate } from "react-router-dom";
import './ShowcaseDeparments.scss'
const ShowcaseDeparments: React.FC = () => {
    const navigate = useNavigate()
    const imgs = [
    {
   img:imgDepartments1,
   productId:"6c285ecb-5603-471f-bc0d-94a527d456a1", 
  },
  {
    img:imgDepartments2,
    productId: "580dd2b9-8f01-4556-a912-d342cd2db348" 
  },
  {
    img:imgDepartments3,
    productId: "6196a592-f743-4f72-bf1c-9d4d72e94c40"
  },
  {
    img:imgDepartments4,
    productId: "14d6a2a4-3306-496f-9479-3ef2f68cd8ef"
  },
  {
    img:imgDepartments5,
    productId: "2696782d-b681-452f-899f-3375a817e5c7"
  },
  {
    img:imgDepartments6,
    productId: "decebbfe-f02b-4f56-8253-7a2c42be979e"
  }
    ]
    return (
  <>
    <div className="imgs">
      {imgs.map((img) => (
        <img
          key={img.productId}
          src={img.img}
          onClick={() => {
            navigate(`/detalhesProduto/${img.productId}`);
          }}
        />
      ))}
    </div>
  </>
);
}
export default ShowcaseDeparments