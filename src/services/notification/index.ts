import { notificationStore } from './store';
import type { NotificationPayload } from './types';

export type { NotificationPayload };
export { NOTIFICATION_TYPE } from './types';

export const notification = {
  add(payload: NotificationPayload): void {
    notificationStore.add(payload);
  },
};
