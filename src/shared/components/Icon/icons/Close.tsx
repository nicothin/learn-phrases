import type { FC, SVGProps } from 'react';

export const Close: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 18" fill="none" {...props}>
    <path d="M4 4l10 10m0-10-10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
