import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as BrowserRouter } from 'react-router-dom';

import './main.css';

import { SettingsContextProvider } from './contexts/SettingsContext';
import { StateContextProvider } from './contexts/StateContext';
import { OverlayContextProvider } from './contexts/OverlayContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StateContextProvider>
      <SettingsContextProvider>
        <OverlayContextProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </OverlayContextProvider>
      </SettingsContextProvider>
    </StateContextProvider>
  </React.StrictMode>,
);
