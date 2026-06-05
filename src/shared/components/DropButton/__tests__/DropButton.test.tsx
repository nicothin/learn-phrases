import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DropButton } from '../DropButton';

function setup(jsx: React.ReactElement) {
  return { user: userEvent.setup(), ...render(jsx) };
}

describe('DropButton', () => {
  test('renders button with content', () => {
    setup(<DropButton buttonContent="Menu" />);

    expect(screen.getByRole('button', { name: /open menu/i })).toBeInTheDocument();
  });

  test('does not render drop content when closed', () => {
    setup(
      <DropButton buttonContent="Menu">
        <p>drop content</p>
      </DropButton>,
    );

    expect(screen.queryByText('drop content')).not.toBeInTheDocument();
  });

  test('opens and closes on button click', async () => {
    const { user } = setup(
      <DropButton buttonContent="Menu">
        <p>drop content</p>
      </DropButton>,
    );

    const button = screen.getByRole('button', { name: /open menu/i });
    await user.click(button);

    expect(screen.getByText('drop content')).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'true');

    await user.click(button);

    expect(screen.queryByText('drop content')).not.toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  test('closes on Escape keydown', async () => {
    const { user } = setup(
      <DropButton buttonContent="Menu">
        <p>drop content</p>
      </DropButton>,
    );

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByText('drop content')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByText('drop content')).not.toBeInTheDocument();
  });

  test('closes on click outside', async () => {
    const { user } = setup(
      <div>
        <DropButton buttonContent="Menu">
          <p>drop content</p>
        </DropButton>
        <span>outside</span>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByText('drop content')).toBeInTheDocument();

    await user.click(screen.getByText('outside'));

    expect(screen.queryByText('drop content')).not.toBeInTheDocument();
  });

  test('closes on mouse leave from drop when closeOnMouseLeaveDrop is true', async () => {
    const { user } = setup(
      <DropButton buttonContent="Menu" closeOnMouseLeaveDrop>
        <p>drop content</p>
      </DropButton>,
    );

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByText('drop content')).toBeInTheDocument();

    await user.hover(screen.getByText('drop content'));
    await user.unhover(screen.getByText('drop content'));

    expect(screen.queryByText('drop content')).not.toBeInTheDocument();
  });

  test('does not close on mouse leave from drop when closeOnMouseLeaveDrop is false', async () => {
    const { user } = setup(
      <DropButton buttonContent="Menu" closeOnMouseLeaveDrop={false}>
        <p>drop content</p>
      </DropButton>,
    );

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByText('drop content')).toBeInTheDocument();

    await user.hover(screen.getByText('drop content'));
    await user.unhover(screen.getByText('drop content'));

    expect(screen.getByText('drop content')).toBeInTheDocument();
  });

  test('does not close on click outside when closeOnClickOutside is false', async () => {
    const { user } = setup(
      <div>
        <DropButton buttonContent="Menu" closeOnClickOutside={false}>
          <p>drop content</p>
        </DropButton>
        <span>outside</span>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: /open menu/i }));
    expect(screen.getByText('drop content')).toBeInTheDocument();

    await user.click(screen.getByText('outside'));

    expect(screen.getByText('drop content')).toBeInTheDocument();
  });

  test('applies direction prop', () => {
    setup(<DropButton buttonContent="Menu" direction="left-top" />);

    expect(screen.getByText('Menu')).toBeInTheDocument();
  });

  test('applies custom className to wrapper', () => {
    setup(<DropButton buttonContent="Menu" className="my-class" />);

    expect(screen.getByText('Menu').parentElement).toHaveClass('my-class');
  });

  test('applies custom buttonClassName to button', () => {
    setup(<DropButton buttonContent="Menu" buttonClassName="btn-custom" />);

    expect(screen.getByRole('button', { name: /open menu/i })).toHaveClass('btn-custom');
  });

  test('renders title attribute on button', () => {
    setup(<DropButton buttonContent="Menu" title="tooltip" />);

    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('title', 'tooltip');
  });

  test('sets aria-haspopup on button', () => {
    setup(<DropButton buttonContent="Menu" />);

    expect(screen.getByRole('button', { name: /open menu/i })).toHaveAttribute('aria-haspopup', 'true');
  });

  test('shows drop content when button is clicked', async () => {
    const { user } = setup(
      <DropButton buttonContent="Menu">
        <p>drop</p>
      </DropButton>,
    );

    await user.click(screen.getByRole('button', { name: /open menu/i }));

    expect(screen.getByText('drop')).toBeInTheDocument();
  });
});
