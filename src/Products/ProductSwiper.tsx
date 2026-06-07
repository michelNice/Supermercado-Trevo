import { Swiper } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
type Props = {
    children: React.ReactNode;
}
const ProductSwiper = ({ children }: Props) => {
    return (
    <Swiper
      modules={[Navigation]}
      spaceBetween={16}
      slidesPerView={2.2}
      navigation
      grabCursor
      breakpoints={{
        640: { slidesPerView: 2.2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 5 },
      }}
      className="products-swiper"
    >
      {children}
    </Swiper>
  );
}
export default ProductSwiper;