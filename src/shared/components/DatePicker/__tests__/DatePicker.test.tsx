import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DatePicker } from '../DatePicker';

function setup(jsx: React.ReactElement) {
  return { user: userEvent.setup(), ...render(jsx) };
}

const MAR_15_2026_14_30 = new Date(2026, 2, 15, 14, 30).getTime();

describe('DatePicker', () => {
  test('renders label when provided', () => {
    render(<DatePicker name="date" value={MAR_15_2026_14_30} label="Дата" />);

    expect(screen.getByText('Дата')).toBeInTheDocument();
  });

  test('does not render label when not provided', () => {
    render(<DatePicker name="date" value={MAR_15_2026_14_30} />);

    expect(screen.queryByText('Дата')).not.toBeInTheDocument();
  });

  test('displays formatted date and time', () => {
    render(<DatePicker name="date" value={MAR_15_2026_14_30} />);

    expect(screen.getByText('15 Mar 2026, 14:30')).toBeInTheDocument();
  });

  test('displays midnight as 00:00', () => {
    const midnight = new Date(2026, 2, 15).getTime();

    render(<DatePicker name="date" value={midnight} />);

    expect(screen.getByText('15 Mar 2026, 00:00')).toBeInTheDocument();
  });

  test('displays placeholder when value is undefined', () => {
    render(<DatePicker name="date" value={undefined} placeholder="Выберите дату" />);

    expect(screen.getByText('Выберите дату')).toBeInTheDocument();
  });

  test('renders empty text when value and placeholder are not provided', () => {
    const { container } = render(<DatePicker name="date" value={undefined} />);

    const textEl = container.querySelector('.date-picker__text');

    expect(textEl?.textContent).toBe('');
  });

  test('calls onChange with epoch ms when datetime selected', async () => {
    const onChange = vi.fn();
    const { user } = setup(
      <DatePicker name="date" value={undefined} onChange={onChange} />,
    );

    const nativeInput = screen.getByDisplayValue('');
    await user.tripleClick(nativeInput);
    await user.keyboard('2026-03-15T14:30');

    expect(onChange).toHaveBeenCalledWith(MAR_15_2026_14_30);
  });

  test('calls onChange with undefined when cleared', async () => {
    const onChange = vi.fn();
    const { user } = setup(
      <DatePicker name="date" value={MAR_15_2026_14_30} onChange={onChange} />,
    );

    const nativeInput = screen.getByDisplayValue('2026-03-15T14:30');
    await user.clear(nativeInput);

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  test('renders label as ReactNode', () => {
    render(
      <DatePicker
        name="date"
        value={MAR_15_2026_14_30}
        label={<span data-testid="custom-label">Custom</span>}
      />,
    );

    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
  });

  test('applies placeholder CSS class when showing placeholder', () => {
    const { container } = render(
      <DatePicker name="date" value={undefined} placeholder="Выберите дату" />,
    );

    const textEl = container.querySelector('.date-picker__text');

    expect(textEl?.classList.contains('date-picker__text--placeholder')).toBe(true);
  });
});
