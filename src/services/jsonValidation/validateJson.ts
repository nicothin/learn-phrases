import type { Meaning, ExamplePhrase, ExportData, Log } from '../../types';
import type { JsonValidationResult } from './types';
import { makeValidMeaning } from './helpers/makeValidMeaning';
import { makeValidPhrase } from './helpers/makeValidPhrase';

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

  if (!(parsed !== null && typeof parsed === 'object' && !Array.isArray(parsed))) {
    return {
      data: null,
      log: [{ type: 'ERROR', message: 'Root value must be a JSON object' }],
    };
  }

  type RawJson = {
    meanings?: unknown[];
    phrases?: unknown[];
    meta?: {
      version?: unknown;
    };
  };

  const raw = parsed as RawJson;
  const hasMeanings = Array.isArray(raw.meanings);
  const hasPhrases = Array.isArray(raw.phrases);

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
    for (const [index, item] of (raw.phrases ?? []).entries()) {
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
    for (const [index, item] of (raw.meanings ?? []).entries()) {
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
    raw.meta !== null &&
    typeof raw.meta === 'object' &&
    typeof raw.meta.version === 'string'
      ? raw.meta.version
      : '';

  const data: ExportData = {
    meta: { version: metaVersion },
    meanings,
    phrases,
  };

  return { data, log };
};