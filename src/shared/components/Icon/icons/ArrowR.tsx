import type { FC, SVGProps } from 'react';

export const ArrowR: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 18" {...props}>
    <path d="m10 3 6 6-6 6-1.457-1.549L12 10H2V8h10L8.547 4.55Z" />
  </svg>
);
