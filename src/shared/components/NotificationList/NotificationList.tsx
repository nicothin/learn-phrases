import { useSyncExternalStore } from 'react';

import './NotificationList.css';

import { notificationStore } from '../../../services/notification/store';
import { NotificationItem } from '../NotificationItem/NotificationItem';

export function NotificationList() {
  const notifications = useSyncExternalStore(
    notificationStore.subscribe,
    notificationStore.getSnapshot,
    notificationStore.getSnapshot,
  );

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-list">
      {notifications.map((item) => (
        <NotificationItem key={item.id} {...item} />
      ))}
    </div>
  );
}
