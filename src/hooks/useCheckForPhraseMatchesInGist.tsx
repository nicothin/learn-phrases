import { useEffect, useState } from 'react';

import { UserSettings } from '../types';
import { useActionsContext } from './useActionsContext';
import { useNotificationContext } from './useNotificationContext';

const MAIN_USER_ID = 1;

export const useCheckForPhraseMatchesInGist = () => {
  const { allPhrases, allSettings } = useActionsContext();
  const { addNotification } = useNotificationContext();

  const [thisUserSettings, setThisUserSettings] = useState<UserSettings | undefined>(undefined);

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
      !(thisUserSettings?.token && thisUserSettings?.gistId) ||
      !thisUserSettings.checkGistWhenSwitchingToLearn
    ) {
      return;
    }

    console.log('11111', 11111);
  }, [thisUserSettings]);
};
