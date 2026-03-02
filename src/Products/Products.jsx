import './Products.css'
import React, {useState,useEffect} from 'react';
import {supabase} from '../Supabase/supabaseClient';
function Products(){
      const [products,setProducts] = useState([])
      const [loading, setLoading] = useState(true)

      useEffect(()=> {
          async function getProducts(){
            const  {data,error} = await supabase.from('product').select('*').eq('category_id', '99114d6e-6207-4fbc-81fc-793ec4f2f215')
            

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
        <div className="products">
      {products.map((product) => (
      <div className="product-card" key={product.id}>
        <div className="offer">Superoferta</div>
        <div className="product-img">
         <img src={product.image_url} alt={product.name} />
      </div>
      <button className="add-btn">+</button>

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
  ))}
</div>
);

}

export default Products;
/*



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
*/