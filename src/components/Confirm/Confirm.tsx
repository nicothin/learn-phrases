import { ReactNode } from 'react';

import './Confirm.css';

interface ConfirmProps {
  title: string;
  message?: string | ReactNode;
  confirmButtonText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function Confirm (data: ConfirmProps) {
  const { title, message, confirmButtonText, onConfirm, onCancel, isOpen } = data;

  return isOpen
    ? (
      <div className="confirm">
        <div className="confirm__content">
          <h3 className="confirm__title">{title}</h3>
          {message && <div className="confirm__message">{message}</div>}
          <div className="confirm__buttons">
            <button onClick={onCancel} className="btn  btn--secondary">Cancel</button>
            <button onClick={onConfirm} className="btn  btn--danger">
              {confirmButtonText ?? 'Confirm'}
            </button>
          </div>
        </div>
        <span className="confirm__backdrop"></span>
      </div>
    )
    : null;
};
