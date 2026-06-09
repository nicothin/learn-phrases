import { useEffect } from 'react';
import { useStore } from '../services/store';
import { useSessionStore } from '../services/store/sessionStore';
import type { LearningItem } from '../types';

interface UseLearningSessionResult {
  sessionId: string | null;
  items: LearningItem[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

export function useLearningSession(): UseLearningSessionResult {
  const isHydrated = useStore((s) => s.isHydrated);
  const sessionId = useSessionStore((s) => s.sessionId);
  const items = useSessionStore((s) => s.items);
  const generate = useSessionStore((s) => s.generate);
  const refresh = useSessionStore((s) => s.refresh);

  useEffect(() => {
    if (isHydrated && sessionId === null) {
      generate();
    }
  }, [isHydrated, sessionId, generate]);

  return { sessionId, items, isLoading: !isHydrated, refresh };
}
