import './Products.css';
import React, { useState, useEffect } from 'react';


function Products(){
    const [product,setProduct] = useState([])
    useEffect(()=>{

        const productData = async ()=> {
            try{
                
                const res = await fetch('https://fakestoreapi.com/products/category/groceries');

                if(!res.ok){

                    throw Error(`HTTP error: ${response.status}`)
                }
                
            }catch(erro){
                console.log('hi')
            }
        }   
    })

    return(

        <>
            <h1>Product</h1>
        </>
    )
}

export default Products;