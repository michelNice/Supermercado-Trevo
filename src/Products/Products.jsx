/*import './Products.css'
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
*/



import './Products.css'
import React, { useState, useEffect } from 'react'
import { supabase } from '../Supabase/supabaseClient'

function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase
        .from('product')
        .select(`
          *,
          categories (
            id,
            name
          )
        `)

      if (error) {
        console.log(error)
      } else {
        setProducts(data)
        setLoading(false)
      }
    }

    getProducts()
  }, [])

  if (loading) {
    return <p>Carregando...</p>
  }

  // 🔥 Agrupa produtos por categoria automaticamente
  const groupedProducts = products.reduce((acc, product) => {
    const categoryName = product.categories?.name || "Sem categoria"

    if (!acc[categoryName]) {
      acc[categoryName] = []
    }

    acc[categoryName].push(product)
    return acc
  }, {})

  return (
    <div>
      <h1>Produtos</h1>

      {Object.entries(groupedProducts).map(([categoryName, items]) => (
        <div key={categoryName} className="category-section">
          
          <h2>{categoryName}</h2>

          <div className="products-grid">
            {items.map(product => (
              <div key={product.id} className="product-card">
                <img 
                  src={product.image_url} 
                  alt={product.product}
                  width="150"
                />
                <p>{product.product}</p>
                <p>R$ {product.price}</p>
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  )
}

export default Products
