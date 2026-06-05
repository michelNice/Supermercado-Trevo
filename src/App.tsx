import "./App.css";
import { useState } from "react";
import Navbar from "./Navbar/Navbar";
import HeroSlider from "./HeroSlider/HeroSlider";
import Subscription from "./Subscription/Subscription";
import Product from './Products/Products'
import type { productApi } from './Types/Product'
import CepModal from "./CepModal/CepModal";
import DepartmentMobile from './DepartmentsMobile/DepartmentsMobile'
import ShowcaseDeparments from './ShowcaseDeparments/ShowcaseDeparments'
import Footer from './Footer/Footer'
import ProductDetails from './ProductDetails/ProductDetails'
function App() {
  const [screen, setScreen] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [cep, setCep] = useState("");
  const [selectedProduct, setSelectedProduct] =
  useState<productApi | null>(null)
  const [products, setProducts] = useState<productApi[]>([])
  const handleCepSubmit = () => {
    setShowModal(false);
  };

  return (
    <>
          <Navbar
            onLoginClick={() => setScreen("login")}
            onDepartmentsClick={()=> setScreen('departments')}
          />

          {screen === "home" && (<>
        <HeroSlider />
        <ShowcaseDeparments />
       <Product
        setProducts={setProducts}
         products={products}
          setScreen={setScreen}
          setShowModal={setShowModal}
          showModal={showModal}
          setSelectedProduct={setSelectedProduct}
        />
      </>
    )}
          {screen === "login" && <Subscription />}

          <CepModal
            show={showModal}
            onClose={() => setShowModal(false)}
            cep={cep}
            setCep={setCep}
            onSubmit={handleCepSubmit}
          />
          {screen === 'departments' && <DepartmentMobile />}
          {screen === "productDetails" && (
            <ProductDetails
            products={products}
            product={selectedProduct}
            setSelectedProduct={setSelectedProduct}
          />
          )}
          <Footer />

          
    </>
  );
}

export default App;

