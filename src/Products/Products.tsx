import './Products.scss'
import React, { useState,useEffect } from 'react'
import { supabase } from '../Supabase/supabaseClient'
import { FaCheckCircle } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {useLockBodyScroll}  from '../CepModal/CepModalUtils'
import ProductCard from './ProductCard';
import "swiper/css";
import "swiper/css/navigation";
import img from '../imgs/imgS.png';
import img1 from '../imgs/imgS1.png';
import img2 from '../imgs/imgS2.png'
import ship from '../imgs/shop.png'
import img3 from '../imgs/imgS3.png'
export type productApi = {
     price:  number
     id:string 
     description?: string
     image_url :string 
     name : string 
     old_price:number
     new_price:number
     price_discount: string
     offer?:string
     category:string
     unit_type:string
       

}
type productSectetion = {
  setScreen: React.Dispatch<React.SetStateAction<string>>
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  showModal: boolean
  setSelectedProduct: React.Dispatch<React.SetStateAction<productApi | null>>
}
const Product: React.FC<productSectetion> = ({ setScreen,setShowModal ,showModal, setSelectedProduct}) => {
    const [products, setProducts] = useState<productApi[]>([]);
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
                {mixedProducts.map((product) => (
                     <SwiperSlide key={product.id}>
                        <ProductCard
                            product={product}
                            setScreen={setScreen}
                            setShowModal={setShowModal}
                            setSelectedProduct={setSelectedProduct}
                            
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
                  <h2>QUARTA-FEIRA DA CARNE 🥩</h2>
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
                     {meatProducts.map((product)=> {
                        return(
                             <SwiperSlide key={product.id}>
                                <ProductCard 
                                    product={product}
                                    setScreen={setScreen}
                                    setShowModal={setShowModal}
                                    setSelectedProduct={setSelectedProduct}
                                   
                                />
                            </SwiperSlide>
                        )
                     })}
                 </Swiper>
                 
                <img src={ship} className='ship' alt="" />
                 <h2>HORTIFRUTI DE QUINTA A DOMINGO 🥬🍎</h2>
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
                     {hortiProducts.map((product)=> {
                        return(
                             <SwiperSlide key={product.id}>
                                 <ProductCard 
                                    product={product}
                                    setScreen={setScreen}
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
                 </Swiper>
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