import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import './Settings.css';

import { UserSettings } from '../../types';
import { useMainContext, useNotificationContext } from '../../hooks';
import { InputText } from '../../components/InputText/InputText';
import { InputCheckbox } from '../../components/InputCheckbox/InputCheckbox';

const MAIN_USER_ID = 1;

export default function Settings() {
  const { allSettings, setSettings, exportSettingsToFile, importSettingsFromFile } = useMainContext();
  const { addNotification } = useNotificationContext();

  const [syncFormData, setSyncFormData] = useState<UserSettings>({
    userId: MAIN_USER_ID,
    token: '',
    gistId: '',
    syncOn100percent: false,
    checkGistWhenSwitchingToLearn: false,
    // tags: '',
  });
  // const [isError, setIsError] = useState(false);
  // const [tagsMessageText, setTagsMessageText] = useState<string>('');

  const onSaveSyncSettings = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSettings(syncFormData)
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result));
  };

  const onInputChange = (data: { name: string; value: string | boolean }) => {
    const { name, value } = data;
    setSyncFormData({
      ...syncFormData,
      [name]: value,
    });
  };

  const onExportSettings = () => {
    exportSettingsToFile(MAIN_USER_ID)
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result));
  };

  const onImportSettings = (event: ChangeEvent<HTMLInputElement>) => {
    importSettingsFromFile(event)
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result));
  };

  // const onTagsChange = (value) => {
  //   try {
  //     const parsedText = JSON.parse(value);
  //     setIsError(false);

  //     console.info('parsedText', parsedText);

  //     setTagsMessageText(`Correct tags`);
  //     onInputChange({ name: 'tags', value });
  //   } catch (error) {
  //     setIsError(true);
  //     if (error instanceof SyntaxError) {
  //       setTagsMessageText(error.message);
  //     } else {
  //       setTagsMessageText(`Unknown error: ${error}`);
  //     }
  //     console.error(error);
  //   }
  // };

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
      // tags: thisMainUserData.tags,
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
          initialValue={syncFormData.token}
          onChange={(value) => onInputChange({ name: 'token', value })}
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
          initialValue={syncFormData.gistId}
          onChange={(value) => onInputChange({ name: 'gistId', value })}
          description="This can be copied from the gist's URL."
          placeholder="bobrKurwa1234567d571b2e609678321c"
        />

        <div className="settings__form-item">
          <InputCheckbox
            name="syncOn100percent"
            initialChecked={syncFormData.syncOn100percent}
            onChange={(checked) => onInputChange({ name: 'syncOn100percent', value: checked })}
          >
            Synchronization with gist when 100% viewing of unlearned phrases is reached.
          </InputCheckbox>
        </div>

        <div className="settings__form-item">
          <InputCheckbox
            name="checkGistWhenSwitchingToLearn"
            initialChecked={syncFormData.checkGistWhenSwitchingToLearn}
            onChange={(checked) => onInputChange({ name: 'checkGistWhenSwitchingToLearn', value: checked })}
          >
            Check the difference with gist when switching to Learn.
          </InputCheckbox>
        </div>

        {/* <h2>Tags</h2>

        <InputText
          className="settings__form-item"
          name="gistId"
          label="Tags"
          initialValue={syncFormData.tags}
          onChange={onTagsChange}
          description={tagsMessageText}
          placeholder="qwerty"
        /> */}

        <div className="settings__form-item  settings__form-item--buttons">
          <div className="settings__left-buttons">
            <button className="btn  settings__submit-btn" type="submit">
              Save settings
            </button>
          </div>
          <div className="settings__right-buttons">
            <label className="btn  btn--secondary  settings__import-btn">
              <input type="file" accept=".json, application/json" onChange={onImportSettings} />
              <span className="import-from-file-button__text">Import settings from file</span>
            </label>
            <button className="btn  btn--secondary" type="button" onClick={onExportSettings}>
              Export settings to file
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
