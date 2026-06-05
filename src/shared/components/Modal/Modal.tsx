import { type ReactNode, useEffect, useRef, useCallback } from 'react';

import './Modal.css';

import { Icon } from '../Icon/Icon';

export interface ModalProps {
  children: ReactNode;
  onClose?: () => void;
  isOpen?: boolean;
  closable?: boolean;
  closeOnBackdropClick?: boolean;
  className?: string;
  contentClassName?: string;
  actions?: ReactNode;
  title?: ReactNode;
}

const BODY_LOCK_CLASS = 'modal-open';
let openCount = 0;

export function Modal({
  children,
  onClose,
  isOpen = true,
  closable = true,
  closeOnBackdropClick = false,
  className = '',
  contentClassName = '',
  actions,
  title,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleOverlayClick = useCallback(
    (event: React.MouseEvent) => {
      if (event.target === event.currentTarget && closable && closeOnBackdropClick) {
        handleClose();
      }
    },
    [closable, closeOnBackdropClick, handleClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    openCount++;
    document.body.classList.add(BODY_LOCK_CLASS);

    return () => {
      openCount--;
      if (openCount === 0) {
        document.body.classList.remove(BODY_LOCK_CLASS);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (closable) {
          handleClose();
        } else {
          event.preventDefault();
        }
        return;
      }

      if (event.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closable, handleClose]);

  if (!isOpen) return null;

  const modalClass = ['modal', className].filter(Boolean).join(' ');

  const showHeader = !!(title || closable);

  return (
    <div className="modal__overlay" onClick={handleOverlayClick}>
      <div ref={modalRef} className={modalClass} role="dialog" aria-modal="true">
        <div className="modal__wrapper">
          {showHeader && (
            <div className="modal__header">
              {title && <h2 className="modal__title">{title}</h2>}
              {closable && (
                <button className="close  modal__close-btn" onClick={handleClose} aria-label="Close" type="button">
                  <Icon name="close" aria-hidden="true" />
                </button>
              )}
            </div>
          )}

          <div className={`modal__body ${contentClassName}`}>
            {children}
          </div>

          {actions && <div className="modal__actions">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
