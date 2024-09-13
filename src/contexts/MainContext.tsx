import { ChangeEvent, createContext, FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';

import { ImportPhrasesDTOFromGist, Notification, Phrase, SayThisPhraseProps, UserSettings } from '../types';
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
  getAllPhrasesFromAllPhrasesDTO,
} from '../services';
import { getExportJSONFileName, getValidatedPhrase } from '../utils';
import { STATUS } from '../enums';

interface MainContextType {
  checkIDBExist: () => Promise<Notification>;

  allSettings: UserSettings[];
  setSettings: (settings: UserSettings) => Promise<Notification>;
  importSettingsFromFile: (event: ChangeEvent<HTMLInputElement>) => Promise<Notification>;
  exportSettingsToFile: (userId: number) => Promise<Notification>;

  allPhrases: Phrase[];
  addPhrases: (phrases: Partial<Phrase>[]) => Promise<Notification>;
  deletePhrases: (phraseIds: Phrase['id'][]) => Promise<Notification>;
  deleteAllPhrases: () => Promise<Notification>;

  importPhrasesDTOFromFile: (event: ChangeEvent<HTMLInputElement>) => Promise<Notification>;
  exportPhrasesDTOToFile: () => Promise<Notification>;

  isImportPhrasesFromJSONOpen: boolean;
  setIsImportPhrasesFromJSONOpen: (payload: boolean) => void;

  importPhrasesDTOFromGist: (userId: number) => Promise<ImportPhrasesDTOFromGist>;
  exportPhrasesDTOToGist: (userId: number) => Promise<Notification>;
  isDataExchangeWithGist: boolean;
  isExportingDataToGist: boolean;
  isImportingDataFromGist: boolean;
  isNeedToCheckForPhraseMatchesInGist: boolean;
  setIsNeedToCheckForPhraseMatchesInGist: (payload: boolean) => void;

  phrasesToResolveConflicts: Partial<Phrase>[];
  setPhrasesToResolveConflicts: (phrases: Partial<Phrase>[]) => void;

  allSpeechSynthesisVoices: SpeechSynthesisVoice[];
  sayThisPhrase: (data: SayThisPhraseProps) => Promise<Notification>;
}

const MainContext = createContext<MainContextType | undefined>(undefined);

export const MainContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [allPhrases, setAllPhrases] = useState<Phrase[]>([]);
  const [allSettings, setAllSettings] = useState<UserSettings[]>([]);
  const [phrasesToResolveConflicts, setPhrasesToResolveConflicts] = useState<Partial<Phrase>[]>([]);
  const [isImportPhrasesFromJSONOpen, setIsImportPhrasesFromJSONOpen] = useState(false);
  const [isExportingDataToGist, setIsExportingDataToGist] = useState(false);
  const [isImportingDataFromGist, setIsImportingDataFromGist] = useState(false);
  const [isDataExchangeWithGist, setIsDataExchangeWithGist] = useState(false);
  const [isNeedToCheckForPhraseMatchesInGist, setIsNeedToCheckForPhraseMatchesInGist] = useState(false);
  const [allSpeechSynthesisVoices, setAllSpeechSynthesisVoices] = useState<SpeechSynthesisVoice[]>([]);

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
            text: 'Settings saved successfully.',
            type: STATUS.SUCCESS,
            duration: 3000,
          });
        })
        .catch((error) => {
          reject({
            text: 'Save settings error.',
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

  const importPhrasesDTOFromFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>): Promise<Notification> => {
      const file = event.target.files?.[0];

      if (!file) {
        return Promise.reject({
          text: 'Is not a file',
          type: STATUS.ERROR,
        });
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonData = JSON.parse(event.target?.result as string);
          const conversion = getAllPhrasesFromAllPhrasesDTO(jsonData);
          if (conversion.notification.type === STATUS.ERROR) {
            return Promise.reject(conversion.notification);
          }
          setPhrasesToResolveConflicts(conversion.phrases);
          return Promise.resolve({
            text: 'File parsing success.',
            type: STATUS.SUCCESS,
          });
        } catch (error) {
          return Promise.reject({
            text: 'File parsing error.',
            consoleDescription: error,
            type: STATUS.ERROR,
          });
        }
      };
      reader.onerror = (error) => {
        return Promise.reject({
          text: 'File reading error.',
          consoleDescription: error,
          type: STATUS.ERROR,
        });
      };
      reader.readAsText(file);

      return Promise.resolve({
        text: 'File parsing success.',
        type: STATUS.SUCCESS,
      });
    },
    [],
  );

  const exportPhrasesDTOToFile = useCallback((): Promise<Notification> => {
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
        text: 'No data to export.',
        type: STATUS.ERROR,
        description: 'See the console logs for more information.',
        consoleDescription: exportedPhrases,
      });
    }

    const text = JSON.stringify(exportedPhrases).replace(/],\[/g, '],\n[');
    const fileName = getExportJSONFileName({ contentType: 'phrases' });
    startDownloadFile(fileName, text);

    return Promise.resolve({
      text: 'All Phrases were successfully exported to file.',
      type: STATUS.SUCCESS,
      duration: 3000,
    });
  }, [allPhrases]);

  const importSettingsFromFile = useCallback(
    (event: ChangeEvent<HTMLInputElement>): Promise<Notification> => {
      const file = event.target.files?.[0];

      if (!file) {
        return Promise.reject({
          text: 'Is not a file',
          type: STATUS.ERROR,
        });
      }

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const newSettings = JSON.parse(event.target?.result as string);

            if (!newSettings?.userId) {
              reject({
                text: 'These are not settings.',
                consoleDescription: newSettings,
                type: STATUS.ERROR,
              });
              return;
            }

            const oldSettings: UserSettings | undefined = allSettings.find(
              (item) => item.userId === newSettings.userId,
            );

            const settingsToSave = {
              ...oldSettings,
              ...newSettings,
            };

            setSettings(settingsToSave)
              .then((result) => resolve(result))
              .catch((result) => reject(result));
          } catch (error) {
            reject({
              text: 'File parsing error.',
              consoleDescription: error,
              type: STATUS.ERROR,
            });
          }
        };
        reader.onerror = (error) => {
          reject({
            text: 'File reading error..',
            consoleDescription: error,
            type: STATUS.ERROR,
          });
        };
        reader.readAsText(file);
      });
    },
    [allSettings, setSettings],
  );

  const exportSettingsToFile = useCallback(
    (userId: number): Promise<Notification> => {
      const data: UserSettings | undefined = allSettings.find((item) => item.userId === userId);

      if (!data?.userId) {
        return Promise.reject({
          text: `The exported data is not a settings.`,
          consoleDescription: data,
          type: STATUS.ERROR,
        });
      }

      const text = JSON.stringify(data);
      const fileName = getExportJSONFileName({ contentType: 'settings' });
      startDownloadFile(fileName, text);

      return Promise.resolve({
        text: `Settings were successfully exported to file.`,
        type: STATUS.SUCCESS,
        duration: 3000,
      });
    },
    [allSettings],
  );

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

  const sayThisPhrase = useCallback(
    (data: SayThisPhraseProps): Promise<Notification> => {
      const { text, userId } = data;
      if (!text || !userId) {
        return Promise.reject({
          text: 'Nothing to say.',
          description: 'No text and/or user ID specified.',
          type: STATUS.ERROR,
          // duration: 3000,
        });
      }

      const thisMainUserData: UserSettings | undefined = allSettings.find((item) => item.userId === userId);
      if (!thisMainUserData) {
        return Promise.reject({
          text: 'Nothing to say.',
          description: 'Failed to get user settings.',
          type: STATUS.ERROR,
          // duration: 3000,
        });
      }

      if (!thisMainUserData?.voiceOfForeignLang || thisMainUserData?.voiceOfForeignLang === 'none') {
        return Promise.reject({
          text: 'Nothing to say.',
          description: 'No speech engine selected.',
          type: STATUS.ERROR,
          // duration: 3000,
        });
      }

      const engine = allSpeechSynthesisVoices.find(
        (voice) => voice.name === thisMainUserData?.voiceOfForeignLang,
      );

      if (!engine) {
        return Promise.reject({
          text: 'Nothing to say.',
          description: `Selected ${thisMainUserData?.voiceOfForeignLang} voice is not available.`,
          type: STATUS.ERROR,
          // duration: 3000,
        });
      }

      if (!navigator.onLine && !engine.localService) {
        return Promise.reject({
          text: 'Nothing to say.',
          description: `Selected ${thisMainUserData?.voiceOfForeignLang} voice is not a local and you're offline.`,
          type: STATUS.ERROR,
          // duration: 3000,
        });
      }

      return new Promise((resolve, reject) => {
        const synth = window.speechSynthesis;
        const utterThis = new SpeechSynthesisUtterance(text);

        utterThis.onend = () => {
          resolve({
            text: 'The phrase is spoken.',
            description: engine.name,
            type: STATUS.SUCCESS,
            duration: 3000,
          });
        };

        utterThis.onerror = (event) => {
          reject({
            text: 'Problem of saying.',
            consoleDescription: event,
            type: STATUS.ERROR,
          });
        };

        utterThis.rate = 0.8;
        utterThis.voice = engine;
        synth.speak(utterThis);
      });
    },
    [allSettings, allSpeechSynthesisVoices],
  );

  // Initial one-time filling
  useEffect(() => {
    updateAllPhrases();
    updateAllSettings();

    const synth = window.speechSynthesis;

    const updateVoices = () => {
      const voices = synth.getVoices();
      setAllSpeechSynthesisVoices(voices);
    };

    synth.addEventListener('voiceschanged', updateVoices);

    if (synth.getVoices().length > 0) {
      updateVoices();
    }

    return () => {
      synth.removeEventListener('voiceschanged', updateVoices);
    };
  }, []);

  const value = useMemo(() => {
    return {
      allSettings,
      setSettings,
      allPhrases,
      phrasesToResolveConflicts,
      isImportPhrasesFromJSONOpen,
      setIsImportPhrasesFromJSONOpen,
      checkIDBExist,
      addPhrases,
      deletePhrases,
      deleteAllPhrases,
      importPhrasesDTOFromFile,
      exportPhrasesDTOToFile,
      importPhrasesDTOFromGist,
      exportPhrasesDTOToGist,
      isDataExchangeWithGist,
      setPhrasesToResolveConflicts,
      isExportingDataToGist,
      isImportingDataFromGist,
      importSettingsFromFile,
      exportSettingsToFile,
      isNeedToCheckForPhraseMatchesInGist,
      setIsNeedToCheckForPhraseMatchesInGist,
      allSpeechSynthesisVoices,
      sayThisPhrase,
    };
  }, [
    allSettings,
    setSettings,
    allPhrases,
    phrasesToResolveConflicts,
    isImportPhrasesFromJSONOpen,
    setIsImportPhrasesFromJSONOpen,
    addPhrases,
    deletePhrases,
    deleteAllPhrases,
    importPhrasesDTOFromFile,
    exportPhrasesDTOToFile,
    importPhrasesDTOFromGist,
    exportPhrasesDTOToGist,
    isDataExchangeWithGist,
    setPhrasesToResolveConflicts,
    isExportingDataToGist,
    isImportingDataFromGist,
    importSettingsFromFile,
    exportSettingsToFile,
    isNeedToCheckForPhraseMatchesInGist,
    setIsNeedToCheckForPhraseMatchesInGist,
    allSpeechSynthesisVoices,
    sayThisPhrase,
  ]);

  return <MainContext.Provider value={value}>{children}</MainContext.Provider>;
};

export default MainContext;
