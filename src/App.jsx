import { useState } from 'react'
import './App.css'
import Navbar from './Navbar/Navbar'
//import HeroSlider from './Hero Slider/HeroSlider'
import Subscription from './Subscription/Subscription'
function App() {
  const [count, setCount] = useState(0)

  return (
      <>
      <Navbar />
        {/*<HeroSlider />*/}
        <Subscription />
      </>
  )
}

export default App
