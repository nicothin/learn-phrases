import { useCallback } from 'react';
import { saveMeaning, savePhrase } from '../services/store/mutations';
import { REPEAT_INTERVALS_DAYS, MS_PER_DAY } from '../constants';
import type { ExamplePhrase, LearningItem } from '../types';

const MAX_LEVEL = 8;
const MIN_LEVEL = 1;

export const useLearningActions = (item: LearningItem | null) => {
  const handleCorrect = useCallback(async () => {
    if (!item) return;

    const now = Date.now();
    const currentLvl = item.meaning.knowledgeLvl;
    const newLvl = Math.min(MAX_LEVEL, currentLvl + 1) as typeof item.meaning.knowledgeLvl;

    const updatedMeaning = {
      ...item.meaning,
      knowledgeLvl: newLvl,
      showAfterTimestamp: now + REPEAT_INTERVALS_DAYS[newLvl - 1] * MS_PER_DAY,
      lastShowTimestamp: now,
    };

    const updatedPhrase: ExamplePhrase = {
      ...item.phrase,
      lastShownTimestamp: now,
    };

    await saveMeaning(updatedMeaning);
    await savePhrase(updatedPhrase);
  }, [item]);

  const handleIncorrect = useCallback(async () => {
    if (!item) return;

    const now = Date.now();
    const currentLvl = item.meaning.knowledgeLvl;
    const newLvl = Math.max(MIN_LEVEL, currentLvl - 1) as typeof item.meaning.knowledgeLvl;

    const updatedMeaning = {
      ...item.meaning,
      knowledgeLvl: newLvl,
      showAfterTimestamp: now,
      lastShowTimestamp: now,
    };

    const updatedPhrase: ExamplePhrase = {
      ...item.phrase,
      lastShownTimestamp: now,
    };

    await saveMeaning(updatedMeaning);
    await savePhrase(updatedPhrase);
  }, [item]);

  return { handleCorrect, handleIncorrect };
};
