import type { FC, SVGProps } from 'react';

export const Plus: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 18" {...props}>
    <path d="M8 1v7H1v2h7v7h2v-7h7V8h-7V1H8z" />
  </svg>
);
