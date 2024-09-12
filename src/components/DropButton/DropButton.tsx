import { useState, useEffect, useRef, ReactNode, useCallback } from 'react';

import './DropButton.css';

interface DropButtonProps {
  buttonContent: ReactNode;
  direction?: 'right-top' | 'left-top' | 'bottom-left';
  className?: string;
  buttonClassName?: string;
  closeOnMouseLeaveDrop?: boolean;
  closeOnClickOutside?: boolean;
  title?: string;
  children?: ReactNode;
}

export function DropButton(data: DropButtonProps) {
  const {
    buttonContent,
    direction = 'right-top',
    className,
    buttonClassName,
    closeOnMouseLeaveDrop = true,
    closeOnClickOutside = true,
    title,
    children,
  } = data;

  const [isOpen, setIsOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const onButtonClick = () => {
    setIsOpen(!isOpen);
  };

  const onMouseLeaveDrop = useCallback(() => {
    if (!closeOnMouseLeaveDrop) return;

    setIsOpen(false);
  }, [closeOnMouseLeaveDrop]);

  // Close dropdown when clicking outside of it
  useEffect(() => {
    if (!closeOnClickOutside) return;

    const onClickOutside = (event: MouseEvent) => {
      if (parentRef.current && !parentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onTouchMoveOutside = (event: TouchEvent) => {
      if (parentRef.current && !parentRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);
    document.addEventListener('touchmove', onTouchMoveOutside);

    return () => {
      document.removeEventListener('mousedown', onClickOutside);
      document.removeEventListener('touchmove', onTouchMoveOutside);
    };
  }, [closeOnClickOutside]);

  // Close dropdown when pressing the escape key
  useEffect(() => {
    const onEscKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', onEscKeyDown);
    return () => document.removeEventListener('keydown', onEscKeyDown);
  }, []);

  return (
    <div
      className={`drop-button rop-button--to-${direction} ${className ?? ''} ${isOpen ? 'drop-button--open' : ''}`}
      ref={parentRef}
    >
      <button
        className={`drop-button__button ${buttonClassName ?? ''}`}
        onClick={onButtonClick}
        aria-label="Toggle dropdown"
        aria-expanded={isOpen}
        title={title}
      >
        {buttonContent}
      </button>

      {isOpen && (
        <div className="drop-button__drop" ref={dropRef} onMouseLeave={onMouseLeaveDrop}>
          {children}
        </div>
      )}
    </div>
  );
}
