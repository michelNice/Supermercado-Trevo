import "./App.css";
import { useState } from "react";
import Navbar from "./Navbar/Navbar";
import HeroSlider from "./HeroSlider/HeroSlider";
import Subscription from "./Subscription/Subscription";
import Product from './Products/Products'
import CepModal from "./CepModal/CepModal";
import DepartmentMobile from './DepartmentsMobile/DepartmentsMobile'
import ShowcaseDeparments from './ShowcaseDeparments/ShowcaseDeparments'
import Footer from '../src/Footer/Footer'
import ProductDetails from '../src/ProductDetails/ProductDetails'
function App() {
  const [screen, setScreen] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [cep, setCep] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null)
  const handleCepSubmit = () => {
    setShowModal(false);
  };

  return (
    <>
          <Navbar
            onLoginClick={() => setScreen("login")}
            onHomeClick={() => setScreen("home")}
            onDepartmentsClick={()=> setScreen('departments')}
          />

          {screen === "home" && (<>
        <HeroSlider />
        <ShowcaseDeparments />
       <Product
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
            <ProductDetails product={selectedProduct}/>
          )}
          <Footer />

          
    </>
  );
}

export default App;

