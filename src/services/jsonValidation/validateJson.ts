import type { PartOfSpeech, Meaning, ExamplePhrase, ExportData, Log } from '../../types';
import type { JsonValidationResult } from './types';

const POS_VALUES: PartOfSpeech[] = [
  'noun', 'verb', 'adjective', 'adverb',
  'pronoun', 'preposition', 'conjunction', 'interjection',
];

const CEFR_VALUES: ReadonlySet<string> = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

const isRecord = (raw: unknown): raw is Record<string, unknown> =>
  raw !== null && typeof raw === 'object' && !Array.isArray(raw);

export const makeValidMeaning = (raw: unknown): Meaning | null => {
  if (!isRecord(raw)) return null;

  const { lemma, translation, pos, cefrLevel } = raw;

  if (typeof lemma !== 'string' || lemma.trim() === '') return null;
  if (typeof translation !== 'string' || translation.trim() === '') return null;
  if (!POS_VALUES.includes(pos as PartOfSpeech)) return null;
  if (!CEFR_VALUES.has(cefrLevel as string)) return null;

  return {
    id: crypto.randomUUID(),
    lemma: lemma.trim(),
    translation: translation.trim(),
    pos: pos as PartOfSpeech,
    cefrLevel: cefrLevel as Meaning['cefrLevel'],
    exampleIds: [],
    knowledgeLvl: 1,
    showAfterTimestamp: Date.now(),
  };
};

export const makeValidPhrase = (raw: unknown): ExamplePhrase | null => {
  if (!isRecord(raw)) return null;

  const { text, translation } = raw;

  if (typeof text !== 'string' || text.trim() === '') return null;
  if (typeof translation !== 'string' || translation.trim() === '') return null;

  return {
    id: crypto.randomUUID(),
    text: text.trim(),
    translation: translation.trim(),
  };
};

export const validateJson = (text: string): JsonValidationResult => {
  let parsed: unknown;

  try {
    parsed = JSON.parse(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown parse error';

    return {
      data: null,
      log: [{ type: 'ERROR', message: 'Invalid JSON', details: message }],
    };
  }

  if (!isRecord(parsed)) {
    return {
      data: null,
      log: [{ type: 'ERROR', message: 'Root value must be a JSON object' }],
    };
  }

  const hasMeanings = Array.isArray(parsed.meanings);
  const hasPhrases = Array.isArray(parsed.phrases);

  if (!hasMeanings && !hasPhrases) {
    return {
      data: null,
      log: [{ type: 'ERROR', message: 'Missing required fields: meanings, phrases' }],
    };
  }

  const log: Log[] = [];
  const meanings: Meaning[] = [];
  const phrases: ExamplePhrase[] = [];

  if (hasMeanings) {
    for (const [index, item] of (parsed.meanings as unknown[]).entries()) {
      const valid = makeValidMeaning(item);

      if (valid) {
        meanings.push(valid);
      } else {
        log.push({
          type: 'ERROR',
          message: `meanings[${index}] has invalid structure`,
          details: JSON.stringify(item),
        });
      }
    }
  }

  if (hasPhrases) {
    for (const [index, item] of (parsed.phrases as unknown[]).entries()) {
      const valid = makeValidPhrase(item);

      if (valid) {
        phrases.push(valid);
      } else {
        log.push({
          type: 'ERROR',
          message: `phrases[${index}] has invalid structure`,
          details: JSON.stringify(item),
        });
      }
    }
  }

  const metaVersion =
    isRecord(parsed.meta) && typeof parsed.meta.version === 'string'
      ? parsed.meta.version
      : '';

  const data: ExportData = {
    meta: { version: metaVersion },
    meanings,
    phrases,
  };

  return { data, log };
};
