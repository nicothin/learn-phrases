import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Confirm, type ConfirmProps } from '../Confirm';

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  });

  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  });
});

function setup(props?: Partial<ConfirmProps>) {
  const defaultProps: ConfirmProps = {
    isOpen: true,
    title: 'Are you sure?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  return {
    user: userEvent.setup(),
    props: { ...defaultProps, ...props },
    ...render(<Confirm {...defaultProps} {...props} />),
  };
}

describe('Confirm', () => {
  test('renders title and buttons when open', () => {
    setup();

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    setup({ isOpen: false });

    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  test('renders message', () => {
    setup({ message: 'This action is irreversible.' });

    expect(screen.getByText('This action is irreversible.')).toBeInTheDocument();
  });

  test('renders ReactNode as message', () => {
    setup({ message: <span data-testid="custom-msg">Custom message</span> });

    expect(screen.getByTestId('custom-msg')).toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', async () => {
    const onConfirm = vi.fn();
    const { user } = setup({ onConfirm });

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const onCancel = vi.fn();
    const { user } = setup({ onCancel });

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  test('uses custom button text', () => {
    setup({ confirmText: 'Yes, delete', cancelText: 'No, keep' });

    expect(screen.getByRole('button', { name: 'Yes, delete' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'No, keep' })).toBeInTheDocument();
  });

  test('applies danger variant by default', () => {
    setup();

    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    expect(confirmBtn.classList.contains('btn--danger')).toBe(true);
  });

  test('applies default variant when set', () => {
    setup({ variant: 'default' });

    const confirmBtn = screen.getByRole('button', { name: 'Confirm' });
    expect(confirmBtn.classList.contains('btn--default')).toBe(false);
  });
});
