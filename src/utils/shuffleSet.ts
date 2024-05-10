import { shuffleArray } from './shuffleArray';

export function shuffleSet<T>(set: Set<T>): Set<T> {
  const array = Array.from(set);
  const shuffledArray = shuffleArray(array);
  const shuffledSet = new Set(shuffledArray);
  return shuffledSet;
}
