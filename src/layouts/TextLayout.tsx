import { ReactNode } from 'react';

import './TextLayout.css';

type TextLayoutProps = {
  readonly className?: string;
  readonly children: ReactNode;
};

export default function TextLayout({ className, children }: TextLayoutProps) {
  return <div className={`text-layout ${className ?? ''}`}>{children}</div>;
}
