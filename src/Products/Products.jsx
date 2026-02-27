import './Products.css'
import React, {useState,useEffect} from 'react';
import {supabase} from '../Supabase/supabaseClient';
function Products(){
      const [products,setProducts] = useState([])
      const [loading, setLoading] = useState(true)

      useEffect(()=> {
          async function getProducts(){
            const  {data,error} = await supabase.from('product').select('*')
            

          console.log(data)
          if(error){
            console.log(error)
          }else{
            setProducts(data)
            setLoading(false)
          }
          }
          getProducts()
      }, [])

      if(loading){
        return <p>Carregando...</p>
      }

      return(
        <div>
          <h1>Product</h1>
          {products.map((product) => (
          <div key={product.id}>
          <img src={product.image_url}/>
          <p>{product.name}</p>
          <p>{product.description}</p>
          <p>R$ {product.price}</p>
        </div>
      ))}
        </div>
      );

}

export default Products;

