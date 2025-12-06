import { useState } from 'react'
import './App.css'
import Navbar from './Navbar/Navbar'
import HeroSlider from './Hero Slider/HeroSlider'
import Subscription from './Subscription/Subscription'
//import DeliveryOptions from './DeliveryOptions/DeliveryOptions'
//import DepartmentsDropdown from './DepartmentsDropdown/DepartmentsDropdown'
import DepartmentMobile from './DepartmentsMobile/DepartmentsMobile'
function App() {
  const [showSubscription, setShowSubscription] = useState(false)

  return (
    <>

     
      {/* Passa a função corretamente */}
      <Navbar onLoginClick={() => setShowSubscription(true)} />

      {showSubscription ? <Subscription /> : <HeroSlider />}


      
    </>
  )
}

export default App
