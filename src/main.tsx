import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CartProvider from "../src/context/CartContext"
import { CheckoutProvider } from './context/CheckoutContext'
import './index.css'
import App from './App.js'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
    <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <CheckoutProvider>
          <App />
        </CheckoutProvider>
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
)