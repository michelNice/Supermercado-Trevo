/*import './App.css'
import { useState } from 'react'
import Navbar from './Navbar/Navbar'
import HeroSlider from './HeroSlider/HeroSlider'
import Subscription from './Subscription/Subscription'
import CepModal from './CepModal/CepModal'
function App() {
  const [screen,setScreen] = useState('home')
  return (
    <>
      <Navbar 
        onLoginClick={()=> setScreen('login')}
        onHomeClick={()=> setScreen('home')}
        onDepartmentsClick={()=> setScreen('departments')} // 🔥 AQUI
      />
      {screen === 'home' && (
          <HeroSlider />
      )}
      {screen === 'login' && <Subscription />}
      
      
    </>
  )
}

export default App
*/


import "./App.css";
import { useState } from "react";
import Navbar from "./Navbar/Navbar";
import HeroSlider from "./HeroSlider/HeroSlider";
import Subscription from "./Subscription/Subscription";
import CepModal from "./CepModal/CepModal";
import DepartmentMobile from './DepartmentsMobile/DepartmentsMobile'
import ShowcaseDeparments from './ShowcaseDeparments/ShowcaseDeparments'

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

      {screen === "home" && <HeroSlider />}
      <ShowcaseDeparments />
      {screen === "login" && <Subscription />}

      <CepModal
        show={showModal}
        onClose={() => setShowModal(false)}
        cep={cep}
        setCep={setCep}
        onSubmit={handleCepSubmit}
      />
      {screen === 'departments' && <DepartmentMobile />}
    </>
  );
}

export default App;


