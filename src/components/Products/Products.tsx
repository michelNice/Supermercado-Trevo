import './Products.scss'
import React, { useState,useEffect } from 'react' 
import {supabase} from '../../services/Supabase/supabaseClient'
import { FaCheckCircle } from "react-icons/fa";
import {SwiperSlide } from "swiper/react";
import { useLockBodyScroll } from '../../modals/CepModal/CepModalUtils';
import ProductCard from './ProductCard';
import img from '../../assets/imgs/imgS.png';
import img1 from '../../assets/imgs/imgS1.png';
import img2 from '../../assets/imgs/imgS2.png'
import ship from '../../assets/imgs/shop.png'
import img3 from '../../assets/imgs/imgS3.png'
import ProductSwiper from './ProductSwiper';
import type { productSectetion } from '../../Types/Product';
const Product: React.FC<productSectetion> = ({ setShowModal ,showModal, setSelectedProduct ,setProducts,products}) => {
    const [error,setError] = useState<string | null>(null)
    const [loading,setLoading] = useState(false)
    useLockBodyScroll(showModal) 
    const imgs = [img,img1,img2,img3]
    useEffect(()=> { 
      const Getproduct =  async  ()=> {
        setLoading(true)
         try {
            const {data,error} = await supabase.from('product').select('*')
            if(error){
                setError(error.message)
                return
            }
            setProducts(data)
         } catch (er:any) {
              setError(er.message)
         }
         finally{
            setLoading(false)
         }
       }
       Getproduct()
    }, [])
   if (loading) {
  return (
    <div className="loading">
      <span className="spinner"></span>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}
    const mixedProducts = products.filter(
       (product) =>
    product.category !== "meat" &&
    product.category !== "horti"
    )
    const filterProductsByCategory = (category:string)=> {
        return  products.filter(
        (products)=> products.category == category
    )
    }
    const hortiProducts =  filterProductsByCategory('horti')
    const meatProducts = filterProductsByCategory('meat')
    return(
        <>
            <div className="products-container">
             <div className="hr"></div>
                <h2>CORRE QUE É SÓ HOJE ✨</h2>
              <ProductSwiper>
                {mixedProducts.map((product) => (
                     <SwiperSlide key={product.id}>
                        <ProductCard
                            product={product}
                            setShowModal={setShowModal}
                            setSelectedProduct={setSelectedProduct}
                        />
                    </SwiperSlide>
                ))}
             </ProductSwiper>
                  <h2>QUARTA-FEIRA DA CARNE 🥩</h2>
                 <ProductSwiper>
                     {meatProducts.map((product)=> {
                        return(
                             <SwiperSlide key={product.id}>
                                <ProductCard 
                                    product={product}
                                    setShowModal={setShowModal}
                                    setSelectedProduct={setSelectedProduct}
                                   
                                />
                            </SwiperSlide>
                        )
                     })}
                 </ProductSwiper>
                <img src={ship} className='ship' alt="" />
                 <h2>HORTIFRUTI DE QUINTA A DOMINGO 🥬🍎</h2>
                 <ProductSwiper>
                     {hortiProducts.map((product)=> {
                        return(
                             <SwiperSlide key={product.id}>
                                 <ProductCard 
                                    product={product}
                                    setShowModal={setShowModal}
                                    setSelectedProduct={setSelectedProduct}
                                     showDiscount={
                                    product.name.includes('Mamão') ||
                                    product.name.includes('Banana')
                                    }
                                     />
                        </SwiperSlide>
                        )
                     })}
                 </ProductSwiper>
                 <div className="brands">
                   <FaCheckCircle className="brands__icon" />
                        <div>
                            <h2>COLEÇÕES POR MARCAS</h2>
                            <p>Clique e confira os produtos dos nossos parceiros.</p>
                        </div>
                        </div>
                 <div className="brands-container">
                    {imgs.map((img, index) => (
                        <div className="brand-card" key={index}>
                        <img src={img} alt="marca" />
                        </div>
                    ))}
                </div>
            </div>
           
        </>
    )
}

export default Product;



