import { useState } from 'react'
import './App.css'
import Navbar from './Navbar/Navbar'
import HeroSlider from './Hero Slider/HeroSlider'
function App() {
  const [count, setCount] = useState(0)

  return (
      <>
      <Navbar />
      <HeroSlider />
      </>
  )
}

export default App
