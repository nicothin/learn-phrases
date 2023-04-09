import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';

import './index.css';

import App from './App';

const { defaultAlgorithm, darkAlgorithm } = theme;
const mediaQueryObj = window.matchMedia('(prefers-color-scheme: dark)');
const algorithm = mediaQueryObj.matches ? darkAlgorithm : defaultAlgorithm;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ConfigProvider theme={{ algorithm }}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
