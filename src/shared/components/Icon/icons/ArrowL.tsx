import type { FC, SVGProps } from 'react';

export const ArrowL: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 18" {...props}>
    <path d="M8 3 2 9l6 6 1.457-1.549L6 10h10V8H6l3.453-3.45Z" />
  </svg>
);
