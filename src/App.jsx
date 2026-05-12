import "./App.css";
import { useState } from "react";
import Navbar from "./Navbar/Navbar";
import HeroSlider from "./HeroSlider/HeroSlider";
import Subscription from "./Subscription/Subscription";
import CepModal from "./CepModal/CepModal";
import DepartmentMobile from './DepartmentsMobile/DepartmentsMobile'
import ShowcaseDeparments from './ShowcaseDeparments/ShowcaseDeparments'
import Product from './Products/Products'
import Footer from '../src/Footer/Footer'
function App() {
  const [screen, setScreen] = useState("home");
  const [showModal, setShowModal] = useState(false);
  const [cep, setCep] = useState("");

  const handleCepSubmit = () => {
    console.log("CEP enviado:", cep);
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
    <Product setScreen={setScreen}   setCep={setCep} setShowModal={setShowModal}  showModal={showModal}/>
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
      <Footer />
    </>
  );
}

export default App;


