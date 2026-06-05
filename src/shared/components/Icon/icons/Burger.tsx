import type { FC, SVGProps } from 'react';

export const Burger: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 18" {...props}>
    <rect width="16" height="2" x="1" y="2" ry="1" />
    <rect width="16" height="2" x="1" y="14" ry="1" />
    <rect width="16" height="2" x="1" y="8" ry="1" />
  </svg>
);
