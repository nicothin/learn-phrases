import { ReactNode, useEffect, useRef } from 'react';

import './Modal.css';

import { onTabPress } from '../../utils/onTabPress';

type ModalProps = {
  children: ReactNode;
  onCloseThisModal?: () => void;
  isOpen?: boolean;
  isNonClosable?: boolean;
  isHuge?: boolean;
  className?: string;
  contentClassName?: string;
};

export function Modal(data: ModalProps) {
  const {
    children,
    onCloseThisModal,
    isOpen = true,
    isNonClosable = false,
    isHuge,
    className = '',
    contentClassName = '',
  } = data;

  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (!isNonClosable) {
          // NOTE[@nicothin]: because another component reacts to pressing the ESC key
          setTimeout(() => {
            onCloseThisModal?.();
          }, 0);
        }
      }
      if (event.key === 'Tab') {
        onTabPress(event, modalRef);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', onKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isNonClosable, isOpen, onCloseThisModal]);

  return isOpen ? (
    <dialog
      ref={modalRef}
      open={isOpen}
      className={`modal ${isOpen ? 'modal--open' : ''} ${className} ${isHuge ? 'modal--huge' : ''}`}
    >
      <span className="modal__backdrop"></span>

      <div className={`modal__content ${contentClassName}`} onClick={(e) => e.stopPropagation()}>
        {!isNonClosable && (
          <button
            className="close  modal__close-btn"
            onClick={onCloseThisModal}
            data-dismiss="modal"
            aria-label="Close"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}

        {children}
      </div>
    </dialog>
  ) : null;
}
