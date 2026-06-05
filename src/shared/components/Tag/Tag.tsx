import type { ReactNode } from 'react';

import './Tag.css';

import { Icon } from '../Icon/Icon';

export interface TagProps {
  children: ReactNode;
  onClick?: () => void;
  onClose?: () => void;
  disabled?: boolean;
  className?: string;
  [x: string]: unknown;
}

export function Tag({ children, onClick, onClose, disabled, className, ...rest }: TagProps) {
  const classes = [
    'tag',
    disabled && 'tag--disabled',
    onClick && 'tag--clickable',
    onClose && 'tag--closable',
    className,
  ].filter(Boolean).join(' ');

  const textContent = onClick ? (
    <button type="button" className="tag__text" onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ) : (
    <span className="tag__text">{children}</span>
  );

  return (
    <span className={classes} {...rest}>
      {textContent}
      {onClose && (
        <button
          type="button"
          className="tag__close"
          onClick={onClose}
          disabled={disabled}
          aria-label="Remove"
        >
          <Icon name="close" width="1em" height="1em" aria-hidden="true" />
        </button>
      )}
    </span>
  );
}
