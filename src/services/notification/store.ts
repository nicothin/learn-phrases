import type { NotificationItem, NotificationPayload } from './types';

type Listener = () => void;

let nextId = 1;
let notifications: NotificationItem[] = [];
const listeners = new Set<Listener>();

function subscribe(listener: Listener) {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

function getSnapshot(): NotificationItem[] {
  return notifications;
}

function emit() {
  listeners.forEach((listener) => listener());
}

function add(payload: NotificationPayload): void {
  const id = nextId++;
  const item: NotificationItem = { ...payload, id };

  notifications = [...notifications, item];
  emit();
}

function remove(id: number): void {
  notifications = notifications.filter((n) => n.id !== id);
  emit();
}

export const notificationStore = {
  subscribe,
  getSnapshot,
  add,
  remove,
};
