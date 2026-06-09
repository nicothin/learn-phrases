import type { ReactNode } from 'react';

import './Menu.css';

interface MenuProps {
  items: ReactNode[];
  className?: string;
}

export function Menu({ items, className }: MenuProps) {
  return (
    <ul className={['menu', className].filter(Boolean).join(' ')}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
