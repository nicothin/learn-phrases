import { NotificationInstance } from 'antd/es/notification/interface';
import { NotificationType } from '../types';

export const openNotification = (
  showNotification: NotificationInstance,
  type: NotificationType = 'info',
  message: string,
  description?: string,
) => {
  if (!message && !description) return;

  showNotification[type]({
    message,
    description,
  });
};
