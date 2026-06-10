import { CEFR_VALUES, POS_VALUES } from '../../../constants';
import { isStringArray } from '../../../shared/helpers/isStringArray';
import type { Meaning, PartOfSpeech } from '../../../types';

export const makeValidMeaning = (raw: unknown, validPhraseIds: Set<string>): Meaning | null => {
  if (!(raw !== null && typeof raw === 'object' && !Array.isArray(raw))) return null;

  const { lemma, translation, pos, cefrLevel, exampleIds, id } = raw as {
    lemma?: unknown;
    translation?: unknown;
    pos?: unknown;
    cefrLevel?: unknown;
    exampleIds?: unknown;
    id?: unknown;
  };

  if (typeof lemma !== 'string' || lemma.trim() === '') return null;
  if (typeof translation !== 'string' || translation.trim() === '') return null;
  if (!POS_VALUES.includes(pos as PartOfSpeech)) return null;
  if (typeof cefrLevel !== 'string' || !CEFR_VALUES.has(cefrLevel)) return null;

  const filteredExampleIds: string[] = isStringArray(exampleIds)
    ? exampleIds.filter((id): id is string => validPhraseIds.has(id))
    : [];

  return {
    id: typeof id === 'string' && id.trim() !== '' ? id.trim() : crypto.randomUUID(),
    lemma: lemma.trim(),
    translation: translation.trim(),
    pos: pos as PartOfSpeech,
    cefrLevel: cefrLevel as Meaning['cefrLevel'],
    exampleIds: filteredExampleIds,
    knowledgeLvl: 1,
    showAfterTimestamp: Date.now(),
  };
};
