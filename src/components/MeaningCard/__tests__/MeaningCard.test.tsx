import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MeaningCard } from '../MeaningCard';
import type { Meaning } from '../../../types';

const MOCK_MEANING: Meaning = {
  id: 'test-1',
  lemma: 'haben',
  translation: 'иметь',
  pos: 'verb',
  cefrLevel: 'A1',
  knowledgeLvl: 5,
  showAfterTimestamp: new Date('2026-05-30T14:30:00').getTime(),
  exampleIds: [],
};

function setup(overrides?: Partial<Parameters<typeof MeaningCard>[0]>) {
  return {
    user: userEvent.setup(),
    ...render(
      <MeaningCard
        meaning={MOCK_MEANING}
        onClick={vi.fn()}
        {...overrides}
      />,
    ),
  };
}

describe('MeaningCard', () => {
  test('renders lemma', () => {
    setup();

    expect(screen.getByText('haben')).toBeInTheDocument();
  });

  test('renders translation', () => {
    setup();

    expect(screen.getByText('иметь')).toBeInTheDocument();
  });

  test('renders part of speech', () => {
    setup();

    expect(screen.getByText('Verb')).toBeInTheDocument();
  });

  test('renders CEFR level', () => {
    setup();

    expect(screen.getByText('A1')).toBeInTheDocument();
  });

  test('renders knowledge level', () => {
    setup();

    expect(screen.getByText('Level 5/8')).toBeInTheDocument();
  });

  test('renders next review date', () => {
    setup();

    expect(screen.getByText('30 May 2026, 14:30')).toBeInTheDocument();
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

  test('does not render date when showAfterTimestamp is missing', () => {
    const meaningWithoutDate = { ...MOCK_MEANING, showAfterTimestamp: undefined };
    setup({ meaning: meaningWithoutDate });

    expect(screen.queryByText('30 May 2026, 14:30')).not.toBeInTheDocument();
  });
});
