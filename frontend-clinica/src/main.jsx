import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';

const initialTheme = localStorage.getItem('theme');
const theme = initialTheme === 'dark' ? 'dark' : 'light';
document.documentElement.setAttribute('data-theme', theme);
document.documentElement.setAttribute('data-bs-theme', theme);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
