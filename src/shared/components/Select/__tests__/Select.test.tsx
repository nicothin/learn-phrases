import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '../Select';

const options = [
  { value: '1', label: 'One' },
  { value: '2', label: 'Two' },
];

function setup(jsx: React.ReactElement) {
  return { user: userEvent.setup(), ...render(jsx) };
}

describe('Select', () => {
  test('renders options', () => {
    render(<Select name="select" options={options} />);

    expect(screen.getAllByRole('option')).toHaveLength(2);
  });

  test('calls onChange with selected value', async () => {
    const onChange = vi.fn();
    const { user } = setup(<Select name="select" options={options} onChange={onChange} />);

    await user.selectOptions(screen.getByRole('combobox'), '2');

    expect(onChange).toHaveBeenCalledWith('2');
  });
});
