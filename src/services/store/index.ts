import { create } from 'zustand';
import { getAllMeanings } from '../db/meaningRepo';
import { getAllPhrases } from '../db/phraseRepo';
import { getSettings, saveSettings, toUserSettings } from '../db/settingsRepo';
import { notification } from '../notification';
import { NOTIFICATION_TYPE } from '../notification/types';
import type { Meaning, ExamplePhrase, UserSettings } from '../../types';

const DEFAULT_SETTINGS: UserSettings = {
  githubToken: '',
  gistId: '',
  preferredTheme: 'system',
};

interface StoreState {
  meanings: Record<string, Meaning>;
  phrases: Record<string, ExamplePhrase>;
  settings: UserSettings;
  isHydrated: boolean;
  isHydrating: boolean;
  hydrate: () => Promise<void>;
  updateSettings: (settings: Partial<UserSettings>) => Promise<void>;
  getMeaningById: (id: string) => Meaning | undefined;
  getPhraseById: (id: string) => ExamplePhrase | undefined;
}

const useStore = create<StoreState>()((set, get) => ({
  meanings: {},
  phrases: {},
  settings: { ...DEFAULT_SETTINGS },
  isHydrated: false,
  isHydrating: false,

  hydrate: async () => {
    if (get().isHydrated || get().isHydrating) return;

    set({ isHydrating: true });

    try {
      const [meanings, phrases, settingsRecord] = await Promise.all([
        getAllMeanings(),
        getAllPhrases(),
        getSettings(),
      ]);

      const settings = settingsRecord
        ? toUserSettings(settingsRecord)
        : { ...DEFAULT_SETTINGS };

      set({
        meanings: Object.fromEntries(meanings.map((m) => [m.id, m])),
        phrases: Object.fromEntries(phrases.map((p) => [p.id, p])),
        settings,
        isHydrated: true,
        isHydrating: false,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      notification.add({
        text: 'Failed to load data',
        type: NOTIFICATION_TYPE.ERROR,
        description: message,
      });
      set({ isHydrating: false });
    }
  },

  updateSettings: async (partial: Partial<UserSettings>) => {
    const { settings } = get();
    const next: UserSettings = { ...settings, ...partial };

    await saveSettings(next);
    set({ settings: next });
  },

  getMeaningById: (id: string) => get().meanings[id],
  getPhraseById: (id: string) => get().phrases[id],
}));

export { useStore };
export type { StoreState };
export { useUIStore } from './uiStore';
