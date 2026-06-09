import { get, put } from './connection';
import type { UserSettings } from '../../types';

const SETTINGS_ID = 'user_settings';

interface SettingsRecord extends UserSettings {
  id: string;
}

const getSettings = async function(): Promise<SettingsRecord | undefined> {
  return get<SettingsRecord>('settings', SETTINGS_ID);
};

const saveSettings = async function(settings: UserSettings): Promise<void> {
  const record: SettingsRecord = { ...settings, id: SETTINGS_ID };
  await put<SettingsRecord>('settings', record);
};

const toUserSettings = (record: SettingsRecord): UserSettings => {
  const { id: _id, ...settings } = record;
  void _id;
  return settings;
};

export { getSettings, saveSettings, toUserSettings };
export type { SettingsRecord };
