import type { PartOfSpeech } from './types';

// Index corresponds to knowledge level - 1
// REPEAT_INTERVALS_DAYS[0] = level 1, REPEAT_INTERVALS_DAYS[7] = level 8
export const REPEAT_INTERVALS_DAYS = [0, 2, 3, 5, 7, 10, 14, 20] as const;

export const MS_PER_DAY = 86_400_000;

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;

export const SESSION_SIZE = 42;

export const POS_LABELS: Record<PartOfSpeech, string> = {
  noun: 'Noun',
  verb: 'Verb',
  adjective: 'Adjective',
  adverb: 'Adverb',
  pronoun: 'Pronoun',
  preposition: 'Preposition',
  conjunction: 'Conjunction',
  interjection: 'Interjection',
};
