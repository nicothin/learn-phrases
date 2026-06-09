import { SESSION_SIZE } from '../constants';
import type { Meaning, ExamplePhrase, LearningItem } from '../types';

export const buildLearningSession = (
  meanings: Meaning[],
  phrases: ExamplePhrase[],
): LearningItem[] => {
  const phrasesMap = new Map(phrases.map((p) => [p.id, p]));
  const now = Date.now();

  const eligibleMeanings = meanings
    .filter(
      (m) =>
        m.exampleIds.length > 0 &&
        m.knowledgeLvl < 8 &&
        (m.showAfterTimestamp == null || m.showAfterTimestamp === 0 || m.showAfterTimestamp <= now),
    )
    .sort((a, b) => (a.lastShowTimestamp ?? 0) - (b.lastShowTimestamp ?? 0))
    .slice(0, SESSION_SIZE);

  const items: LearningItem[] = [];

  for (const meaning of eligibleMeanings) {
    const candidatePhrases = meaning.exampleIds
      .map((id) => phrasesMap.get(id))
      .filter((p): p is ExamplePhrase => p != null);

    if (candidatePhrases.length === 0) continue;

    const bestPhrase = candidatePhrases.reduce((best, current) => {
      const bestTime = best.lastShownTimestamp ?? 0;
      const currentTime = current.lastShownTimestamp ?? 0;
      return currentTime < bestTime ? current : best;
    });

    items.push({ meaning, phrase: bestPhrase });
  }

  return items;
};
