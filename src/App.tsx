import { Routes, Route } from 'react-router-dom';

import './App.css';

import { useHydrate } from './hooks/useHydrate';
import { useTheme } from './hooks/useTheme';
import { MainMenu } from './components/MainMenu/MainMenu';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { Learn } from './pages/Learn/Learn';
import { Admin } from './pages/Admin/Admin';
import { About } from './pages/About/About';
import { Settings } from './pages/Settings/Settings';
import { PageNotFound } from './pages/PageNotFound/PageNotFound';
import { useUIStore } from './services/store/uiStore';
import { MeaningFormModal } from './components/MeaningFormModal/MeaningFormModal';
import { ExamplePhraseFormModal } from './components/ExamplePhraseFormModal/ExamplePhraseFormModal';
import { ImportModal } from './components/ImportModal/ImportModal';
import { NotificationList } from '@shared/components';

function App() {
  const isHydrated = useHydrate();

  useTheme();
  const editableMeaning = useUIStore((s) => s.editableMeaning);
  const editablePhrase = useUIStore((s) => s.editablePhrase);
  const importModalOpen = useUIStore((s) => s.importModalOpen);

  return (
    <div className="app">
      {isHydrated && (
        <div className="app__header">
          <div className="app__nav-actions">
            <ThemeToggle />
            <MainMenu />
          </div>
        </div>
      )}

      <div className="app__content">
        {isHydrated ? (
          <Routes>
            <Route index element={<Learn />} />
            <Route path="admin" element={<Admin />} />
            <Route path="about" element={<About />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        ) : (
          <p className="app__loading">Loading...</p>
        )}
      </div>

      <NotificationList />
      {editableMeaning && <MeaningFormModal />}
      {editablePhrase && <ExamplePhraseFormModal />}
      {importModalOpen && <ImportModal />}
    </div>
  );
}

export default App;
