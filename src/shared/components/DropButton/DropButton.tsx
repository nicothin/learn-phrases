import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';

import './DropButton.css';

import { Button, type ButtonProps } from '../Button/Button';


interface DropButtonProps {
  buttonContent: ReactNode;
  direction?: 'right-top' | 'left-top';
  className?: string;
  buttonClassName?: string;
  buttonVariant?: ButtonProps['variant'];
  buttonCircle?: boolean;
  closeOnMouseLeaveDrop?: boolean;
  closeOnClickOutside?: boolean;
  title?: string;
  children?: ReactNode;
}

export function DropButton(props: DropButtonProps) {
  const {
    buttonContent,
    direction = 'right-top',
    className,
    buttonClassName,
    buttonVariant,
    buttonCircle,
    closeOnMouseLeaveDrop = true,
    closeOnClickOutside = true,
    title,
    children,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen(v => !v);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const onMouseLeaveDrop = useCallback(() => {
    if (!closeOnMouseLeaveDrop) return;

    close();
  }, [closeOnMouseLeaveDrop, close]);

  // Close dropdown when clicking/touching outside of it
  useEffect(() => {
    if (!closeOnClickOutside) return;

    const onClickOutside = (event: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(event.target as Node)) {
        close();
      }
    };

    const onTouchStartOutside = (event: TouchEvent) => {
      if (parentRef.current && !parentRef.current.contains(event.target as Node)) {
        close();
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('touchstart', onTouchStartOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('touchstart', onTouchStartOutside);
    };
  }, [closeOnClickOutside, close]);

  // Close dropdown when pressing the escape key
  useEffect(() => {
    if (!isOpen) return;

    const onEscKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', onEscKeyDown);
    return () => document.removeEventListener('keydown', onEscKeyDown);
  }, [isOpen, close]);

  const wrapperClassName = [
    'drop-button',
    `drop-button--to-${direction}`,
    className,
    isOpen && 'drop-button--open',
  ]
    .filter(Boolean)
    .join(' ');

  const btnClassName = ['drop-button__button', buttonClassName].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassName} ref={parentRef}>
      <Button
        className={btnClassName}
        variant={buttonVariant}
        circle={buttonCircle}
        onClick={toggleOpen}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        title={title}
      >
        {buttonContent}
      </Button>

      {isOpen && (
        <div className="drop-button__drop" onMouseLeave={onMouseLeaveDrop}>
          {children}
        </div>
      )}
    </div>
  );
}
