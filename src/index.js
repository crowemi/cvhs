import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Bootstrap Bundle JS
import "bootstrap/dist/js/bootstrap.bundle.min";

const root = ReactDOM.createRoot(document.getElementById('root'));
export const API_URI = 'https://cvhs-api.onrender.com/'; //'https://cvhs-api.onrender.com/'; 'http://localhost:8080/';

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
