import { FormEvent, useEffect, useState } from 'react';

import './Settings.css';

import { UserSettings } from '../../types';
import { useActionsContext, useNotificationContext } from '../../hooks';
import { InputText } from '../../components/InputText/InputText';

const MAIN_USER_ID = 1;

export default function Settings() {
  const { allSettings, setSettings } = useActionsContext();
  const { addNotification } = useNotificationContext();

  const [syncFormData, setSyncFormData] = useState<UserSettings>({
    userId: MAIN_USER_ID,
    token: '',
    gistId: '',
    syncOn100percent: false,
    checkGistWhenSwitchingToLearn: false,
  });

  const onSaveSyncSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSettings(syncFormData)
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result));
  };

  const handleInputChange = (data: { name: string; value: string | boolean }) => {
    const { name, value } = data;
    setSyncFormData({
      ...syncFormData,
      [name]: value,
    });
  };

  useEffect(() => {
    const thisMainUserData: UserSettings | undefined = allSettings.find(
      (item) => item.userId === MAIN_USER_ID,
    );

    if (!thisMainUserData) return;

    setSyncFormData({
      userId: MAIN_USER_ID,
      token: thisMainUserData.token ?? '',
      gistId: thisMainUserData.gistId ?? '',
      syncOn100percent: thisMainUserData.syncOn100percent,
      checkGistWhenSwitchingToLearn: thisMainUserData.checkGistWhenSwitchingToLearn,
    });
  }, [allSettings]);

  return (
    <div className="layout-text  settings">
      <h1>Settings</h1>
      <h2>Synchronization</h2>
      <p>
        This is a serverless project. By default, all added words/phrases are saved in the browser storage.
        <br />
        But you can specify data for accessing{' '}
        <a href="https://gist.github.com/" rel="noreferrer">
          gist
        </a>{' '}
        and then the data will be periodically saved to it.
      </p>

      <p>
        Gist is a service from <a href="https://github.com/">github</a> for storing small sets of files with a
        history of changes.
        <br />
        It's free. You can read about tokens{' '}
        <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens">
          here
        </a>
        .
      </p>

      <form className="settings__form" onSubmit={onSaveSyncSettings}>
        <InputText
          className="settings__form-item"
          name="token"
          label="Token"
          value={syncFormData.token}
          onChange={(value) => handleInputChange({ name: 'token', value })}
          description={
            <>
              You can create your own token <a href="https://github.com/settings/tokens">here</a> (it should
              be able to work with gist).
            </>
          }
          placeholder="ghp_KurwaBober1234567T4HfQWbczMnL3b0e5Xv"
        />

        <InputText
          className="settings__form-item"
          name="gistId"
          label="Gist ID"
          value={syncFormData.gistId}
          onChange={(value) => handleInputChange({ name: 'gistId', value })}
          description="This can be copied from the gist's URL."
          placeholder="bobrKurwa1234567d571b2e609678321c"
        />

        <div className="settings__form-item  settings__form-item--checkbox">
          <label>
            <input
              name="syncOn100percent"
              type="checkbox"
              checked={syncFormData.syncOn100percent}
              onChange={(event) =>
                handleInputChange({ name: 'syncOn100percent', value: event.target.checked })
              }
            />{' '}
            Synchronization with gist when 100% viewing of unlearned phrases is reached.
          </label>
        </div>

        <div className="settings__form-item  settings__form-item--checkbox">
          <label>
            <input
              name="checkGistWhenSwitchingToLearn"
              type="checkbox"
              checked={syncFormData.checkGistWhenSwitchingToLearn}
              onChange={(event) =>
                handleInputChange({ name: 'checkGistWhenSwitchingToLearn', value: event.target.checked })
              }
            />{' '}
            Check the difference with gist when switching to Learn.
          </label>
        </div>

        <button className="btn  settings__submit-btn" type="submit">
          Save sync settings
        </button>
      </form>
    </div>
  );
}
