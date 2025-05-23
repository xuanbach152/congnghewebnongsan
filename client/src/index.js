import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import RouterCustom from './router'
import './style/style.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import MasterLayout from 'layouts/masterLayout/masterLayout'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { ChatBox } from 'layouts/chatBox/chatBox'

const root = ReactDOM.createRoot(document.getElementById('root'))

function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [distinctItemQuantity, setDistinctItemQuantity] = useState(0)
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [shopChat, setShopChat] = useState(null)
  const [type, setType] = useState(null)
  const [minPrice, setMinPrice] = useState(null)
  const [maxPrice, setMaxPrice] = useState(null)
  const [isShowFilter, setIsShowFilter] = useState(false)
  
  const openChat = () => setIsChatOpen(true)

  return (
    <MasterLayout
      setSearchQuery={setSearchQuery}
      distinctItemQuantity={distinctItemQuantity}
      totalPaymentAmount={totalPaymentAmount}
      setType={setType}
      setMinPrice={setMinPrice}
      setMaxPrice={setMaxPrice}
      isShowFilter={isShowFilter}
    >
      <RouterCustom
        searchQuery={searchQuery}
        setDistinctItemQuantity={setDistinctItemQuantity}
        setTotalPaymentAmount={setTotalPaymentAmount}
        openChat={openChat}
        setShopChat={setShopChat}
        type={type}
        minPrice={minPrice}
        maxPrice={maxPrice}
        setIsShowFilter={setIsShowFilter}
      />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnFocusLoss={false}
      />
      <ChatBox
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        shopChat={shopChat}
      />
    </MasterLayout>
  )
}

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
