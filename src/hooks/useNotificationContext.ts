import { useContext } from 'react';

import NotificationContext from '../contexts/NotificationContext/NotificationsContext';

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationContextProvider()');
  }
  return context;
};
