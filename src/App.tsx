import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { useMainContext, useNotificationContext } from './hooks';
import { Icons } from './components/Icons/Icons';
import { MainMenu } from './components/MainMenu/MainMenu';

import Learn from './pages/Learn/Learn';
import Admin from './pages/Admin/Admin';
import About from './pages/About/About';
import Settings from './pages/Settings/Settings';
import PageNotFound from './pages/PageNotFound/PageNotFound';

export default function App() {
  const { checkIDBExist } = useMainContext();
  const { addNotification } = useNotificationContext();

  // Check if IDB exists, and if not, create it
  useEffect(() => {
    checkIDBExist().catch((error) => addNotification(error));
    // NOTE[@nicothin]: This is a conscious decision
  }, []); // [addNotification, checkIDBExist]

  return (
    <div className="app">
      <Icons />

      <div className="app__header">
        <MainMenu />
      </div>

      <div className="app__content">
        <Routes>
          <Route index element={<Learn />} />
          <Route path="admin" element={<Admin />} />
          <Route path="about" element={<About />} />
          <Route path="settings" element={<Settings />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}
