import { type ButtonHTMLAttributes } from 'react';

import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'danger' | 'text' | 'link' | 'text-link';
  size?: 'sm' | 'xs';
  circle?: boolean;
}

export function Button({
  variant = 'default',
  size,
  circle,
  type = 'button',
  className = '',
  ...rest
}: ButtonProps) {
  const classes = [
    'btn',
    variant !== 'default' && `btn--${variant}`,
    circle && 'btn--circle',
    size && `btn--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <button type={type} className={classes} {...rest} />;
}
