import './App.css'
import { useState } from 'react'
import Navbar from './Navbar/Navbar'
import HeroSlider from './HeroSlider/HeroSlider'
import Subscription from './Subscription/Subscription'

function App() {
  const [screen,setScreen] = useState('home')
  return (
    <>
      <Navbar 
        onLoginClick={()=> setScreen('login')}
        onHomeClick={()=> setScreen('home')}
      />
      {screen === 'home' && (
          <HeroSlider />
      )}
      {screen === 'login' && <Subscription />}
      
    </>
  )
}

export default App