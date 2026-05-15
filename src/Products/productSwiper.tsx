import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

type ProductSectionProps = {
        setScreen: React.Dispatch<React.SetStateAction<string>>
        setShowModal: React.Dispatch<React.SetStateAction<boolean>>
        showModal: boolean
        showUnavailable: React.Dispatch<React.SetStateAction<boolean>>
        setShowUnavailable: React.Dispatch<React.SetStateAction<boolean>>
}

const ProductSwiper: React.FC<ProductSectionProps> = () => {
return (
 <>
      <div className="products-container">
                    <div className="hr"></div>
                    <h2>CORRE QUE É SÓ HOJE ✨</h2>
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={2.2}
                        navigation
                        grabCursor={true}
                        breakpoints={{
                        640: { slidesPerView: 2.2 },
                        768: { slidesPerView: 3 },
                        1024: { slidesPerView: 5 },
                        }}
                        className="products-swiper"
                    >
                    {mixedProducts.map((product) => {
                        return (
                            <SwiperSlide key={product.id}>
                                <div className="product-card">
                                <div
                                    className={`offer ${
                                        product?.offer?.trim().toLowerCase() === 'exclusivo'
                                        ? 'offer__colorDark'
                                        : 'offer__colorLight'
                                    }`}
                                    >
                                    {product?.offer}
                                </div>
                                    <div className="filter-icon" onClick={()=> setShowModal(true)}> <FiList /></div>
                                    <div className="product-img">
                                         <img src={product.image_url} alt={product.name} />
                                    </div>
                                    <button
                                        className="add-btn"
                                        onClick={()=> setScreen('login')}
                                    >
                                        +
                                    </button>
                                    <div className="product-info">
                                        <p className="name">{product.name}</p>
    
                                        <div className="price">
                                        <span className="current">R$ {product.price}</span>
                                        <span className="unit">/{product.unit_type}</span>
                                        </div>
                                        <div className="discount">
                                        <span className="off">{product.price_discount}</span>
                                        <span className="old">R$ {product.old_price}</span>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                          )
                        })}
                    </Swiper>
         </>
     
      )
}

export default ProductSwiper
