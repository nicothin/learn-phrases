import { type ReactNode } from 'react';

import './layout-text.css';

interface LayoutTextProps {
  children: ReactNode;
  className?: string;
}

export function LayoutText({ children, className }: LayoutTextProps) {
  return <div className={`layout-text${className ? ` ${className}` : ''}`}>{children}</div>;
}
