import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioButtons } from '../RadioButtons';

function setup(jsx: React.ReactElement) {
  return { user: userEvent.setup(), ...render(jsx) };
}

const options = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

describe('RadioButtons', () => {
  test('renders all options', () => {
    render(<RadioButtons name="difficulty" value="medium" options={options} />);

    const radios = screen.getAllByRole('radio');

    expect(radios).toHaveLength(3);
  });

  test('checks the selected value', () => {
    render(<RadioButtons name="difficulty" value="medium" options={options} />);

    expect(screen.getByDisplayValue('medium')).toBeChecked();
  });

  test('calls onChange with value on click', async () => {
    const onChange = vi.fn();
    const { user } = setup(
      <RadioButtons name="difficulty" value="easy" options={options} onChange={onChange} />,
    );

    await user.click(screen.getByDisplayValue('hard'));

    expect(onChange).toHaveBeenCalledWith('hard');
  });

  test('renders label when provided', () => {
    render(
      <RadioButtons name="difficulty" value="medium" options={options} label="Difficulty" />,
    );

    expect(screen.getByText('Difficulty')).toBeInTheDocument();
  });

  test('does not render label when not provided', () => {
    render(<RadioButtons name="difficulty" value="medium" options={options} />);

    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  test('disables option when disabled is true', () => {
    const opts = [
      { value: 'easy', label: 'Easy' },
      { value: 'hard', label: 'Hard', disabled: true },
    ];

    render(<RadioButtons name="difficulty" value="easy" options={opts} />);

    expect(screen.getByDisplayValue('hard')).toBeDisabled();
  });

  test('does not call onChange for disabled option', async () => {
    const onChange = vi.fn();
    const opts = [
      { value: 'easy', label: 'Easy' },
      { value: 'hard', label: 'Hard', disabled: true },
    ];
    const { user } = setup(
      <RadioButtons name="difficulty" value="easy" options={opts} onChange={onChange} />,
    );

    await user.click(screen.getByDisplayValue('hard'));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders with custom cellWidth as string', () => {
    const { container } = render(
      <RadioButtons name="difficulty" value="medium" options={options} cellWidth="100%" />,
    );

    const list = container.querySelector('.radio-buttons__list');

    expect(list).toHaveStyle('grid-template-columns: repeat(auto-fill, minmax(100%, 1fr))');
  });

  test('renders with custom cellWidth as object', () => {
    const { container } = render(
      <RadioButtons
        name="difficulty"
        value="medium"
        options={options}
        cellWidth={{ min: '80px', max: '200px' }}
      />,
    );

    const list = container.querySelector('.radio-buttons__list');

    expect(list).toHaveStyle('grid-template-columns: repeat(auto-fill, minmax(80px, 200px))');
  });

  test('renders with custom cellWidth object without max', () => {
    const { container } = render(
      <RadioButtons
        name="difficulty"
        value="medium"
        options={options}
        cellWidth={{ min: '80px' }}
      />,
    );

    const list = container.querySelector('.radio-buttons__list');

    expect(list).toHaveStyle('grid-template-columns: repeat(auto-fill, minmax(80px, 1fr))');
  });

  test('renders label as ReactNode', () => {
    render(
      <RadioButtons
        name="difficulty"
        value="medium"
        options={options}
        label={<span data-testid="custom-label">Custom</span>}
      />,
    );

    expect(screen.getByTestId('custom-label')).toBeInTheDocument();
  });
});
