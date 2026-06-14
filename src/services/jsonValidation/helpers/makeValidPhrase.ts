import type { ExamplePhrase } from '../../../types';

const isValidTimestamp = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;

export const makeValidPhrase = (raw: unknown): ExamplePhrase | null => {
  if (!(raw !== null && typeof raw === 'object' && !Array.isArray(raw))) return null;

  const { text, translation, textDescription, translationDescription, id, lastShownTimestamp } = raw as {
    text?: unknown;
    translation?: unknown;
    textDescription?: unknown;
    translationDescription?: unknown;
    id?: unknown;
    lastShownTimestamp?: unknown;
  };

  if (typeof text !== 'string' || text.trim() === '') return null;
  if (typeof translation !== 'string' || translation.trim() === '') return null;

  return {
    id: typeof id === 'string' && id.trim() !== '' ? id.trim() : crypto.randomUUID(),
    text: text.trim(),
    translation: translation.trim(),
    textDescription: typeof textDescription === 'string' && textDescription.trim() !== '' ? textDescription.trim() : undefined,
    translationDescription: typeof translationDescription === 'string' && translationDescription.trim() !== '' ? translationDescription.trim() : undefined,
    lastShownTimestamp: isValidTimestamp(lastShownTimestamp) ? lastShownTimestamp : undefined,
  };
};