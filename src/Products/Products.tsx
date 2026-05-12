import './Products.scss'
import React, { useState,useEffect } from 'react'
import { supabase } from '../Supabase/supabaseClient'
import { FiList } from "react-icons/fi";
import { FaCheckCircle } from "react-icons/fa";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import {useLockBodyScroll}  from '../CepModal/CepModalUtils'
import "swiper/css";
import "swiper/css/navigation";
import img from '../imgs/imgS.png';
import img1 from '../imgs/imgS1.png';
import img2 from '../imgs/imgS2.png'
import ship from '../imgs/shop.png'
import img3 from '../imgs/imgS3.png'
type productApi = {
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
     setScreen: React.Dispatch<React.SetStateAction<string>>
     setShowModal: React.Dispatch<React.SetStateAction<boolean>>
     showModal: boolean
     showUnavailable: React.Dispatch<React.SetStateAction<boolean>>
     setShowUnavailable: React.Dispatch<React.SetStateAction<boolean>>
}
const Product: React.FC<productApi> = ({ setScreen,setShowModal ,showModal}) => {
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
    </div>
  )
}

    const mixedProducts = products.filter(
       (product) => product.category !== "meat" && 'horti' !== product.category
    )
    const meatProducts = products.filter(
       (product) => product.category === "meat"
    )
    const hortiProducts = products.filter(
        (products)=> products.category == 'horti'
    )
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
                                                 <button className="add-btn"   onClick={()=> setScreen('login')}>
                                                     +
                                                 </button>
                                                 <div className="product-img">
                                                   <img src={product.image_url} alt={product.name} />
                                                </div>
                                                   <div className="product-info">
                                                        <p className="name">{product.name}</p>
                                                        <div className="price">
                                                                <span className="current">
                                                                    R$ {product.price}
                                                                </span>
                                                                <span className="unit">/{product.unit_type}</span>
                                                        </div>
                                                        <div className="discount">
                                                                <span className="off">
                                                                    {product.price_discount}
                                                                </span>
                                                                <span className="old">
                                                                    R$ {product.old_price}
                                                                </span>
                                                         </div>
                                                   </div>
                                          </div>
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
                                 <div className="product-card">
                                           <div className="filter-icon" onClick={()=> setShowModal(true)}> <FiList /></div>
                                                 <button className="add-btn" onClick={()=> setScreen('login')}>
                                                     +
                                                 </button>
                                                 <div className="product-img">
                                                   <img src={product.image_url} alt={product.name} />
                                                </div>
                                                   <div className="product-info">
                                                        <p className="name">{product.name}</p>
                                                        <div className="price">
                                                                <span className="current">
                                                                    R$ {product.price}
                                                                </span>
                                                                <span className="unit">/{product.unit_type}</span>
                                                        </div>
                                                        
                                                   </div>
                                          </div>
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