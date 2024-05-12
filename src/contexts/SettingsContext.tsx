import React, { createContext, useState, useMemo, useCallback } from 'react';

import { SETTING_KEYS, THEME } from '../enums';

type SettingsContextType = {
  token: string;
  setToken: (text: string) => Promise<void>;
  gistId: string;
  setGistId: (text: string) => Promise<void>;
  isSyncWhen100percent: boolean;
  setIsSyncWhen100percent: (value: boolean) => Promise<void>;
  preferredTheme: THEME | undefined;
  setPreferredTheme: (theme: THEME | undefined) => void;
};

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem(SETTING_KEYS.TOKEN) ?? '');
  const [gistId, setGistId] = useState(localStorage.getItem(SETTING_KEYS.GIST_ID) ?? '');
  const [isSyncWhen100percent, setIsSyncWhen100percent] = useState<boolean>(
    !!localStorage.getItem(SETTING_KEYS.SYNC_WHEN_100_PERCENT),
  );
  const [preferredTheme, setPreferredTheme] = useState<SettingsContextType['preferredTheme']>(
    (localStorage.getItem(SETTING_KEYS.PREFERRED_THEME) as THEME) ?? undefined,
  );

  const onSetToken = useCallback(
    (newValue: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          localStorage.setItem(SETTING_KEYS.TOKEN, newValue);
          setToken(newValue);
          resolve();
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Unknown error'));
        }
      });
    },
    [setToken],
  );

  const onSetGistId = useCallback(
    (newValue: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          localStorage.setItem(SETTING_KEYS.GIST_ID, newValue);
          setGistId(newValue);
          resolve();
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Unknown error'));
        }
      });
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

  const onSetIsSyncWhen100percent = useCallback(
    (newValue: boolean): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          localStorage.setItem(SETTING_KEYS.SYNC_WHEN_100_PERCENT, newValue ? '1' : '');
          setIsSyncWhen100percent(newValue);
          resolve();
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Unknown error'));
        }
      });
    },
    [setIsSyncWhen100percent],
  );

  const contextValue = useMemo(
    () => ({
      token,
      setToken: onSetToken,
      gistId,
      setGistId: onSetGistId,
      isSyncWhen100percent,
      setIsSyncWhen100percent: onSetIsSyncWhen100percent,
      preferredTheme,
      setPreferredTheme: onSetPreferredTheme,
    }),
    [
      token,
      onSetToken,
      gistId,
      onSetGistId,
      isSyncWhen100percent,
      onSetIsSyncWhen100percent,
      preferredTheme,
      onSetPreferredTheme,
    ],
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};

export default SettingsContext;
