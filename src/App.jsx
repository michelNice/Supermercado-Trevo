/*import { useState } from 'react'
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
*/


import { useState } from 'react'
import './App.css'
import Navbar from './Navbar/Navbar'
import HeroSlider from './Hero Slider/HeroSlider'
import Subscription from './Subscription/Subscription'
import DepartmentMobile from './DepartmentsMobile/DepartmentsMobile'
import Departments from './Departments/Departments'
function App() {
  const [screen, setScreen] = useState('home')

  return (
    <>
      <Navbar 
        onLoginClick={() => setScreen('login')}
        onDepartmentsClick={() => setScreen('departments')}
      />

      {screen === 'home' && <HeroSlider />}
      {screen === 'departments' && <DepartmentMobile />}
      {screen === 'login' && <Subscription />}

      <Departments />
    </>
  )
}

export default App


