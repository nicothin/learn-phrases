import { createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { ImportPhrasesDTOFromGist, Notification, Phrase, UserSettings } from '../types';
import { IDB_NAME, IDB_TABLES, IDB_VERSION, PHRASES_TABLE_NAME, SETTINGS_TABLE_NAME } from '../constants';
import {
  checkIDBExistence,
  deleteRecords,
  deleteAllRecords,
  getAllPhrasesDTOFromAllPhrases,
  getAllRecords,
  putRecords,
  startDownloadFile,
  Gist,
} from '../services';
import { getValidatedPhrase } from '../utils';
import { STATUS } from '../enums';

interface MainContextType {
  checkIDBExist: () => Promise<Notification>;

  allSettings: UserSettings[];
  setSettings: (settings: UserSettings) => Promise<Notification>;

  allPhrases: Phrase[];
  addPhrases: (phrases: Partial<Phrase>[]) => Promise<Notification>;
  deletePhrases: (phraseIds: Phrase['id'][]) => Promise<Notification>;
  deleteAllPhrases: () => Promise<Notification>;

  exportPhrasesDTOToFile: () => Promise<Notification>;

  isImportFromJSONOpen: boolean;
  setIsImportFromJSONOpen: (payload: boolean) => void;

  importPhrasesDTOFromGist: (userId: number) => Promise<ImportPhrasesDTOFromGist>;
  exportPhrasesDTOToGist: (userId: number) => Promise<Notification>;
  isDataExchangeWithGist: boolean;
  isExportingDataToGist: boolean;
  isImportingDataFromGist: boolean;

  phrasesToResolveConflicts: Partial<Phrase>[];
  setPhrasesToResolveConflicts: (phrases: Partial<Phrase>[]) => void;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [allPhrases, setAllPhrases] = useState<Phrase[]>([]);
  const [allSettings, setAllSettings] = useState<UserSettings[]>([]);
  const [phrasesToResolveConflicts, setPhrasesToResolveConflicts] = useState<Partial<Phrase>[]>([]);
  const [isImportFromJSONOpen, setIsImportFromJSONOpen] = useState(false);
  const [isExportingDataToGist, setIsExportingDataToGist] = useState(false);
  const [isImportingDataFromGist, setIsImportingDataFromGist] = useState(false);
  const [isDataExchangeWithGist, setIsDataExchangeWithGist] = useState(false);

  const checkIDBExist = (): Promise<Notification> => {
    return new Promise((resolve, reject) => {
      checkIDBExistence({
        dbName: IDB_NAME,
        version: IDB_VERSION,
        tables: IDB_TABLES,
      })
        .then(() =>
          resolve({
            text: `IndexedDB exists`,
            type: STATUS.SUCCESS,
            duration: 3000,
          }),
        )
        .catch((error) =>
          reject({
            text: `No valid IndexedDB found`,
            type: STATUS.ERROR,
            description: '',
            consoleDescription: error.message,
          }),
        );
    });
  };

  const updateAllPhrases = () => {
    return new Promise((resolve, reject) => {
      getAllRecords({
        dbName: IDB_NAME,
        version: IDB_VERSION,
        tableName: PHRASES_TABLE_NAME,
        sortedBy: IDB_TABLES.find((table) => table.name === PHRASES_TABLE_NAME)?.keyPath ?? 'id',
      })
        .then((phrases) => {
          setAllPhrases(phrases as Phrase[]);
          resolve(phrases);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };

  const updateAllSettings = () => {
    return new Promise((resolve, reject) => {
      getAllRecords({
        dbName: IDB_NAME,
        version: IDB_VERSION,
        tableName: SETTINGS_TABLE_NAME,
      })
        .then((settings) => {
          setAllSettings(settings as UserSettings[]);
          resolve(settings);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
  };

  const setSettings = useCallback((settings: UserSettings): Promise<Notification> => {
    return new Promise((resolve, reject) => {
      putRecords({
        dbName: IDB_NAME,
        version: IDB_VERSION,
        tableName: SETTINGS_TABLE_NAME,
        values: [settings],
      })
        .then(() => {
          return updateAllSettings();
        })
        .then(() => {
          resolve({
            text: `Settings saved successfully.`,
            type: STATUS.SUCCESS,
            duration: 3000,
          });
        })
        .catch((error) => {
          reject({
            text: `Save settings error.`,
            type: STATUS.ERROR,
            description: 'See the console logs for more information.',
            consoleDescription: error,
          });
        });
    });
  }, []);

  const addPhrases = useCallback((phrases: Partial<Phrase>[]): Promise<Notification> => {
    return new Promise((resolve, reject) => {
      const validPhrases: Partial<Phrase>[] = [];
      const validationErrors: string[] = [];
      phrases.forEach((phrase) => {
        const validPhrase = getValidatedPhrase(phrase, !!phrase.id);
        if (validPhrase) {
          validPhrases.push(validPhrase);
        } else {
          const errorMessage = `Invalid phrase: ${JSON.stringify(phrase)}.`;
          validationErrors.push(errorMessage);
        }
      });

      if (validPhrases.length === 0) {
        reject({
          text: `No valid phrases to add.`,
          type: STATUS.ERROR,
          description: 'See the console logs for more information.',
          consoleDescription: validationErrors,
        });
        return;
      }

      putRecords({
        dbName: IDB_NAME,
        version: IDB_VERSION,
        tableName: PHRASES_TABLE_NAME,
        values: validPhrases,
      })
        .then(() => {
          return updateAllPhrases();
        })
        .then(() => {
          const validationResult = validationErrors.length
            ? `\nBut there were problems with validation of saved phrases:\n${validationErrors.join('\n')}`
            : '';
          resolve({
            text: `${validPhrases.length > 1 ? 'Phrases' : 'Phrase'} saved successfully.`,
            type: STATUS.SUCCESS,
            description: validationResult,
            duration: 3000,
          });
        })
        .catch((error) => {
          reject({
            text: `No phrases saved.`,
            type: STATUS.ERROR,
            description: 'See the console logs for more information.',
            consoleDescription: error,
          });
        });
    });
  }, []);

  const deletePhrases = useCallback((phraseIds: Phrase['id'][]): Promise<Notification> => {
    return new Promise((resolve, reject) => {
      deleteRecords({
        dbName: IDB_NAME,
        version: IDB_VERSION,
        tableName: PHRASES_TABLE_NAME,
        keys: phraseIds,
      })
        .then(() => {
          return updateAllPhrases();
        })
        .then(() => {
          resolve({
            text: `${phraseIds.length > 1 ? 'Phrases' : 'Phrase'} deleted successfully.`,
            type: STATUS.SUCCESS,
            duration: 3000,
          });
        })
        .catch((error) => {
          reject({
            text: `No phrases deleted.`,
            type: STATUS.ERROR,
            description: 'See the console logs for more information.',
            consoleDescription: error,
          });
        });
    });
  }, []);

  const deleteAllPhrases = useCallback((): Promise<Notification> => {
    return new Promise((resolve, reject) => {
      deleteAllRecords({
        dbName: IDB_NAME,
        version: IDB_VERSION,
        tableName: PHRASES_TABLE_NAME,
      })
        .then(() => {
          return updateAllPhrases();
        })
        .then(() => {
          resolve({
            text: `All phrases deleted successfully.`,
            type: STATUS.SUCCESS,
            duration: 3000,
          });
        })
        .catch((error) => {
          reject({
            text: `Clearing the phrase table failed.`,
            type: STATUS.ERROR,
            description: 'See the console logs for more information.',
            consoleDescription: error,
          });
        });
    });
  }, []);

  const exportPhrasesDTOToFile = useCallback((): Promise<Notification> => {
    if (!Array.isArray(allPhrases)) {
      return Promise.reject({
        text: `The exported data is not an array.`,
        description: 'See the console logs for more information.',
        consoleDescription: allPhrases,
        type: STATUS.ERROR,
      });
    }

    const exportedPhrases = getAllPhrasesDTOFromAllPhrases(allPhrases);
    if (!exportedPhrases.length) {
      return Promise.reject({
        text: `No data to export.`,
        type: STATUS.ERROR,
        description: 'See the console logs for more information.',
        consoleDescription: exportedPhrases,
      });
    }

    const text = JSON.stringify(exportedPhrases).replace(/],\[/g, '],\n[');
    const now = new Date();
    const fileName = `LP_${window.location.hostname.replace('.', '_')}_phrases_${now.toISOString().slice(0, 10)}_${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).replace(/:/g, '-')}.json`;
    startDownloadFile(fileName, text);

    return Promise.resolve({
      text: `All Phrases were successfully exported to file.`,
      type: STATUS.SUCCESS,
      duration: 3000,
    });
  }, [allPhrases]);

  const importPhrasesDTOFromGist = useCallback(
    (userId: number): Promise<ImportPhrasesDTOFromGist> => {
      const data: UserSettings | undefined = allSettings.find((item) => item.userId === userId);

      const gist = Gist.getInstance(data ?? {});

      if (!gist) {
        return Promise.reject({
          text: 'Missing data needed to get phrases from gist (token and gist id).',
          description: 'See the console logs for more information.',
          consoleDescription: data,
          type: STATUS.ERROR,
        });
      }

      setIsDataExchangeWithGist(true);
      setIsImportingDataFromGist(true);

      return new Promise((resolve, reject) => {
        gist
          .getAllPhrases()
          .then((res) => {
            resolve({
              notification: {
                text: 'Getting phrases from gist completed successfully.',
                type: STATUS.SUCCESS,
                duration: 3000,
              },
              payload: res,
            });
          })
          .catch((error) => {
            reject({
              notification: {
                text: error.message,
                type: STATUS.ERROR,
              },
              payload: [],
            });
          })
          .finally(() => {
            setIsDataExchangeWithGist(false);
            setIsImportingDataFromGist(false);
          });
      });
    },
    [allSettings],
  );

  const exportPhrasesDTOToGist = useCallback(
    (userId: number): Promise<Notification> => {
      const data: UserSettings | undefined = allSettings.find((item) => item.userId === userId);

      const gist = Gist.getInstance(data ?? {});

      if (!gist) {
        return Promise.reject({
          text: 'Missing data needed to export phrases from gist (token and gist id).',
          description: 'See the console logs for more information.',
          consoleDescription: data,
          type: STATUS.ERROR,
        });
      }

      if (!Array.isArray(allPhrases)) {
        return Promise.reject({
          text: 'The exported data is not an array.',
          description: 'See the console logs for more information.',
          consoleDescription: allPhrases,
          type: STATUS.ERROR,
        });
      }

      const exportedPhrases = getAllPhrasesDTOFromAllPhrases(allPhrases);
      if (!exportedPhrases.length) {
        return Promise.reject({
          text: `No data to export.`,
          description: 'See the console logs for more information.',
          consoleDescription: exportedPhrases,
          type: STATUS.ERROR,
        });
      }

      setIsDataExchangeWithGist(true);
      setIsExportingDataToGist(true);

      return new Promise((resolve, reject) => {
        gist
          .setAllPhrases(exportedPhrases)
          .then((res) => {
            resolve({
              text: `Phrases exported successfully.`,
              description: (
                <>
                  The export to{' '}
                  <a href={res.data.html_url} target="_blank">
                    this gist
                  </a>{' '}
                  has been successfully completed.
                </>
              ),
              type: STATUS.SUCCESS,
              duration: 3000,
            });
          })
          .catch((error) => {
            reject({
              text: error.message,
              type: STATUS.ERROR,
            });
          })
          .finally(() => {
            setIsDataExchangeWithGist(false);
            setIsExportingDataToGist(false);
          });
      });
    },
    [allPhrases, allSettings],
  );

  // Initial one-time filling
  useEffect(() => {
    updateAllPhrases();
    updateAllSettings();
  }, []);

  const value = useMemo(() => {
    return {
      allSettings,
      setSettings,
      allPhrases,
      phrasesToResolveConflicts,
      isImportFromJSONOpen,
      setIsImportFromJSONOpen,
      checkIDBExist,
      addPhrases,
      deletePhrases,
      deleteAllPhrases,
      exportPhrasesDTOToFile,
      importPhrasesDTOFromGist,
      exportPhrasesDTOToGist,
      isDataExchangeWithGist,
      setPhrasesToResolveConflicts,
      isExportingDataToGist,
      isImportingDataFromGist,
    };
  }, [
    allSettings,
    setSettings,
    allPhrases,
    phrasesToResolveConflicts,
    isImportFromJSONOpen,
    setIsImportFromJSONOpen,
    addPhrases,
    deletePhrases,
    deleteAllPhrases,
    exportPhrasesDTOToFile,
    importPhrasesDTOFromGist,
    exportPhrasesDTOToGist,
    isDataExchangeWithGist,
    setPhrasesToResolveConflicts,
    isExportingDataToGist,
    isImportingDataFromGist,
  ]);

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export default MainContext;
