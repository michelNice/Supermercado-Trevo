import { useState } from 'react'
import './App.css'
import Navbar from './Navbar/Navbar'
import Hero from './Hero/Hero'
function App() {
  const [count, setCount] = useState(0)

  return (
      <>
      <Navbar />
      <Hero />
      </>
  )
}

export default App
