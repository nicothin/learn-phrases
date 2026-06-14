import { CEFR_VALUES, POS_VALUES } from '../../../constants';
import { isStringArray } from '../../../shared/helpers/isStringArray';
import type { Meaning, PartOfSpeech } from '../../../types';

const KNOWLEDGE_LVL_VALUES = new Set([1, 2, 3, 4, 5, 6, 7, 8]);

const isValidTimestamp = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;

export const makeValidMeaning = (raw: unknown, validPhraseIds: Set<string>): Meaning | null => {
  if (!(raw !== null && typeof raw === 'object' && !Array.isArray(raw))) return null;

  const { lemma, translation, description, pos, cefrLevel, exampleIds, id, knowledgeLvl, showAfterTimestamp, lastShowTimestamp } = raw as {
    lemma?: unknown;
    translation?: unknown;
    description?: unknown;
    pos?: unknown;
    cefrLevel?: unknown;
    exampleIds?: unknown;
    id?: unknown;
    knowledgeLvl?: unknown;
    showAfterTimestamp?: unknown;
    lastShowTimestamp?: unknown;
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
    description: typeof description === 'string' && description.trim() !== '' ? description.trim() : undefined,
    knowledgeLvl: KNOWLEDGE_LVL_VALUES.has(knowledgeLvl as number) ? (knowledgeLvl as Meaning['knowledgeLvl']) : 1,
    showAfterTimestamp: isValidTimestamp(showAfterTimestamp) ? showAfterTimestamp : Date.now(),
    lastShowTimestamp: isValidTimestamp(lastShowTimestamp) ? lastShowTimestamp : undefined,
  };
};
