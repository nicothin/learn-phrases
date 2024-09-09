import { useEffect, useState } from 'react';

import { ImportPhrasesDTOFromGist, UserSettings } from '../types';
import { STATUS } from '../enums';
import { getAllPhrasesFromAllPhrasesDTO } from '../services';
import { useMainContext } from './useMainContext';
import { useNotificationContext } from './useNotificationContext';

const MAIN_USER_ID = 1;

export const useCheckForPhraseMatchesInGist = () => {
  const {
    allPhrases,
    allSettings,
    importPhrasesDTOFromGist,
    setPhrasesToResolveConflicts,
    isNeedToCheckForPhraseMatchesInGist,
    setIsNeedToCheckForPhraseMatchesInGist,
  } = useMainContext();
  const { addNotification } = useNotificationContext();

  const [thisUserSettings, setThisUserSettings] = useState<UserSettings | undefined>(undefined);
  const [lastRequestTime, setLastRequestTime] = useState(0);

  // Set actual user settings
  useEffect(() => {
    const thisMainUserData: UserSettings | undefined = allSettings?.find(
      (item) => item.userId === MAIN_USER_ID,
    );
    setThisUserSettings(thisMainUserData);
  }, [allSettings]);

  // Check the difference with gist
  useEffect(() => {
    if (
      !isNeedToCheckForPhraseMatchesInGist ||
      !allPhrases.length ||
      !thisUserSettings?.token ||
      !thisUserSettings?.gistId ||
      !thisUserSettings.checkGistWhenSwitchingToLearn
    ) {
      return;
    }

    const now = Date.now();
    if (now - lastRequestTime >= 10000) {
      setLastRequestTime(now);

      importPhrasesDTOFromGist(MAIN_USER_ID)
        .then((result: ImportPhrasesDTOFromGist) => {
          addNotification(result.notification);
          const conversion = getAllPhrasesFromAllPhrasesDTO(result.payload);
          if (conversion.notification.type === STATUS.ERROR) {
            addNotification(conversion.notification);
          }
          setPhrasesToResolveConflicts(conversion.phrases);
        })
        .catch((result: ImportPhrasesDTOFromGist) => {
          addNotification(result.notification);
        })
        .finally(() => {
          setIsNeedToCheckForPhraseMatchesInGist(false);
        });
    }
  }, [
    allPhrases,
    thisUserSettings,
    lastRequestTime,
    importPhrasesDTOFromGist,
    addNotification,
    setPhrasesToResolveConflicts,
    isNeedToCheckForPhraseMatchesInGist,
    setIsNeedToCheckForPhraseMatchesInGist,
  ]);
};
