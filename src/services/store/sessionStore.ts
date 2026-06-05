import { create } from 'zustand';
import { useStore } from './index';
import { buildLearningSession } from '../../helpers';
import type { LearningItem, Meaning, ExamplePhrase } from '../../types';

interface SessionState {
  sessionId: string | null;
  items: LearningItem[];
  evaluatedMap: Record<string, 'correct' | 'incorrect'>;

  generate: () => Promise<void>;
  refresh: () => Promise<void>;
  markEvaluated: (meaningId: string, result: 'correct' | 'incorrect') => void;
  updatePhraseInSession: (phrase: ExamplePhrase) => void;
  updateMeaningInSession: (meaning: Meaning) => void;
  removeByMeaningId: (meaningId: string) => void;
  removeByPhraseId: (phraseId: string) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  sessionId: null,
  items: [],
  evaluatedMap: {},

  generate: async () => {
    const { meanings, phrases, isHydrated } = useStore.getState();
    if (!isHydrated) return;

    const items = buildLearningSession(
      Object.values(meanings),
      Object.values(phrases),
    );

    set({ sessionId: crypto.randomUUID(), items, evaluatedMap: {} });
  },

  refresh: async () => {
    const { meanings, phrases, isHydrated } = useStore.getState();
    if (!isHydrated) return;

    const items = buildLearningSession(
      Object.values(meanings),
      Object.values(phrases),
    );

    const shuffled = [...items].sort(() => Math.random() - 0.5);

    set({ sessionId: crypto.randomUUID(), items: shuffled, evaluatedMap: {} });
  },

  markEvaluated: (meaningId, result) => {
    set((s) => ({ evaluatedMap: { ...s.evaluatedMap, [meaningId]: result } }));
  },

  updatePhraseInSession: (phrase) => {
    const { items } = get();
    const idx = items.findIndex((item) => item.phrase.id === phrase.id);

    if (idx === -1) return;

    const next = [...items];
    next[idx] = { ...next[idx], phrase };
    set({ items: next });
  },

  updateMeaningInSession: (meaning) => {
    const { items } = get();
    const idx = items.findIndex((item) => item.meaning.id === meaning.id);

    if (idx === -1) return;

    const next = [...items];
    next[idx] = { ...next[idx], meaning };
    set({ items: next });
  },

  removeByMeaningId: (meaningId) => {
    const { items } = get();
    set({ items: items.filter((item) => item.meaning.id !== meaningId) });
  },

  removeByPhraseId: (phraseId) => {
    const { items } = get();
    set({ items: items.filter((item) => item.phrase.id !== phraseId) });
  },

  clear: () => {
    set({ sessionId: null, items: [], evaluatedMap: {} });
  },
}));
