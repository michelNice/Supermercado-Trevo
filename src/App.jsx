import { useState } from 'react'
import './App.css'
import Navbar from './Navbar/Navbar'
import HeroSlider from './Hero Slider/HeroSlider'
import Subscription from './Subscription/Subscription'
import DeliveryOptions from './DeliveryOptions/DeliveryOptions'
import DepartmentsDropdown from './DepartmentsDropdown/DepartmentsDropdown'
function App() {
  const [showSubscription, setShowSubscription] = useState(false)

  return (
    <>
      {/* Passa a função corretamente */}
      <Navbar onLoginClick={() => setShowSubscription(true)} />

      {/* Exibe Subscription se true, senão HeroSlider */}
      {showSubscription ? <Subscription /> : <HeroSlider />}

      <DepartmentsDropdown></DepartmentsDropdown>
    </>
  )
}

export default App
