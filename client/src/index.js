import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import RouterCustom from './router';
import './style/style.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import MasterLayout from 'layouts/masterLayout/masterLayout';

const root = ReactDOM.createRoot(document.getElementById('root'));

function App() {
  const [searchQuery, setSearchQuery] = useState(""); 

  return (
    <MasterLayout setSearchQuery={setSearchQuery}>
      <RouterCustom searchQuery={searchQuery} />
    </MasterLayout>
  );
}

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
