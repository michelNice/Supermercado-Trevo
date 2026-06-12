import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import HeroSlider from "./HeroSlider/HeroSlider";
import Subscription from "./Subscription/Subscription";
import Product from "./Products/Products";
import type { productApi } from "./Types/Product";
import CepModal from "./CepModal/CepModal";
import DepartmentMobile from "./DepartmentsMobile/DepartmentsMobile";
import ShowcaseDeparments from "./ShowcaseDeparments/ShowcaseDeparments";
import Footer from "./Footer/Footer";
import ProductDetails from "./ProductDetails/ProductDetails";

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
              setSelectedProduct={setSelectedProduct}
              setShowModal={setShowModal}
            />
          }
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