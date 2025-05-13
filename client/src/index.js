import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import RouterCustom from './router'
import './style/style.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import MasterLayout from 'layouts/masterLayout/masterLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [distinctItemQuantity, setDistinctItemQuantity] = useState(0)
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0)

  return (
    <MasterLayout
      setSearchQuery={setSearchQuery}
      distinctItemQuantity={distinctItemQuantity}
      totalPaymentAmount={totalPaymentAmount}
    >
      <RouterCustom
        searchQuery={searchQuery}
        setDistinctItemQuantity={setDistinctItemQuantity}
        setTotalPaymentAmount={setTotalPaymentAmount}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
      />
    </MasterLayout>
  )
}

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
