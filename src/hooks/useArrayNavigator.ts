import { useState } from 'react';

type ArrayNavigatorResult = {
  nowIndex: number;
  nextIndex: number;
  prevIndex: number;
  goToNext: () => void;
  goToPrev: () => void;
};

export const useArrayNavigator = <T>(array: T[]): ArrayNavigatorResult => {
  const [nowIndex, setNowIndex] = useState<number>(0);

  const goToNext = () => {
    const nextIndex = nowIndex === array.length - 1 ? 0 : nowIndex + 1;
    setNowIndex(nextIndex);
  };

  const goToPrev = () => {
    const prevIndex = nowIndex === 0 ? array.length - 1 : nowIndex - 1;
    setNowIndex(prevIndex);
  };

  const nextIndex = nowIndex === array.length - 1 ? 0 : nowIndex + 1;
  const prevIndex = nowIndex === 0 ? array.length - 1 : nowIndex - 1;

  return {
    nowIndex,
    nextIndex,
    prevIndex,
    goToNext,
    goToPrev,
  };
};
