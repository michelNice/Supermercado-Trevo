import { type productApi } from "../Types/Product";
import { FiList } from "react-icons/fi";
type ProductSectionProps = {
  setScreen: React.Dispatch<React.SetStateAction<string>>
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  product: productApi
  showDiscount?: boolean
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<productApi | null>
  >
}
const ProductCard: React.FC<ProductSectionProps> = ({setShowModal,product,setScreen,showDiscount = true,setSelectedProduct} ) => {
return (
    <>
         <div className="product-card"  onClick={() => {
  setSelectedProduct(product)
  setScreen("productDetails")
}}>
            
                                { showDiscount && (
                                    <div
                                        className={`offer ${
                                            product?.offer?.trim().toLowerCase() === 'exclusivo'
                                            ? 'offer__colorDark'
                                            : 'offer__colorLight'
                                        }`}
                                        >
                                        {product?.offer}
                                    </div>
                                    )}
                                    
                                        <div className="filter-icon"  onClick={(e) => {
                                                e.stopPropagation()
                                                setShowModal(true)
                                            }}
                                                                                        
                                            
                                            > <FiList /></div>
                                        <div className="product-img">
                                             <img src={product.image_url} alt={product.name} />
                                        </div>
                                        <button
                                            className="add-btn"
                                            onClick={(e) => {
                                                    e.stopPropagation()
                                                setScreen('login')
                                               
                                            }}
                                        >
                                            +
                                        </button>
                                        <div className="product-info">
                                            <p className="name">{product.name}</p>
        
                                            <div className="price">
                                            <span className="current">R$ {product.price}</span>
                                            <span className="unit">/{product.unit_type}</span>
                                            </div>
                                            {showDiscount && (
                                            <div className="discount">
                                            <span className="off">{product.price_discount}</span>
                                            <span className="old">R$ {product.old_price}</span>
                                            
                                            </div>
                                        )} 
                             </div>
                </div>
    </>
)
}

export default ProductCard
