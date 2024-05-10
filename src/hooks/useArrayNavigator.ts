import { useState } from 'react';

type ArrayNavigatorResult<T> = {
  nowIndex: number;
  nextIndex: number;
  prevIndex: number;
  next: () => void;
  prev: () => void;
  getNow: () => T | undefined;
  getNext: () => T | undefined;
  getPrev: () => T | undefined;
};

const useArrayNavigator = <T>(array: T[]): ArrayNavigatorResult<T> => {
  const [nowIndex, setNowIndex] = useState<number>(0);

  const next = () => {
    const nextIndex = nowIndex === array.length - 1 ? 0 : nowIndex + 1;
    setNowIndex(nextIndex);
  };

  const prev = () => {
    const prevIndex = nowIndex === 0 ? array.length - 1 : nowIndex - 1;
    setNowIndex(prevIndex);
  };

  const nextIndex = nowIndex === array.length - 1 ? 0 : nowIndex + 1;
  const prevIndex = nowIndex === 0 ? array.length - 1 : nowIndex - 1;

  const getNow = () => {
    return array[nowIndex];
  };

  const getNext = () => {
    return array[nextIndex];
  };

  const getPrev = () => {
    return array[prevIndex];
  };

  return {
    nowIndex,
    nextIndex,
    prevIndex,
    next,
    prev,
    getNow,
    getNext,
    getPrev,
  };
};

export default useArrayNavigator;
