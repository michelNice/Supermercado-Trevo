import { useState } from 'react'
import './App.css'
import Navbar from './Navbar/Navbar'
import HeroSlider from './Hero Slider/HeroSlider'
import Subscription from './Subscription/Subscription'
import DepartmentMobile from './DepartmentsMobile/DepartmentsMobile'
function App() {
  const [showSubscription, setShowSubscription] = useState(false)

  return (
    <>

      <Navbar onLoginClick={() => setShowSubscription(true)} />

      {showSubscription ? <Subscription /> : <HeroSlider />}

    <DepartmentMobile/>
      
    </>
  )
}
export default App
