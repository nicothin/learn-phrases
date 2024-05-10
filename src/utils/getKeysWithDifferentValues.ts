type KeyOfDifferentProps<T> = {
  [K in keyof T]: T[K] extends infer U ? (U extends T[K] ? never : K) : never;
}[keyof T];

export const getKeysWithDifferentValues = <T>(
  obj1: T | null,
  obj2: T | null,
): Set<KeyOfDifferentProps<T>> => {
  if (!obj1 && !obj2) {
    return new Set();
  }

  if (!obj1) {
    return new Set(Object.keys(obj2 ?? {}) as KeyOfDifferentProps<T>[]);
  }

  if (!obj2) {
    return new Set(Object.keys(obj1 ?? {}) as KeyOfDifferentProps<T>[]);
  }

  const keys = new Set<KeyOfDifferentProps<T>>();

  for (const key in obj1) {
    if (obj1[key as keyof T] !== obj2[key as keyof T]) {
      keys.add(key as KeyOfDifferentProps<T>);
    }
  }

  for (const key in obj2) {
    if (!(key in obj1) || obj1[key as keyof T] !== obj2[key as keyof T]) {
      keys.add(key as KeyOfDifferentProps<T>);
    }
  }

  return keys;
};
