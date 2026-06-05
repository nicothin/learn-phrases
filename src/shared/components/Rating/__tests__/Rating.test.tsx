import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Rating } from '../Rating';

function setup(jsx: React.ReactElement) {
  return { user: userEvent.setup(), ...render(jsx) };
}

describe('Rating', () => {
  test('renders correct number of items', () => {
    render(<Rating level={3} maxLevel={5} />);

    const items = screen.getAllByTestId('rating__item');

    expect(items).toHaveLength(5);
  });

  test('sets rating on click', async () => {
    const onChange = vi.fn();
    const { user } = setup(<Rating level={0} maxLevel={5} onChange={onChange} />);

    const items = screen.getAllByRole('button');
    await user.click(items[2]);

    expect(onChange).toHaveBeenCalledWith(3);
  });

  test('renders from minLevel to maxLevel', () => {
    render(<Rating minLevel={3} maxLevel={6} level={4} />);

    const items = screen.getAllByTestId('rating__item');

    expect(items).toHaveLength(4);
  });

  test('returns nothing when minLevel > maxLevel', () => {
    const { container } = render(<Rating minLevel={5} maxLevel={3} />);

    expect(container).toBeEmptyDOMElement();
  });

  test('click returns correct level with minLevel', async () => {
    const onChange = vi.fn();
    const { user } = setup(<Rating minLevel={3} maxLevel={6} level={3} onChange={onChange} />);

    const items = screen.getAllByRole('button');
    await user.click(items[1]);

    expect(onChange).toHaveBeenCalledWith(4);
  });

  test('renders with custom className', () => {
    const { container } = render(<Rating level={3} maxLevel={5} className="my-class" />);

    expect(container.firstChild).toHaveClass('my-class');
  });

  test('renders non-interactive items as spans when onChange is not provided', () => {
    render(<Rating level={3} maxLevel={5} />);

    const items = screen.getAllByTestId('rating__item');

    items.forEach((item) => {
      expect(item.tagName).toBe('SPAN');
    });
  });

  test('renders interactive items as buttons when onChange is provided', () => {
    render(<Rating level={3} maxLevel={5} onChange={() => {}} />);

    const items = screen.getAllByRole('button');

    expect(items).toHaveLength(5);
  });

  test('calls console.error when minLevel > maxLevel', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Rating minLevel={5} maxLevel={3} />);

    expect(consoleSpy).toHaveBeenCalledWith('Rating: maxLevel (3) is less than minLevel (5)');

    consoleSpy.mockRestore();
  });
});
