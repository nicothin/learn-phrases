import type { FC, SVGProps } from 'react';

export const ArrowT: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 18" {...props}>
    <path d="M15 8 9 2 3 8l1.549 1.457L8 6v10h2V6l3.45 3.453z" />
  </svg>
);
