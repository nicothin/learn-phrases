import type { FC, SVGProps } from 'react';

export const Done: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 18" {...props}>
    <path d="M9 0a9 9 0 1 0 0 18A9 9 0 0 0 9 0zm4 5 2 2-7 7-5-5 2-2 3 3 5-5z" />
  </svg>
);
