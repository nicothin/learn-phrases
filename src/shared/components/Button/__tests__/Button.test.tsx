import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, type ButtonProps } from '../Button';

function setup(props?: Partial<ButtonProps>) {
  return { user: userEvent.setup(), ...render(<Button {...props}>Click</Button>) };
}

describe('Button', () => {
  test('renders with text', () => {
    render(<Button>Click</Button>);

    expect(screen.getByRole('button', { name: 'Click' })).toBeInTheDocument();
  });

  test('renders with variant and size props', () => {
    render(<Button variant="danger" size="sm">Delete</Button>);

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  test('renders with link variant', () => {
    render(<Button variant="link">Link</Button>);

    expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument();
  });

  test('renders with text-link variant', () => {
    render(<Button variant="text-link">TextLink</Button>);

    expect(screen.getByRole('button', { name: 'TextLink' })).toBeInTheDocument();
  });

  test('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const { user } = setup({ onClick });

    await user.click(screen.getByRole('button', { name: 'Click' }));

    expect(onClick).toHaveBeenCalled();
  });
});
