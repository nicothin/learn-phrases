import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as BrowserRouter } from 'react-router-dom';

import './assets/custom-properties.css';
import './assets/main.css';

import packageJson from '../package.json';
import { MainContextProvider } from './contexts/MainContext';
import { NotificationContextProvider } from './contexts/NotificationContext/NotificationsContext';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationContextProvider>
      <MainContextProvider>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <App />
          <p className="version">{packageJson.version}</p>
        </BrowserRouter>
      </MainContextProvider>
    </NotificationContextProvider>
  </StrictMode>,
);
