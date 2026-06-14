import type { ExamplePhrase } from '../../../types';

export const makeValidPhrase = (raw: unknown): ExamplePhrase | null => {
  if (!(raw !== null && typeof raw === 'object' && !Array.isArray(raw))) return null;

  const { text, translation, id } = raw as {
    text?: unknown;
    translation?: unknown;
    id?: unknown;
  };

  if (typeof text !== 'string' || text.trim() === '') return null;
  if (typeof translation !== 'string' || translation.trim() === '') return null;

  return {
    id: typeof id === 'string' && id.trim() !== '' ? id.trim() : crypto.randomUUID(),
    text: text.trim(),
    translation: translation.trim(),
  };
};