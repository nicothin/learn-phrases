import React, { createContext, useState, useMemo, useCallback } from 'react';

import { SETTING_KEYS, THEME } from '../enums';

type SettingsContextType = {
  token: string;
  setToken: (text: string) => void;
  gistId: string;
  setGistId: (text: string) => void;
  preferredTheme: THEME | undefined;
  setPreferredTheme: (theme: THEME | undefined) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(SETTING_KEYS.TOKEN) ?? '');
  const [gistId, setGistId] = useState(localStorage.getItem(SETTING_KEYS.GIST_ID) ?? '');
  const [preferredTheme, setPreferredTheme] = useState<SettingsContextType['preferredTheme']>(
    (localStorage.getItem(SETTING_KEYS.PREFERRED_THEME) as THEME) ?? undefined,
  );

  const onSetToken = useCallback(
    (newValue: string) => {
      localStorage.setItem(SETTING_KEYS.TOKEN, newValue);
      setToken(newValue);
    },
    [setToken],
  );

  const onSetGistId = useCallback(
    (newValue: string) => {
      localStorage.setItem(SETTING_KEYS.GIST_ID, newValue);
      setGistId(newValue);
    },
    [setGistId],
  );

  const onSetPreferredTheme = useCallback(
    (newValue: THEME | undefined) => {
      if (!newValue) {
        localStorage.removeItem(SETTING_KEYS.PREFERRED_THEME);
      } else {
        localStorage.setItem(SETTING_KEYS.PREFERRED_THEME, newValue);
      }
      setPreferredTheme(newValue);
    },
    [setPreferredTheme],
  );

  const contextValue = useMemo(
    () => ({
      token,
      setToken: onSetToken,
      gistId,
      setGistId: onSetGistId,
      preferredTheme,
      setPreferredTheme: onSetPreferredTheme,
    }),
    [token, onSetToken, gistId, onSetGistId, preferredTheme, onSetPreferredTheme],
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};

export default SettingsContext;
