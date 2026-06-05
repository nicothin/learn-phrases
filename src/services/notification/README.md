# Notification Service

## Usage

### 1. Mount `NotificationList` in the app root

```tsx
import { NotificationList } from '~/shared/components/NotificationList/NotificationList';

export function App() {
  return (
    <>
      <Router />
      <NotificationList />
    </>
  );
}
```

### 2. Call from anywhere

```tsx
import { notification, NOTIFICATION_TYPE } from '~/services/notification';

notification.add({ text: 'Saved', type: NOTIFICATION_TYPE.SUCCESS });
notification.add({
  text: 'Validation error',
  type: NOTIFICATION_TYPE.ERROR,
  description: 'Email field is invalid',
});
```

## API

### `notification.add(payload: NotificationPayload)`

| Field         | Type                    | Default     | Description                        |
|---------------|-------------------------|-------------|------------------------------------|
| `text`        | `string`                | —           | Notification text **(required)**   |
| `type`        | `NOTIFICATION_TYPE`     | `undefined` | `SUCCESS` or `ERROR`               |
| `description` | `string \| ReactNode`   | `undefined` | Extended description               |
| `duration`    | `number`                | `5000`      | Auto-close timeout in ms. `0` = no auto-close |

### `NOTIFICATION_TYPE`

- `SUCCESS` — green check icon
- `ERROR` — red exclamation icon

> When `duration` is `0` the notification stays until closed manually. Hovering pauses the auto-close timer.
