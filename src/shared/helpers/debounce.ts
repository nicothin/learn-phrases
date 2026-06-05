/**
 * Creates a debounced version of a function.
 *
 * @example
 * ```ts
 * import { debounce } from '@shared/helpers/debounce';
 *
 * const save = debounce((query: string) => {
 *   fetch('/search?q=' + query);
 * }, 300);
 *
 * // Calling multiple times only triggers once after 300ms of inactivity
 * save('rea');
 * save('reac');
 * save('react'); // only this fires
 *
 * // Cancel pending execution
 * save.cancel();
 * ```
 */
export interface DebouncedFunction<T extends (...args: unknown[]) => void> {
  (...args: Parameters<T>): void;
  cancel: () => void;
}

export function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number,
): DebouncedFunction<T> {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const debounced = (...args: Parameters<T>) => {
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };

  debounced.cancel = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  return debounced;
}
