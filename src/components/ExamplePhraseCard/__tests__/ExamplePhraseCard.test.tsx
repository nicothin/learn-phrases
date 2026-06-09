import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExamplePhraseCard } from '../ExamplePhraseCard';
import type { ExamplePhrase } from '../../../types';

const TIMESTAMP = new Date('2026-05-30T14:30:00').getTime();

const MOCK_PHRASE: ExamplePhrase = {
  id: 'test-1',
  text: 'Ich habe ein Auto',
  translation: 'У меня есть машина',
  textDescription: 'example of possession',
  translationDescription: 'пример обладания',
  lastShownTimestamp: TIMESTAMP,
};

function setup(overrides?: Partial<Parameters<typeof ExamplePhraseCard>[0]>) {
  return {
    user: userEvent.setup(),
    ...render(
      <ExamplePhraseCard
        phrase={MOCK_PHRASE}
        onClick={vi.fn()}
        {...overrides}
      />,
    ),
  };
}

describe('ExamplePhraseCard', () => {
  test('renders text', () => {
    setup();

    expect(screen.getByText('Ich habe ein Auto')).toBeInTheDocument();
  });

  test('renders translation', () => {
    setup();

    expect(screen.getByText('У меня есть машина')).toBeInTheDocument();
  });

  test('renders text description', () => {
    setup();

    expect(screen.getByText('example of possession')).toBeInTheDocument();
  });

  test('renders translation description', () => {
    setup();

    expect(screen.getByText('пример обладания')).toBeInTheDocument();
  });

  test('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const { user } = setup({ onClick });

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('calls onClick on Enter key', async () => {
    const onClick = vi.fn();
    const { user } = setup({ onClick });

    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('calls onClick on Space key', async () => {
    const onClick = vi.fn();
    const { user } = setup({ onClick });

    screen.getByRole('button').focus();
    await user.keyboard(' ');

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('does not render as button when onClick is not provided', () => {
    setup({ onClick: undefined });

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('does not render descriptions when absent', () => {
    const phraseWithoutDesc: ExamplePhrase = {
      ...MOCK_PHRASE,
      textDescription: undefined,
      translationDescription: undefined,
    };
    setup({ phrase: phraseWithoutDesc });

    expect(screen.queryByText('example of possession')).not.toBeInTheDocument();
    expect(screen.queryByText('пример обладания')).not.toBeInTheDocument();
  });

  test('does not render last shown when absent', () => {
    const phraseWithoutDate: ExamplePhrase = {
      ...MOCK_PHRASE,
      lastShownTimestamp: undefined,
    };
    setup({ phrase: phraseWithoutDate });

    expect(screen.queryByText('Last shown')).not.toBeInTheDocument();
  });
});
