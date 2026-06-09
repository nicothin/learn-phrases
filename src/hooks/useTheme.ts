import { useEffect, useCallback } from 'react';
import { useStore } from '../services/store';

type Theme = 'light' | 'dark';

function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyThemeAttribute(theme: Theme): void {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

export function useTheme() {
  const preferredTheme = useStore((s) => s.settings.preferredTheme);
  const updateSettings = useStore((s) => s.updateSettings);

  useEffect(() => {
    if (preferredTheme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');

      const handler = (e: MediaQueryListEvent | MediaQueryList) => {
        applyThemeAttribute(e.matches ? 'dark' : 'light');
      };

      handler(mq);
      mq.addEventListener('change', handler);

      return () => mq.removeEventListener('change', handler);
    }

    applyThemeAttribute(preferredTheme);
  }, [preferredTheme]);

  const toggleTheme = useCallback(() => {
    const current = preferredTheme === 'system'
      ? getSystemTheme()
      : preferredTheme;

    const next: Theme = current === 'dark' ? 'light' : 'dark';

    updateSettings({ preferredTheme: next });
  }, [preferredTheme, updateSettings]);

  const resolvedTheme: Theme = preferredTheme === 'system'
    ? getSystemTheme()
    : preferredTheme;

  return { toggleTheme, resolvedTheme };
}
