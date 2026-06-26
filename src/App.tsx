import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import HeroSlider from "./components/HeroSlider/HeroSlider";
import Subscription from "./components/Subscription/Subscription";
import Product from "./components/Products/Products";
import type { productApi } from "./Types/Product";
import CepModal from "./modals/CepModal/CepModal";
import DepartmentMobile from "./components/DepartmentsMobile/DepartmentsMobile";
import ShowcaseDeparments from "./components/ShowcaseDeparments/ShowcaseDeparments";
import Footer from "./components/Footer/Footer";
import ProductDetails from "./components/ProductDetails/ProductDetails";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
function App() {
  const [showModal, setShowModal] = useState(false);
  const [cep, setCep] = useState("");
  const [selectedProduct, setSelectedProduct] =
    useState<productApi | null>(null);
  const [products, setProducts] = useState<productApi[]>([]);
  const handleCepSubmit = () => {
    setShowModal(false);
  };
  return (
    <>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSlider />
              <ShowcaseDeparments />
              <Product
                setProducts={setProducts}
                products={products}
                setShowModal={setShowModal}
                showModal={showModal}
                setSelectedProduct={setSelectedProduct}
              />
            </>
          }
        />

        <Route path="/login" element={<Subscription />} />

        <Route
          path="/departments"
          element={<DepartmentMobile />}
        />

        <Route
           path="/product-details/:id"
          element={
            <ProductDetails
              products={products}
              product={selectedProduct}
              showModal={showModal}
              setSelectedProduct={setSelectedProduct}
              setShowModal={setShowModal}
            />
          }
        />

        <Route 
          path="/cart"  element={<ShoppingCart />}
        />
      </Routes>

      <CepModal
        show={showModal}
        onClose={() => setShowModal(false)}
        cep={cep}
        setCep={setCep}
        onSubmit={handleCepSubmit}
      />

      <Footer />
    </>
  );
}

export default App;