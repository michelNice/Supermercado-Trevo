import React, { useState } from 'react'
import { FiShare2 ,FiPlus} from "react-icons/fi";
import './ProductDetails.scss'
import '../Products/Products.scss'
import { type productApi } from '../Types/Types'
import ProductCard from '../Products/ProductCard';
import {SwiperSlide } from "swiper/react";
import ProductSwiper from '../Products/ProductSwiper';
type Props = {
  product: productApi | null
  products?: productApi[]
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<productApi | null>
  >
}
const ProductDetails: React.FC<Props>  =({product, products,setSelectedProduct})=> {
    if(!product)return null
    
    console.log(products)

const relatedProducts = (products ?? []).filter(
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

  <div className=" products-container">
   <div className='related__products'>
  <h2 className="products-container">Produtos Relacionados</h2>

  <ProductSwiper>
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
  </ProductSwiper>
  </div>
</div>
</>
    )
}

export default ProductDetails






