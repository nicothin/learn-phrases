import './ThemeToggle.css';

import { Button, Icon } from '@shared/components';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { toggleTheme, resolvedTheme } = useTheme();

  return (
    <Button
      className="theme-toggle"
      variant="secondary"
      circle
      onClick={toggleTheme}
      aria-label={resolvedTheme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
    >
      <Icon className="theme-toggle__icon theme-toggle__icon--sun" name="sun" />
      <Icon className="theme-toggle__icon theme-toggle__icon--moon" name="moon" />
    </Button>
  );
}
