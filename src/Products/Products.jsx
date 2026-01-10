
import './Products.css';
import React, { useState, useEffect } from 'react';


function Products(){
    const [product,setProduct] = useState(null)
    const [isLoading,setIsLoading] = useState(true)
    const [error,setError] = useState(null)
    useEffect(()=>{

        const productData = async ()=> {

            const url = 'https://world.openfoodfacts.org/cgi/search.pl?search_terms=banana&search_simple=1&json=1';

            try{
                
                const response = await fetch(url);

                if(!response.ok){
                    throw new Error(`HTTP ERRO ${response.status}`)
                }

                const result = await response.json()

                setProduct(result)
                setError(null)
                
                
            }catch(error){
                setError(error)
            } finally{
                setIsLoading(false)
            }
        } 
        
        productData()
    },[])

    if(isLoading){

         return <p>Loading data...</p>;
    }

    if(error){

         return <p>Error: {error}</p>;
    }

    return(

        <>

        return{

        }
            {product.products.map(item => {
                    <p key={item.code}>
                        {item.product_name}
                    </p>
            })}
        </>
    )
}

export default Products;