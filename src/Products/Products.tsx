import './Products.scss'
import React, { useState,useEffect } from 'react'
import { supabase } from '../Supabase/supabaseClient'
import { FiList } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
type productApi = {
    something:boolean
    id:string
    name:number
}
const Product: React.FC<productApi> = (
    something
)=> {
    const [product,setProduct] = useState(false)
    const [cep,setCep] = useState(false)
    const [products, setProducts] = useState<productApi[]>([]);
    const [error,setError] = useState<string | null>(null)
    const [loading,setLoading] = useState(false)
    useEffect(()=> { 
      const Getproduct =  async  ()=> {
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
                ></Swiper>
                {products.map((product) => {
                    return (
                        <div key={product.id}>
                        {product.name}
                        </div>
                    )
                    })}
            </div>
        </>
    )
}

export default Product;