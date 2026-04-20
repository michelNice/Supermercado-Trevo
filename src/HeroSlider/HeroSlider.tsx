import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import './HeroSlider.css'
import img1 from "../imgs/imgSlider1.jpg";
import img2 from "../imgs/imgSlider2.jpg";
import img3 from "../imgs/imgSlider3.jpg";
import img4 from "../imgs/imgSlider4.jpg";
import img5 from "../imgs/imgSlider5.png";
import img6 from "../imgs/imgSlider6.png";
const imgSlider: string[] = [img1, img2, img3, img4, img5, img6];

const HeroSlider: React.FC = () => {
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
      {imgSlider.map((item, index) => (
        <SwiperSlide key={index}>
          <img src={item} alt={`slide-${index}`} />
        </SwiperSlide>
      ))}
    </Swiper>
      <div className="custom-pagination mt-2 flex justify-center gap-2"></div>
    </div>
    
  );
};

export default HeroSlider;