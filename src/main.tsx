import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as BrowserRouter } from 'react-router-dom';

import './assets/custom-properties.css';
import './assets/main.css';

import { ActionsContextProvider } from './contexts/ActionsContext';
import { NotificationContextProvider } from './contexts/NotificationContext/NotificationsContext';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NotificationContextProvider>
      <ActionsContextProvider>
        <BrowserRouter future={{ v7_startTransition: true }}>
          <App />
        </BrowserRouter>
      </ActionsContextProvider>
    </NotificationContextProvider>
  </StrictMode>,
);
