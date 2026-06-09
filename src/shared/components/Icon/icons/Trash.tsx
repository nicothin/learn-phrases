import type { FC, SVGProps } from 'react';

export const Trash: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 18 18" {...props}>
    <path d="M5 1v1H4v2H1v2h2v9c0 1.108.892 2 2 2h8c1.108 0 2-.892 2-2V6h2V4h-3V2h-1V1Zm2 1h4v1h1v1H6V3h1ZM5 6h8v7.533c0 .813-.654 1.467-1.467 1.467H6.467A1.464 1.464 0 0 1 5 13.533Zm1 1v1h6V7Zm0 2v1h6V9Zm0 2v1h6v-1zm0 2v1h6v-1z" />
  </svg>
);
