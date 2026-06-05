import type { FC, SVGProps } from 'react';

export const ArrowD: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 18" {...props}>
    <path d="m15 10-6 6-6-6 1.549-1.457L8 12V2h2v10l3.45-3.453z" />
  </svg>
);
