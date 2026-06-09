import type { ReactNode } from 'react';

import './ProgressBar.css';

export interface ProgressBarProps {
  percentage: number;
  className?: string;
  children?: ReactNode;
}

export function ProgressBar({ percentage, children, className = '' }: ProgressBarProps) {
  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  const classes = [
    'progress-bar',
    safePercentage === 100 && 'progress-bar--done',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className="progress-bar__line-wrap">
        <div className="progress-bar__line" data-testid="progress-bar__line" style={{ width: `${safePercentage}%` }} />
      </div>
      {children && <div className="progress-bar__text">{children}</div>}
    </div>
  );
}
