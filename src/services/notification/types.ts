import type { ReactNode } from 'react';

export const NOTIFICATION_TYPE = {
  SUCCESS: 'SUCCESS',
  ERROR: 'ERROR',
} as const;

export type NOTIFICATION_TYPE = (typeof NOTIFICATION_TYPE)[keyof typeof NOTIFICATION_TYPE];

export interface NotificationPayload {
  text: string;
  type?: NOTIFICATION_TYPE;
  description?: string | ReactNode;
  duration?: number;
}

export interface NotificationItem extends NotificationPayload {
  id: number;
}
