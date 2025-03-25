import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import RouterCustom from './router'
import './style/style.scss'
import 'bootstrap/dist/css/bootstrap.min.css';
import MasterLayout from 'layouts/masterLayout/masterLayout'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <MasterLayout>
      <RouterCustom />
    </MasterLayout>
  </BrowserRouter>
)
