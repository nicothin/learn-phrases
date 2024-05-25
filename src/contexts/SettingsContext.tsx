import React, { createContext, useState, useMemo, useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';

import { SETTING_KEYS, THEME } from '../enums';
import { Phrase, Tags } from '../types';
import { DexieIndexedDB } from '../services/DexieIndexedDB';
import { DEXIE_TABLE_NAME } from '../constants';
import { arrayToString, getMatchedTags } from '../utils';

type SettingsContextType = {
  token: string;
  setToken: (text: string) => Promise<void>;
  gistId: string;
  setGistId: (text: string) => Promise<void>;
  isSyncWhen100percent: boolean;
  setIsSyncWhen100percent: (value: boolean) => Promise<void>;
  tags: Tags;
  setTags: (text: Tags) => Promise<void>;
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
  const [tags, setTags] = useState<Tags>([]);
  const [preferredTheme, setPreferredTheme] = useState<SettingsContextType['preferredTheme']>(
    (localStorage.getItem(SETTING_KEYS.PREFERRED_THEME) as THEME) ?? undefined,
  );
  const [phrasesMapFromDexie, setPhrasesMapFromDexie] = useState<Map<number, Phrase>>(new Map());

  useLiveQuery(() => {
    DexieIndexedDB[DEXIE_TABLE_NAME].orderBy('id')
      .toArray()
      .then((array) => {
        const tupleArray: [number, Phrase][] = array.map((phrase) => [phrase.id, phrase]);
        setPhrasesMapFromDexie(new Map(tupleArray));
      });
  }, []);

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

  const onSetTags = useCallback(
    (tagsMapFromSettings: Tags): Promise<void> => {
      return new Promise((resolve, reject) => {
        try {
          const newTags = getMatchedTags(phrasesMapFromDexie, tagsMapFromSettings);
          setTags(newTags);
          localStorage.setItem(SETTING_KEYS.TAGS, arrayToString(newTags));
          resolve();
        } catch (error) {
          reject(error instanceof Error ? error : new Error('Unknown error'));
        }
      });
    },
    [setTags, phrasesMapFromDexie],
  );

  // Get tags list: phrasesMapFromDexie + localStorage.getItem(SETTING_KEYS.TAGS)
  useEffect(() => {
    if (!phrasesMapFromDexie.size) return;

    let tagsMapFromSettings: Tags = [];

    try {
      tagsMapFromSettings = JSON.parse(localStorage.getItem(SETTING_KEYS.TAGS) ?? '[]');
    } catch (error) {
      console.error('LocalStorage tags reading error', error);
    }

    const newTags = getMatchedTags(phrasesMapFromDexie, tagsMapFromSettings);

    setTags(newTags);
    localStorage.setItem(SETTING_KEYS.TAGS, arrayToString(newTags));
  }, [phrasesMapFromDexie]);

  const contextValue = useMemo(
    () => ({
      token,
      setToken: onSetToken,
      gistId,
      setGistId: onSetGistId,
      isSyncWhen100percent,
      setIsSyncWhen100percent: onSetIsSyncWhen100percent,
      tags,
      setTags: onSetTags,
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
      tags,
      onSetTags,
      preferredTheme,
      onSetPreferredTheme,
    ],
  );

  return <SettingsContext.Provider value={contextValue}>{children}</SettingsContext.Provider>;
};

export default SettingsContext;
