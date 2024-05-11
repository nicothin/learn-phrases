import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as BrowserRouter } from 'react-router-dom';

import './main.css';

import { SettingsContextProvider } from './contexts/SettingsContext';
import { StateContextProvider } from './contexts/StateContext';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <StateContextProvider>
      <SettingsContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SettingsContextProvider>
    </StateContextProvider>
  </React.StrictMode>,
);
