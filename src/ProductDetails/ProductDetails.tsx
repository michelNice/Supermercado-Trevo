import React, { useState } from 'react'
import './ProductDetails.scss'
import '../Products/Products.scss'
import { type productApi } from '../Products/Products'
type Props ={
    product:productApi | null
}

const ProductDetails: React.FC<Props>  =({product})=> {
    if(!product)return null
    return(
    <>
    <div className="productDetails__container">
        
        {/* COLUNA 1 */}
        <div className="product__details">
        <img src={product.image_url} alt="" />
        </div>

        {/* COLUNA 2 */}
        <div className="product__info">
        <div>
            <span>{product.description}</span>
        </div>

        <button>Compartilhar</button>
        <button>Adicionar lista</button>
        </div>

        {/* COLUNA 3 */}
        <div className="product__buy">
        
        <div className={`offer`}>

        </div>

        <div className="price">
            <span className="current cur">{product.price}</span>
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
</>
    )
}

export default ProductDetails