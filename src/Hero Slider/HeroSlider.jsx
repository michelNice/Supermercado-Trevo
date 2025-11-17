import './HeroSlider.css';
import 'swiper/css'
import "swiper/css/navigation";
import "swiper/css/pagination";
import {Swiper, SwiperSlide} from  'swiper/react';
import { Navigation,Pagination,Autoplay } from 'swiper/modules';
import imgSlider1 from '../Hero Slider/imgSlider1.jpg';
import imgSlider2 from '../Hero Slider/imgSlider2.jpg';
import imgSlider3 from '../Hero Slider/imgSlider3.jpg';
import imgSlider4 from '../Hero Slider/imgSlider4.jpg';
import imgSlider5 from '../Hero Slider/imgSlider5.png';
import imgSlider6 from '../Hero Slider/imgSlider6.png';
function HeroSlider(){

    return(
        <>
        <section className='hero'>
            <Swiper 
                modules={[Navigation,Pagination,Autoplay]}
                navigation
                pagination={{clickable:true,el:".custom-pagination"}}
                autoplay={{delay:4000,disableOnInteraction: false}}
                loop={true}
                className='mySwiper' // <- O ">" fecha a abertura aqui
            >
                <SwiperSlide>
                    <img src={imgSlider1} alt="Slide 1" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imgSlider2} alt="Slide 2" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imgSlider3} alt="Slide 3" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imgSlider4} alt="Slide 4" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imgSlider5} alt="Slide 3" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imgSlider6} alt="slide 6" />
                </SwiperSlide>
            </Swiper>

             <div className="custom-pagination mt-2 flex justify-center gap-2"></div>
        </section>
        </>

    );
}

export default  HeroSlider;