import { useEffect } from 'react';
import { useStore } from '../services/store';

export const useHydrate = () => {
  const hydrate = useStore((s) => s.hydrate);
  const isHydrated = useStore((s) => s.isHydrated);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return isHydrated;
};
