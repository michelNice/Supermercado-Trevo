import React, { useState } from 'react'
import { FiShare2 ,FiPlus} from "react-icons/fi";
import './ProductDetails.scss'
import '../Products/Products.scss'
import { type productApi } from '../Products/Products'
import ProductCard from '../Products/ProductCard';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import img from '../imgs/test card.png'
type Props ={
    product:productApi | null
     products: productApi[]
     setSelectedProduct: React.Dispatch<
    React.SetStateAction<productApi | null>
  >
}
const ProductDetails: React.FC<Props>  =({product, products,setSelectedProduct})=> {
    if(!product)return null
    if (!product) return null

const relatedProducts = products.filter(
  (p) =>
    p.category === product.category &&
    p.id !== product.id
)
    return(
    <>
    <div className="productDetails__container">
        <div className="product__details">
    <div className="mobile__icons">
        <button>
        <FiShare2 />
        </button>
        <button>
        <FiPlus />
        </button>
   </div>
       <img src={product.image_url} alt="" />
  </div>
        <div className="product__info">
        <div>
            <span>{product.description}</span>
        </div>
        <div className='buttons-infor'>
            <button className='btn__share'>
             <FiShare2 />
              Compartilhar
        </button>
        <button className='btn__list'>
                <FiPlus />
             Adicionar lista

        </button>
        </div>
        
        </div>
        <div className="product__buy">
          <div
                className={`offerr ${
                    product?.offer?.trim().toLowerCase() === 'exclusivo'
                         ? 'offer__colorDark'
                         : 'offer__colorLight'
                                        }`}
                >
               {product?.offer}
        </div>
        <div className="price">
            <span className="current">{product.price}</span>
            <span className="unit">/{product.unit_type}</span>
        </div>

        <div className="discount">
            <span className="off">{product.price_discount}</span>
            <span className="old">R$ {product.old_price}</span>
        </div>
         <button className="btn__addCarrinho">
            + Adicionar ao carrinho
        </button>
        </div>

  </div>

  <div className="related-products">
  <h2>Produtos Relacionados</h2>

  <Swiper
    modules={[Navigation]}
    spaceBetween={16}
    slidesPerView={2.2}
    navigation
    breakpoints={{
      640: { slidesPerView: 2.2 },
      768: { slidesPerView: 3 },
      1024: { slidesPerView: 5 },
    }}
  >
    {relatedProducts.map((item) => (
      <SwiperSlide key={item.id}>
        <ProductCard
          product={item}
          setScreen={() => {}}
          setShowModal={() => {}}
          setSelectedProduct={setSelectedProduct}
        />
      </SwiperSlide>
    ))}
  </Swiper>
</div>
</>
    )
}

export default ProductDetails