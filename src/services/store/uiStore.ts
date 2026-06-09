import { create } from 'zustand';
import type { Meaning, ExamplePhrase } from '../../types';

interface UIState {
  editableMeaning: Partial<Meaning> | null;
  setEditableMeaning: (meaning: Partial<Meaning> | null) => void;
  editablePhrase: Partial<ExamplePhrase> | null;
  setEditablePhrase: (phrase: Partial<ExamplePhrase> | null) => void;
  importModalOpen: boolean;
  setImportModalOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  editableMeaning: null,
  setEditableMeaning: (meaning) => set({ editableMeaning: meaning }),
  editablePhrase: null,
  setEditablePhrase: (phrase) => set({ editablePhrase: phrase }),
  importModalOpen: false,
  setImportModalOpen: (open) => set({ importModalOpen: open }),
}));
