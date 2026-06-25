import { FiShare2 ,FiPlus} from "react-icons/fi";
import './ProductDetails.scss'
import '../Products/Products.scss'
import '../Products/Products.scss'
import { type productApi } from "../../Types/Product";
import { useCart } from "../../context/useCart";
import ProductCard from '../Products/ProductCard';
import {SwiperSlide } from "swiper/react";
import ProductSwiper from '../Products/ProductSwiper';
import { useLockBodyScroll } from '../../modals/CepModal/CepModalUtils';

type Props = {
  product: productApi | null
   showModal:boolean
  products?: productApi[]
  showOffer?: boolean
  showDiscount?: boolean
  setSelectedProduct: React.Dispatch<
    React.SetStateAction<productApi | null>
  >
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
}
const ProductDetails: React.FC<Props>  =({product, showModal,products,setSelectedProduct,showDiscount = true,showOffer = true,setShowModal})=> {
    const {AddToCart} = useCart();   
   useLockBodyScroll(showModal)
  if(!product)return null

const relatedProducts = (products ?? []).filter(
  (p) =>
    p.category === product.category &&
    p.id !== product.id
)
   return (
  <>
    <div className="productDetails__container">
      <div className="product__details">
        <div className="mobile__icons">
          <button>
            <FiShare2 />
          </button>
          <button>
            <FiPlus />
          </button>
        </div>

        <img src={product.image_url} alt="" />
      </div>

      <div className="product__info">
        <div>
          <span>{product.description}</span>
        </div>

        <div className="buttons-infor">
          <button className="btn__share">
            <FiShare2 />
            Compartilhar
          </button>

          <button 
              className="btn__addCarrinho "
              onClick={() =>
                AddToCart({
                  id: Number(product.id),
                  name: product.description ?? '',
                  price: Number(product.price),
                })
              }
             >
            <FiPlus />
            Adicionar lista
          </button>
        </div>
      </div>
      <div className="product__buy">
  {showOffer && product.offer && (
    <div
      className={`offerr ${
        product.offer.trim().toLowerCase() === "exclusivo"
          ? "offer__colorDark"
          : "offer__colorLight"
      }`}
    >
      {product.offer}
    </div>
  )}
  <div className="price">
    <span className="current">R$ {product.price}</span>
    <span className="unit">/{product.unit_type}</span>
  </div>
  {showDiscount && product.price_discount && (
    <div className="discount">
      <span className="off">{product.price_discount}</span>
      <span className="old">R$ {product.old_price}</span>
    </div>
  )}
  <button className="btn__addCarrinho">
    + Adicionar ao carrinho
  </button>
</div>
    </div>
    <div className="products-container">
      <div className="related__products">
        <h2 className="products-container">
          Produtos Relacionados
        </h2>
        <ProductSwiper>
          {relatedProducts.map((item) => (
            <SwiperSlide key={item.id}>
              <ProductCard
                product={item}
                setShowModal={setShowModal}
                setSelectedProduct={setSelectedProduct}
                showDiscount={true}
              />
            </SwiperSlide>
          ))}
        </ProductSwiper>
      </div>
    </div>
  </>
);
}

export default ProductDetails






