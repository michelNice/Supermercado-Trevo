import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import type { productApi } from "./Types/Product";
import HeroSlider from "./components/HeroSlider/HeroSlider";
import Subscription from "./components/Subscription/Subscription";
import Product from "./components/Products/Products";
import ProductDetailsWrapper from "./components/ProductDetails/ProductDetailsWrapper";
import CepModal from "./modals/CepModal/CepModal";
import DepartmentMobile from "./components/DepartmentsMobile/DepartmentsMobile";
import ShowcaseDeparments from "./components/ShowcaseDeparments/ShowcaseDeparments";
import Footer from "./components/Footer/Footer";
import ShoppingCart from "./components/ShoppingCart/ShoppingCart";
import Address from "./components/Adress/Address";
import Payment from "./components/Payment/Payment";
import PurchaseConfirmed from "./components/purchaseConfirmed/PurchaseConfirmed";
import UserAccount from "./components/UserAccount/UserAccount";
import ResetPassword from "./components/ResetPassword/ResetPassword";

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
      <Navbar products={products} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSlider products={products} />
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

        {/* NOVA ROTA */}
        <Route path="/minha-conta" element={<UserAccount />} />

        <Route
          path="/departments"
          element={<DepartmentMobile />}
        />

        <Route
          path="/detalhesProduto/:id"
          element={
            <ProductDetailsWrapper
              products={products}
              showModal={showModal}
              setSelectedProduct={setSelectedProduct}
              setShowModal={setShowModal}
            />
          }
        />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/carrinho" element={<ShoppingCart />} />

        <Route
          path="/purchase-confirmed"
          element={<PurchaseConfirmed />}
        />

        <Route path="/pagamento" element={<Payment />} />

        <Route path="/endereço" element={<Address />} />
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