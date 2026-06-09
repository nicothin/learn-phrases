import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './assets/custom-properties.css'
import './assets/index.css'

import App from './App.tsx'
import packageJson from '../package.json';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <small className="version">{packageJson.version}</small>
    </BrowserRouter>
  </StrictMode>,
)
