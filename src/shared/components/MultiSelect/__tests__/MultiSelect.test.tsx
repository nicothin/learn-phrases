import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { MultiSelect, type MultiSelectOption, type MultiSelectProps } from '../MultiSelect';

class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

window.ResizeObserver = ResizeObserverMock;

const options: MultiSelectOption[] = [
  { value: '1', label: 'German' },
  { value: '2', label: 'French' },
  { value: '3', label: 'Spanish' },
];

function ControlledMultiSelect({ value: _value, ...props }: Partial<MultiSelectProps>) {
  const [value, setValue] = useState<string[]>(_value ?? []);

  return <MultiSelect name="lang" options={options} value={value} onChange={setValue} {...props} />;
}

function setup(props?: Partial<MultiSelectProps>) {
  return { user: userEvent.setup(), ...render(<ControlledMultiSelect {...props} />) };
}

describe('MultiSelect', () => {
  test('renders with label', () => {
    render(<ControlledMultiSelect label="Languages" />);

    expect(screen.getByText('Languages')).toBeInTheDocument();
  });

  test('renders placeholder when no value selected', () => {
    render(<ControlledMultiSelect placeholder="Select languages" />);

    expect(screen.getByPlaceholderText('Select languages')).toBeInTheDocument();
  });

  test('does not show placeholder when value is selected', () => {
    render(<ControlledMultiSelect value={['1']} placeholder="Select languages" />);

    expect(screen.queryByPlaceholderText('Select languages')).not.toBeInTheDocument();
  });

  test('renders selected options as Tags', () => {
    render(<ControlledMultiSelect value={['1', '2']} />);

    expect(screen.getByText('German')).toBeInTheDocument();
    expect(screen.getByText('French')).toBeInTheDocument();
  });

  test('opens dropdown on input focus', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('combobox'));

    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  test('closes dropdown on Escape', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  test('filters options based on input', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'fre');

    expect(screen.getByText('French')).toBeInTheDocument();
    expect(screen.queryByText('German')).not.toBeInTheDocument();
    expect(screen.queryByText('Spanish')).not.toBeInTheDocument();
  });

  test('selects option on click', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('French'));

    expect(screen.getByText('French')).toBeInTheDocument();
  });

  test('selects option on Enter', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(screen.getByText('German')).toBeInTheDocument();
  });

  test('removes tag on close button click', async () => {
    const { user } = setup({ value: ['1', '2'] });

    await user.click(screen.getAllByRole('button', { name: 'Remove' })[0]);

    expect(screen.getAllByRole('button', { name: 'Remove' })).toHaveLength(1);
  });

  test('removes last tag on Backspace with empty input', async () => {
    const { user } = setup({ value: ['1'] });

    await user.click(screen.getByRole('combobox'));
    await user.keyboard('{Backspace}');

    expect(screen.queryByRole('button', { name: 'Remove' })).not.toBeInTheDocument();
  });

  test('navigates options with ArrowDown and ArrowUp', async () => {
    const { user } = setup();

    // Focus opens dropdown and highlights first option
    await user.click(screen.getByRole('combobox'));

    const options = () => screen.getAllByRole('option');

    // ArrowDown → second option highlighted (open() highlights 0th)
    await user.keyboard('{ArrowDown}');

    expect(options()[1]).toHaveClass('multiselect__option--highlighted');

    // ArrowDown → third option highlighted
    await user.keyboard('{ArrowDown}');

    expect(options()[2]).toHaveClass('multiselect__option--highlighted');

    // ArrowUp → second option highlighted
    await user.keyboard('{ArrowUp}');

    expect(options()[1]).toHaveClass('multiselect__option--highlighted');
  });

  test('shows no results when filter matches nothing', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'zzz');

    expect(screen.getByText('No results')).toBeInTheDocument();
    expect(screen.queryByRole('option')).not.toBeInTheDocument();
  });

  test('does not show selected options in dropdown', async () => {
    const { user } = setup({ value: ['1'] });

    await user.click(screen.getByRole('combobox'));

    const listbox = screen.getByRole('listbox');

    expect(within(listbox).queryByText('German')).not.toBeInTheDocument();
    expect(within(listbox).getByText('French')).toBeInTheDocument();
    expect(within(listbox).getByText('Spanish')).toBeInTheDocument();
  });

  test('scrolls to highlighted option', async () => {
    const manyOptions: MultiSelectOption[] = Array.from({ length: 20 }, (_, i) => ({
      value: String(i),
      label: `Option ${i}`,
    }));

    const { user } = setup({ options: manyOptions });

    await user.click(screen.getByRole('combobox'));

    for (let i = 0; i < 15; i++) {
      await user.keyboard('{ArrowDown}');
    }

    const highlighted = screen.getAllByRole('option')[15];
    expect(highlighted).toHaveClass('multiselect__option--highlighted');
  });

  test('clears input after selecting an option', async () => {
    const { user } = setup();

    await user.click(screen.getByRole('combobox'));
    await user.type(screen.getByRole('combobox'), 'fre');
    await user.click(screen.getByText('French'));

    expect(screen.getByRole('combobox')).toHaveValue('');
  });

});
