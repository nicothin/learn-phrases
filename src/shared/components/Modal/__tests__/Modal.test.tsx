import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Modal, type ModalProps } from '../Modal';

function setup(props?: Partial<ModalProps>) {
  return { user: userEvent.setup(), ...render(<Modal isOpen {...props}>content</Modal>) };
}

describe('Modal', () => {
  test('renders content when open', () => {
    setup();

    expect(screen.getByText('content')).toBeInTheDocument();
  });

  test('does not render in DOM when isOpen is false', () => {
    render(<Modal isOpen={false}>content</Modal>);

    expect(screen.queryByText('content')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const { user } = setup({ onClose });

    await user.click(screen.getByRole('button', { name: 'Close' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('hides close button when closable is false', () => {
    setup({ closable: false });

    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();
  });

  test('renders title in the header', () => {
    setup({ title: 'Modal Title' });

    expect(screen.getByRole('heading', { name: 'Modal Title' })).toBeInTheDocument();
  });

  test('renders with custom className', () => {
    const { container } = setup({ className: 'custom-class' });

    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  test('renders with custom contentClassName on the body', () => {
    const { container } = setup({ contentClassName: 'custom-content' });

    expect(container.querySelector('.custom-content')).toBeInTheDocument();
  });

  test('renders actions footer', () => {
    setup({ actions: <button type="button">Save</button> });

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  test('does not close on backdrop click when closeOnBackdropClick is false', async () => {
    const onClose = vi.fn();
    const { user } = setup({ onClose, closeOnBackdropClick: false });

    const overlay = document.querySelector('.modal__overlay')!;
    await user.click(overlay);

    expect(onClose).not.toHaveBeenCalled();
  });

  test('closes on backdrop click when closeOnBackdropClick is true', async () => {
    const onClose = vi.fn();
    const { user } = setup({ onClose, closeOnBackdropClick: true });

    const overlay = document.querySelector('.modal__overlay')!;
    await user.click(overlay);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('locks body scroll when open', () => {
    setup();

    expect(document.body.style.overflow).toBe('hidden');
  });

  test('removes body scroll lock on unmount', () => {
    const { unmount } = setup();

    unmount();

    expect(document.body.style.overflow).toBe('');
  });

  test('adds padding compensation only when scrollbar is visible', () => {
    const originalInnerWidth = window.innerWidth;
    const originalClientWidth = document.documentElement.clientWidth;

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1100 });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1083 });

    const { unmount } = setup();

    expect(document.body.style.paddingRight).toBe('var(--scrollbar-width)');

    unmount();

    expect(document.body.style.paddingRight).toBe('');

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: originalClientWidth });
  });

  test('does not add padding when no visible scrollbar', () => {
    const originalInnerWidth = window.innerWidth;
    const originalClientWidth = document.documentElement.clientWidth;

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1024 });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: 1024 });

    setup();

    expect(document.body.style.paddingRight).toBe('');

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: originalInnerWidth });
    Object.defineProperty(document.documentElement, 'clientWidth', { configurable: true, value: originalClientWidth });
  });

  test('closes on Escape key press when closable', async () => {
    const onClose = vi.fn();
    const { user } = setup({ onClose });

    await user.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('blocks Escape key press when not closable', async () => {
    const onClose = vi.fn();
    setup({ onClose, closable: false });

    await userEvent.setup().keyboard('{Escape}');

    expect(onClose).not.toHaveBeenCalled();
  });

  test('has dialog accessibility attributes', () => {
    setup();

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});