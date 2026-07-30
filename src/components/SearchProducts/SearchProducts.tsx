import { useState } from "react";
import { type productApi } from "../../Types/Product";
import { FaSearch } from "react-icons/fa";
import './SearchProducts.scss'
import { useCart } from "../../context/useCart";
type ProsSeach =  {
    products:productApi[]
}
function SearchProducts({products = []}:ProsSeach){
    const {AddToCart} = useCart()
    const [search,setSearch] = useState('')
      const filteredProducts = products.filter((product) =>
  product.name.toLowerCase().includes(search.toLowerCase())
);
    return(
        <div className="search__box">
            <input 
                type="text"
                placeholder="O que você precisa?"
                value={search}
                onChange={(e)=> setSearch(e.target.value)}
            
            />
            <FaSearch className="icon" />
            {search && (
                <div className="search__results">
                    {filteredProducts.map(products => (
                        <div className="search__item" key={products.id}>
                            <img src={products.image_url} alt={products.image_url} />
                            <div className='search__info'>
                                <h4>{products.name}</h4>

                            </div>
                            <button
                            onClick={()=> AddToCart({
                                id:products.id,
                                name: products.name ?? "",
                                price: Number(products.price),
                                image: products.image_url,
                                unit: products.unit_type === "kg" ? "KG" : "UN",
                            })}
                            >+ Adicionar</button>
                        </div>
                    ))}
                </div>
            )}
        </div>

    )
}

export default SearchProducts;