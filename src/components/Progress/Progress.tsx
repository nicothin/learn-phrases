import { ReactNode } from 'react';

import './Progress.css';

interface ProgressProps {
  percentage: number;
  className?: string;
  children?: ReactNode;
}

export function Progress(data: ProgressProps) {
  const { percentage, children, className = '' } = data;

  const safePercentage = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={`progress ${className} ${safePercentage === 100 ? 'progress--done' : ''}`}>
      <div className="progress__line-wrap">
        <div className="progress__line" style={{ width: `${safePercentage}%` }} />
      </div>
      <div className="progress__text  text-secondary">
        {children}
      </div>
    </div>
  );
};
