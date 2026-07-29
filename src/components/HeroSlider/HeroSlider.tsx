import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { type productApi } from "../../Types/Product";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import './HeroSlider.scss'
import img1 from '../../assets/imgs/imgSlider1.jpg'
import img2 from "../../assets/imgs/imgSlider2.jpg";
import img3 from "../../assets/imgs/imgSlider3.jpg";
import img4 from "../../assets/imgs/imgSlider4.jpg";
import img5 from "../../assets/imgs/imgSlider5.png";
import img6 from "../../assets/imgs/imgSlider6.png";
type HeroSliderProps = {
  products: productApi[];
}
const Slides = [
  {
   img:img1,
   productId:"bd464e1a-faa6-4eac-b4a7-33afa67f0471", 
  },
  {
    img:img2,
    productId: "03d6a9a1-b135-43d0-8e20-237ca498cff1" 
  },
  {
    img:img3,
    productId: "ad24dcb2-a921-49e3-adba-eeb63d81073d"
  },
  {
    img:img4,
    productId: "d761d825-548c-461b-9a8c-28f3cdc459fc"
  },
  {
    img:img5,
    productId: "53b022f4-3b8b-411a-82f8-73f5239ea839"
  },
  {
    img:img6,
    productId: "037a004a-c838-4bae-9629-84a0a64364d3"
  }
]

const HeroSlider: React.FC<HeroSliderProps> = ({ products }) => {
  const navigate = useNavigate()
  return (
    <div className="hero">
      <Swiper
       modules={[Navigation,Pagination,Autoplay]}
                navigation
                pagination={{clickable:true,el:".custom-pagination"}}
                autoplay={{delay:4000,disableOnInteraction: false}}
                loop={true}
                className='mySwiper'
    >
      {Slides.map((slide) => (
          <SwiperSlide key={slide.productId}>
            <img
              src={slide.img}
              onClick={() => {
                const product = products.find(
                  (p) => p.id === slide.productId
                );

                if (product) {
                   navigate(`/detalhesProduto/${product.id}`);
                }
              }}
              style={{ cursor: "pointer" }}
            />
</SwiperSlide>
      ))}
    </Swiper>
      <div className="custom-pagination mt-2 flex justify-center gap-2"></div>
    </div>
    
  );
};

export default HeroSlider;