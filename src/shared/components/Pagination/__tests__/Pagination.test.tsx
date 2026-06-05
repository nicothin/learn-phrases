import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '../Pagination';

function setup(currentPage = 1, totalPages = 10) {
  const onPageChange = vi.fn();

  return {
    onPageChange,
    user: userEvent.setup(),
    ...render(
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />,
    ),
  };
}

describe('Pagination', () => {
  test('renders current page and total pages', () => {
    setup(3, 10);

    const input = screen.getByRole('spinbutton', { name: 'Current page' });

    expect(input).toHaveValue(3);
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  test('disables prev on first page', () => {
    setup(1, 10);

    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  });

  test('disables next on last page', () => {
    setup(10, 10);

    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
  });

  test('calls onPageChange on next click', async () => {
    const { onPageChange, user } = setup(3, 10);

    await user.click(screen.getByRole('button', { name: 'Next page' }));

    expect(onPageChange).toHaveBeenCalledWith(4);
  });

  test('calls onPageChange on prev click', async () => {
    const { onPageChange, user } = setup(3, 10);

    await user.click(screen.getByRole('button', { name: 'Previous page' }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  test('calls onPageChange on valid input change', () => {
    const { onPageChange } = setup(3, 10);

    const input = screen.getByRole('spinbutton', { name: 'Current page' });
    fireEvent.change(input, { target: { value: '5' } });

    expect(onPageChange).toHaveBeenCalledWith(5);
  });

  test('does not call onPageChange for out-of-range input', () => {
    const { onPageChange } = setup(3, 10);

    const input = screen.getByRole('spinbutton', { name: 'Current page' });
    fireEvent.change(input, { target: { value: '0' } });

    expect(onPageChange).not.toHaveBeenCalled();
  });
});
