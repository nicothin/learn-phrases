import type { PartOfSpeech, Meaning, ExamplePhrase, ExportData, Log } from '../../types';
import type { JsonValidationResult } from './types';

const POS_VALUES: PartOfSpeech[] = [
  'noun', 'verb', 'adjective', 'adverb',
  'pronoun', 'preposition', 'conjunction', 'interjection',
];

const CEFR_VALUES: ReadonlySet<string> = new Set(['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

const isRecord = (raw: unknown): raw is Record<string, unknown> =>
  raw !== null && typeof raw === 'object' && !Array.isArray(raw);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((v): v is string => typeof v === 'string');

/**
 * Validate a meaning object, preserving exampleIds that refer to valid phrases.
 * @param raw The raw meaning object from JSON.
 * @param validPhraseIds Set of phrase IDs that are considered valid.
 * @returns A Meaning object with filtered exampleIds, or null if invalid.
 */
export const makeValidMeaning = (raw: unknown, validPhraseIds: Set<string>): Meaning | null => {
  if (!isRecord(raw)) return null;

  const { lemma, translation, pos, cefrLevel, exampleIds } = raw;

  if (typeof lemma !== 'string' || lemma.trim() === '') return null;
  if (typeof translation !== 'string' || translation.trim() === '') return null;
  if (!POS_VALUES.includes(pos as PartOfSpeech)) return null;
  if (!CEFR_VALUES.has(cefrLevel as string)) return null;

  // Filter exampleIds: keep only those that are strings and exist in validPhraseIds
  const filteredExampleIds: string[] = isStringArray(exampleIds)
    ? exampleIds.filter((id): id is string => validPhraseIds.has(id))
    : [];

  return {
    id: typeof raw.id === 'string' && raw.id.trim() !== '' ? raw.id.trim() : crypto.randomUUID(),
    lemma: lemma.trim(),
    translation: translation.trim(),
    pos: pos as PartOfSpeech,
    cefrLevel: cefrLevel as Meaning['cefrLevel'],
    exampleIds: filteredExampleIds,
    knowledgeLvl: 1,
    showAfterTimestamp: Date.now(),
  };
};

/**
 * Validate a phrase object, preserving its id if present and valid.
 * @param raw The raw phrase object from JSON.
 * @returns An ExamplePhrase object with the original id (if valid) or a new UUID, or null if invalid.
 */
export const makeValidPhrase = (raw: unknown): ExamplePhrase | null => {
  if (!isRecord(raw)) return null;

  const { text, translation, id } = raw;

  if (typeof text !== 'string' || text.trim() === '') return null;
  if (typeof translation !== 'string' || translation.trim() === '') return null;

  // Use provided id if it's a non-empty string, otherwise generate new UUID
  const phraseId = typeof id === 'string' && id.trim() !== '' ? id.trim() : crypto.randomUUID();

  return {
    id: phraseId,
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
  // First validate phrases and collect valid phrase IDs
  const validPhraseIds = new Set<string>();
  const phrases: ExamplePhrase[] = [];

  if (hasPhrases) {
    for (const [index, item] of (parsed.phrases as unknown[]).entries()) {
      const valid = makeValidPhrase(item);
      if (valid) {
        phrases.push(valid);
        validPhraseIds.add(valid.id);
      } else {
        log.push({
          type: 'ERROR',
          message: `phrases[${index}] has invalid structure`,
          details: JSON.stringify(item),
        });
      }
    }
  }

  // Validate meanings, passing the set of valid phrase IDs for filtering exampleIds
  const meanings: Meaning[] = [];

  if (hasMeanings) {
    for (const [index, item] of (parsed.meanings as unknown[]).entries()) {
      const valid = makeValidMeaning(item, validPhraseIds);
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
