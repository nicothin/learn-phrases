import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputCheckbox } from '../InputCheckbox';

function setup(jsx: React.ReactElement) {
  return { user: userEvent.setup(), ...render(jsx) };
}

describe('InputCheckbox', () => {
  test('renders unchecked checkbox', () => {
    render(<InputCheckbox name="accept"><span>Accept</span></InputCheckbox>);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toBeChecked();
  });

  test('toggles on click', async () => {
    const onChange = vi.fn();
    const { user } = setup(
      <InputCheckbox name="accept" onChange={onChange}>
        <span>Accept</span>
      </InputCheckbox>,
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
