import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputText } from '../InputText';

function setup(jsx: React.ReactElement) {
  return { user: userEvent.setup(), ...render(jsx) };
}

describe('InputText', () => {
  test('renders with placeholder', () => {
    render(<InputText name="name" placeholder="Name" />);

    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
  });

  test('calls onChange per character', async () => {
    const onChange = vi.fn();
    const { user } = setup(<InputText name="name" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'abc');

    expect(onChange).toHaveBeenCalledTimes(3);
  });
});
