import { useCallback, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';

import './NotificationItem.css';

import { Icon } from '../Icon/Icon';
import { NOTIFICATION_TYPE } from '../../../services/notification/types';
import { notificationStore } from '../../../services/notification/store';

interface NotificationItemProps {
  id: number;
  text: string;
  description?: string | ReactNode;
  type?: string;
  duration?: number;
}

export function NotificationItem({ id, text, description, type, duration }: NotificationItemProps) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectiveDuration = duration ?? (type === NOTIFICATION_TYPE.ERROR ? 0 : 5000);

  const clearAutoRemove = useCallback(() => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const startAutoRemove = useCallback(() => {
    if (effectiveDuration !== 0) {
      clearAutoRemove();
      timeoutRef.current = setTimeout(() => notificationStore.remove(id), effectiveDuration);
    }
  }, [effectiveDuration, id, clearAutoRemove]);

  useEffect(() => {
    startAutoRemove();

    return clearAutoRemove;
  }, [startAutoRemove, clearAutoRemove]);

  const typeClass = type === NOTIFICATION_TYPE.ERROR ? 'notification--error' : '';

  return (
    <div
      className={`notification ${typeClass}`}
      role="alert"
      onMouseEnter={clearAutoRemove}
      onMouseLeave={startAutoRemove}
    >
      {type === NOTIFICATION_TYPE.SUCCESS && (
        <svg className="notification__icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M9 18A9 9 0 1 1 9 0a9 9 0 0 1 0 18zM8.5 12l5-5-1.5-1.5L8.5 9 6 6.5 4.5 8l4 4z" fill="var(--success-color)" />
        </svg>
      )}
      {type === NOTIFICATION_TYPE.ERROR && (
        <svg className="notification__icon" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          <path d="M9 18A9 9 0 1 1 9 0a9 9 0 0 1 0 18zM9 2.5A1.5 1.5 0 0 0 7.5 4v4a1.5 1.5 0 0 0 3 0V4A1.5 1.5 0 0 0 9 2.5zm0 9a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z" fill="var(--danger-color)" />
        </svg>
      )}

      <p className="notification__text">{text}</p>
      {description && <div className="notification__description">{description}</div>}

      <button
        type="button"
        className="close  notification__close"
        aria-label="Close"
        onClick={() => notificationStore.remove(id)}
      >
        <Icon name="close" aria-hidden="true" />
      </button>
    </div>
  );
}
