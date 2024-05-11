import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ConfigProvider, Layout, theme, Typography } from 'antd';

import { THEME } from './enums';
import { useSettingsContext } from './hooks';

import TextLayout from './layouts/TextLayout';
import Learn from './pages/Learn/Learn';
import Admin from './pages/Admin/Admin';
import About from './pages/About/About';
import Settings from './pages/Settings/Settings';
import PageNotFound from './pages/PageNotFound/PageNotFound';
import MainMenu from './components/MainMenu/MainMenu';

export default function App() {
  const { defaultAlgorithm, darkAlgorithm } = theme;

  const { preferredTheme: preferredThemeInContext } = useSettingsContext();

  const [nowPreferredTheme, setNowPreferredTheme] = useState<THEME>(THEME.LIGHT);

  // Calculate & set actual theme
  useEffect(() => {
    if (preferredThemeInContext) {
      setNowPreferredTheme(preferredThemeInContext);
      return;
    }

    const mediaQuery: MediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
    const onThemeChange = (e: MediaQueryListEvent) => {
      setNowPreferredTheme(e.matches ? THEME.DARK : THEME.LIGHT);
    };

    const event = new MediaQueryListEvent('change', { matches: mediaQuery.matches });
    onThemeChange(event);

    mediaQuery.addEventListener('change', onThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', onThemeChange);
    };
  }, [preferredThemeInContext]);

  return (
    <ConfigProvider
      theme={{
        algorithm: nowPreferredTheme === THEME.DARK ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Layout className="lp-layout">
        <MainMenu />

        <main className="lp-layout__main">
          <Typography>
            <Routes>
              <Route index element={<Learn />} />
              <Route path="admin" element={<Admin />} />
              <Route
                path="about"
                element={
                  <TextLayout>
                    <About />
                  </TextLayout>
                }
              />
              <Route
                path="settings"
                element={
                  <TextLayout>
                    <Settings />
                  </TextLayout>
                }
              />
              <Route
                path="*"
                element={
                  <TextLayout>
                    <PageNotFound />
                  </TextLayout>
                }
              />
            </Routes>
          </Typography>
        </main>
      </Layout>
    </ConfigProvider>
  );
}
