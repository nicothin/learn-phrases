import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tag, type TagProps } from '../Tag';

function setup(props?: Partial<TagProps>) {
  return { user: userEvent.setup(), ...render(<Tag {...props}>Hello</Tag>) };
}

describe('Tag', () => {
  test('renders text', () => {
    render(<Tag>Hello</Tag>);

    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  test('renders as button when onClick provided', () => {
    render(<Tag onClick={vi.fn()}>Hello</Tag>);

    expect(screen.getByRole('button', { name: 'Hello' })).toBeInTheDocument();
  });

  test('calls onClick when text button is clicked', async () => {
    const onClick = vi.fn();
    const { user } = setup({ onClick });

    await user.click(screen.getByRole('button', { name: 'Hello' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('disables text button when disabled and onClick provided', () => {
    render(<Tag onClick={vi.fn()} disabled>Hello</Tag>);

    expect(screen.getByRole('button', { name: 'Hello' })).toBeDisabled();
  });

  test('shows close button when onClose is provided', () => {
    render(<Tag onClose={vi.fn()}>Hello</Tag>);

    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });

  test('hides close button when onClose is not provided', () => {
    render(<Tag>Hello</Tag>);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', async () => {
    const onClose = vi.fn();
    const { user } = setup({ onClose });

    await user.click(screen.getByRole('button', { name: 'Remove' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('disables close button when disabled', () => {
    render(<Tag onClose={vi.fn()} disabled>Hello</Tag>);

    expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();
  });

  test('renders both buttons when onClick and onClose provided', () => {
    render(<Tag onClick={vi.fn()} onClose={vi.fn()}>Hello</Tag>);

    expect(screen.getByRole('button', { name: 'Hello' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove' })).toBeInTheDocument();
  });
});
