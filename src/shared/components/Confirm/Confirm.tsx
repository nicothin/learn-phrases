import type { ReactNode } from 'react';

import { Modal } from '../Modal/Modal';
import { Button } from '../Button/Button';

import './Confirm.css';

export interface ConfirmProps {
  isOpen: boolean;
  title: string;
  message?: ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function Confirm({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  onConfirm,
  onCancel,
}: ConfirmProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} closable={false} title={title}>
      {message && <div className="confirm__message">{message}</div>}
      <div className="confirm__buttons">
        <Button variant="secondary" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant={variant} onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
