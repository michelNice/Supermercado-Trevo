import './HeroSlider.css';
import 'swiper/css'
import "swiper/css/navigation";
import "swiper/css/pagination";
import {Swiper, SwiperSlide} from  'swiper/react';
import { Navigation,Pagination,Autoplay } from 'swiper/modules';

import imgSlider1 from '../Hero Slider/test1.png';
import imgSlider2 from '../Hero Slider/test2.png';
import imgSlider3 from '../Hero Slider/test2.png';


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
                    <img src={imgSlider3} alt="Slide 3" />
                </SwiperSlide>
                <SwiperSlide>
                    <img src={imgSlider3} alt="Slide 3" />
                </SwiperSlide>
            </Swiper>

             <div className="custom-pagination mt-2 flex justify-center gap-2"></div>
        </section>
        </>

    );
}

export default  HeroSlider;