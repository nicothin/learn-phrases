import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationItem } from '../NotificationItem';
import { notificationStore } from '../../../../services/notification/store';
import { NOTIFICATION_TYPE } from '../../../../services/notification/types';

const baseProps = { id: 1, text: 'Hello' };

function setup(jsx: React.ReactElement) {
  return { user: userEvent.setup(), ...render(jsx) };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('NotificationItem', () => {
  test('renders text', () => {
    render(<NotificationItem {...baseProps} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Hello');
  });

  test('renders with role="alert"', () => {
    render(<NotificationItem {...baseProps} />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  test('renders description as string', () => {
    render(<NotificationItem {...baseProps} description="Some details" />);

    expect(screen.getByText('Some details')).toBeInTheDocument();
  });

  test('renders description as ReactNode', () => {
    render(<NotificationItem {...baseProps} description={<span>Node</span>} />);

    expect(screen.getByText('Node')).toBeInTheDocument();
  });

  test('shows icon for SUCCESS type', () => {
    const { container } = render(<NotificationItem {...baseProps} type={NOTIFICATION_TYPE.SUCCESS} />);

    expect(container.querySelector('.notification__icon')).toBeInTheDocument();
  });

  test('shows icon for ERROR type', () => {
    const { container } = render(<NotificationItem {...baseProps} type={NOTIFICATION_TYPE.ERROR} />);

    expect(container.querySelector('.notification__icon')).toBeInTheDocument();
  });

  test('does not show icon when type is not provided', () => {
    const { container } = render(<NotificationItem {...baseProps} />);

    expect(container.querySelector('.notification__icon')).not.toBeInTheDocument();
  });

  test('calls notificationStore.remove on close button click', async () => {
    const spy = vi.spyOn(notificationStore, 'remove');
    const { user } = setup(<NotificationItem {...baseProps} />);

    await user.click(screen.getByRole('button', { name: /close/i }));

    expect(spy).toHaveBeenCalledWith(1);
  });

  test('auto-removes after default duration', async () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(notificationStore, 'remove');

    render(<NotificationItem {...baseProps} />);
    vi.advanceTimersByTime(5000);

    expect(spy).toHaveBeenCalledWith(1);
    vi.useRealTimers();
  });

  test('does not auto-remove when duration is 0', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(notificationStore, 'remove');

    render(<NotificationItem {...baseProps} duration={0} />);
    vi.advanceTimersByTime(10000);

    expect(spy).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  test('pauses auto-remove on mouse enter', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(notificationStore, 'remove');

    render(<NotificationItem {...baseProps} />);
    const alert = screen.getByRole('alert');

    // fireEvent is used here because userEvent with fakeTimers causes a timeout
    fireEvent.mouseEnter(alert);
    vi.advanceTimersByTime(5000);

    expect(spy).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  test('resumes auto-remove on mouse leave', () => {
    vi.useFakeTimers();
    const spy = vi.spyOn(notificationStore, 'remove');

    render(<NotificationItem {...baseProps} />);
    const alert = screen.getByRole('alert');

    fireEvent.mouseEnter(alert);
    vi.advanceTimersByTime(2000);
    fireEvent.mouseLeave(alert);

    vi.advanceTimersByTime(5000);

    expect(spy).toHaveBeenCalledWith(1);
    vi.useRealTimers();
  });
});
