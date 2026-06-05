import { render, screen } from '@testing-library/react';
import { NotificationList } from '../NotificationList';
import { notificationStore } from '../../../../services/notification/store';

beforeEach(() => {
  const all = notificationStore.getSnapshot();
  all.forEach((n) => notificationStore.remove(n.id));
});

describe('NotificationList', () => {
  test('renders nothing when there are no notifications', () => {
    const { container } = render(<NotificationList />);

    expect(container).toBeEmptyDOMElement();
  });

  test('renders each notification as an alert', () => {
    notificationStore.add({ text: 'First' });
    notificationStore.add({ text: 'Second' });

    render(<NotificationList />);

    const alerts = screen.getAllByRole('alert');

    expect(alerts).toHaveLength(2);
    expect(alerts[0]).toHaveTextContent('First');
    expect(alerts[1]).toHaveTextContent('Second');
  });

  test('reacts to store updates after initial render', () => {
    const { rerender } = render(<NotificationList />);

    notificationStore.add({ text: 'Dynamic' });
    rerender(<NotificationList />);

    expect(screen.getByRole('alert')).toHaveTextContent('Dynamic');
  });

  test('removes notification from list when store removes it', () => {
    notificationStore.add({ text: 'To be removed' });
    notificationStore.add({ text: 'Stays' });
    const { rerender } = render(<NotificationList />);

    expect(screen.getAllByRole('alert')).toHaveLength(2);

    const [first] = notificationStore.getSnapshot();
    notificationStore.remove(first.id);
    rerender(<NotificationList />);

    const alerts = screen.getAllByRole('alert');

    expect(alerts).toHaveLength(1);
    expect(alerts[0]).toHaveTextContent('Stays');
  });
});
