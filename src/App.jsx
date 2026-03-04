import { useState } from 'react'
import './App.css'
import Navbar from './Navbar/Navbar'
import HeroSlider from './Hero Slider/HeroSlider'
import Subscription from './Subscription/Subscription'
import DepartmentMobile from './DepartmentsMobile/DepartmentsMobile'
import Departments from './Departments/Departments'
import Products from './Products/Products'
import CepModal from './CepModal/CepModal'
function App() {
  const [screen, setScreen] = useState('home')
  const [showCep, setShowCep] = useState(false)
  return (
    <>
      <Navbar 
        onLoginClick={() => setScreen('login')}
        onDepartmentsClick={() => setScreen('departments')}
        onHomeClick={() => setScreen('home')}
      />

      {/* HOME */}
      {screen === 'home' && (
        <>
          <HeroSlider />
          <Departments />
           <Products setScreen={setScreen} setShowCep={setShowCep}/>
        </>
      )}

      {/* DEPARTMENTS (mobile ou página própria) */}
      {screen === 'departments' && <DepartmentMobile />}

      {/* LOGIN / SUBSCRIPTION */}
      {screen === 'login' && <Subscription />}

      
        <CepModal
  show={showCep}
  onClose={() => setShowCep(false)}
/>
      
    </>
  )
}

export default App
