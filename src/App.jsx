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
        onHomeClick={() => setScreen('home')}
      />

      {/* HOME */}
      {screen === 'home' && (
        <>
          <HeroSlider />
          <Departments />
        </>
      )}

      {/* DEPARTMENTS (mobile ou página própria) */}
      {screen === 'departments' && <DepartmentMobile />}

      {/* LOGIN / SUBSCRIPTION */}
      {screen === 'login' && <Subscription />}
    </>
  )
}

export default App
