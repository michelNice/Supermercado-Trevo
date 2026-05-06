import './Products.scss'
import React, { useState,useEffect } from 'react'
import { supabase } from '../Supabase/supabaseClient'
import { FiList } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
type productApi = {
     price:  number
     id:string 
    description?: string
     image_url :string 
     name : string 

}
const Product: React.FC = (

)=> {
    //const [product,setProduct] = useState(false)
    const [cep,setCep] = useState(false)
    const [products, setProducts] = useState<productApi[]>([]);
    const [error,setError] = useState<string | null>(null)
    const [loading,setLoading] = useState(false)
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

    if(loading){
        return <p>Carregando...</p>
    }
    return(
        <>
            <div className="products-container">
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
                {products.map((product) => {
                    return (
                        <SwiperSlide key={product.id}>
                            <div className="product-card">
                                <div className="offer">Superoferta</div>
                                <div className="filter-icon" onClick={()=> setCep(true)}> <FiList /></div>
                                <div className="product-img">
                                     <img src={product.image_url} alt={product.name} />
                                </div>
                                <button
                                    className="add-btn"
                                    //onClick={() => something("login")}
                                >
                                    +
                                </button>
                                <div className="product-info">

                                    <p className="name">{product.name}</p>

                                    <div className="price">
                                    <span className="current">R$ {product.price}</span>
                                    <span className="unit">/un</span>
                                    </div>

                                    <div className="discount">
                                    <span className="off">29% OFF</span>
                                    <span className="old">R$ 16,99</span>
                                    </div>

                                </div>
                            </div>
                        </SwiperSlide>
                      )
                    })}
                </Swiper>
            </div>
            
        </>
    )
}

export default Product;