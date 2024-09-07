import { createContext, FC, ReactNode, useCallback, useMemo, useState } from 'react';

import './NotificationContext.css';
import '../../assets/close.css';

import { Notification } from '../../types';
import { STATUS } from '../../enums';

interface NotificationWithId extends Notification {
  id: number;
}

interface NotificationsContextType {
  addNotification: (notification: Notification) => void;
  removeNotification: (id: number) => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [allNotifications, setAllNotifications] = useState<NotificationWithId[]>([]);

  const removeNotification = useCallback((id: number) => {
    setAllNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.filter((notification) => notification.id !== id);

      const notificationToRemove = prevNotifications.find((notification) => notification.id === id);
      if (notificationToRemove?.timeoutId) {
        clearTimeout(notificationToRemove.timeoutId);
      }

      return updatedNotifications;
    });
  }, []);

  const addNotification = useCallback(
    (notification: Notification) => {
      const id = !notification.id ? Date.now() : notification.id;
      const newNotification = { ...notification, id };

      const duration = notification.duration ?? 10000;

      if (newNotification?.duration !== 0) {
        const timeoutId = setTimeout(() => {
          removeNotification(newNotification.id);
        }, duration);

        newNotification.timeoutId = timeoutId;
      }

      setAllNotifications((prevNotifications) => [...prevNotifications, newNotification]);

      if (notification.consoleDescription) {
        if (notification.type === STATUS.ERROR) {
          console.error(notification.consoleDescription);
        } else {
          console.info(notification.consoleDescription);
        }
      }
    },
    [removeNotification],
  );

  const value = useMemo(() => {
    return { addNotification, removeNotification };
  }, [addNotification, removeNotification]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}

      <div className="notifications">
        {allNotifications.map((item) => (
          <div
            key={item.id}
            className={`
              notification
              ${item.type === STATUS.SUCCESS ? 'notification--success' : ''}
              ${item.type === STATUS.ERROR ? 'notification--error' : ''}
            `.trim()}
            role="alert"
            onMouseEnter={() => {
              if (item.timeoutId) {
                clearTimeout(item.timeoutId);
              }
            }}
            onMouseLeave={() => {
              if (item.duration && item.duration !== 0) {
                const timeoutId: NodeJS.Timeout = setTimeout(() => {
                  removeNotification(item.id);
                }, item.duration);
                item.timeoutId = timeoutId;
              }
            }}
          >
            {item.type === STATUS.SUCCESS && (
              <svg className="notification__icon" width="18" height="18">
                <use xlinkHref="#success" fill="var(--success-color)" />
              </svg>
            )}
            {item.type === STATUS.ERROR && (
              <svg className="notification__icon" width="18" height="18">
                <use xlinkHref="#error" fill="var(--danger-color)" />
              </svg>
            )}

            <p className="notification__text">{item.text}</p>
            {item.description && <div className="notification__description">{item.description}</div>}

            <button
              type="button"
              className="close notification__close"
              data-dismiss="alert"
              aria-label="Close"
              onClick={() => removeNotification(item.id)}
            >
              <span aria-hidden="true">×</span>
            </button>
          </div>
        ))}
      </div>
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
