import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LearningCard } from '../LearningCard';
import type { LearningItem } from '../../../types';

const MOCK_ITEM: LearningItem = {
  meaning: {
    id: 'meaning-1',
    lemma: 'haben',
    translation: 'иметь',
    description: 'to have, to possess',
    pos: 'verb',
    cefrLevel: 'A1',
    exampleIds: ['phrase-1'],
    knowledgeLvl: 5,
  },
  phrase: {
    id: 'phrase-1',
    text: 'Ich habe ein Auto',
    textDescription: 'example of possession',
    translation: 'У меня есть машина',
    translationDescription: 'пример обладания',
  },
};

const MOCK_ITEM_NO_DESC: LearningItem = {
  meaning: {
    id: 'meaning-2',
    lemma: 'sein',
    translation: 'быть',
    pos: 'verb',
    cefrLevel: 'A1',
    exampleIds: [],
    knowledgeLvl: 3,
  },
  phrase: {
    id: 'phrase-2',
    text: 'Ich bin glücklich',
    translation: 'Я счастлив',
  },
};

function setup(overrides?: Partial<Parameters<typeof LearningCard>[0]>) {
  return {
    user: userEvent.setup(),
    ...render(
      <LearningCard
        item={MOCK_ITEM}
        {...overrides}
      />,
    ),
  };
}

describe('LearningCard', () => {
  describe('mode="reverse"', () => {
    test('renders phrase text initially', () => {
      setup({ mode: 'reverse' });

      expect(screen.getByText('Ich habe ein Auto')).toBeInTheDocument();
    });

    test('renders translation description initially', () => {
      setup({ mode: 'reverse' });

      expect(screen.getByText('example of possession')).toBeInTheDocument();
    });

    test('does not render translation as visible face', () => {
      setup({ mode: 'reverse' });

      const collapsableWrap = document.querySelector<HTMLElement>('.learning-card__collapsable-wrap')!;
      expect(collapsableWrap.style.maxHeight).toBe('0px');
    });

    test('click reveals translation and details', async () => {
      const { user } = setup({ mode: 'reverse' });

      await user.click(screen.getByText('Ich habe ein Auto'));

      expect(screen.getByText('У меня есть машина')).toBeInTheDocument();
      expect(screen.getByText('пример обладания')).toBeInTheDocument();
      expect(screen.getByText('haben')).toBeInTheDocument();
      expect(screen.getByText('A1')).toBeInTheDocument();
      expect(screen.getByText(/Verb/)).toBeInTheDocument();
    });

    test('click again hides translation and details', async () => {
      const { user } = setup({ mode: 'reverse' });

      const collapsableWrap = document.querySelector<HTMLElement>('.learning-card__collapsable-wrap')!;
      expect(collapsableWrap.style.maxHeight).toBe('0px');

      await user.click(screen.getByText('Ich habe ein Auto'));
      expect(screen.getByText('У меня есть машина')).toBeInTheDocument();
      expect(screen.getByText('пример обладания')).toBeInTheDocument();
      expect(screen.getByText('haben')).toBeInTheDocument();
      expect(screen.getByText('A1')).toBeInTheDocument();
      expect(screen.getByText(/Verb/)).toBeInTheDocument();

      await user.click(screen.getByText('Ich habe ein Auto'));
      expect(collapsableWrap!.style.maxHeight).toBe('0px');
    });
  });

  describe('mode="direct"', () => {
    test('renders translation text initially', () => {
      setup({ mode: 'direct' });

      expect(screen.getByText('У меня есть машина')).toBeInTheDocument();
    });

    test('click reveals phrase text', async () => {
      const { user } = setup({ mode: 'direct' });

      await user.click(screen.getByText('У меня есть машина'));

      expect(screen.getByText('Ich habe ein Auto')).toBeInTheDocument();
    });
  });

  describe('mode="mixed"', () => {
    test('renders either phrase or translation as visible face', () => {
      const { rerender } = render(
        <LearningCard item={MOCK_ITEM} mode="mixed" />,
      );

      const header = screen.getByRole('button', { expanded: false });
      const hasPhrase = within(header).queryByText('Ich habe ein Auto');
      const hasTranslation = within(header).queryByText('У меня есть машина');

      expect(hasPhrase || hasTranslation).toBeTruthy();
      expect(hasPhrase && hasTranslation).toBeFalsy();

      rerender(<LearningCard item={MOCK_ITEM} mode="mixed" />);

      const hasPhrase2 = within(header).queryByText('Ich habe ein Auto');
      const hasTranslation2 = within(header).queryByText('У меня есть машина');

      expect(hasPhrase2 || hasTranslation2).toBeTruthy();
    });
  });

  test('does not render descriptions when absent', () => {
    render(<LearningCard item={MOCK_ITEM_NO_DESC} mode="reverse" />);

    expect(screen.queryByText('example of possession')).not.toBeInTheDocument();
  });

  test('keyboard Enter toggles expansion', async () => {
    const { user } = setup({ mode: 'reverse' });
    const header = screen.getByText('Ich habe ein Auto').closest('[role="button"]') as HTMLElement;

    header.focus();
    await user.keyboard('{Enter}');

    expect(screen.getByText('У меня есть машина')).toBeInTheDocument();
  });

  test('keyboard Space toggles expansion', async () => {
    const { user } = setup({ mode: 'reverse' });
    const header = screen.getByText('Ich habe ein Auto').closest('[role="button"]') as HTMLElement;

    header.focus();
    await user.keyboard(' ');

    expect(screen.getByText('У меня есть машина')).toBeInTheDocument();
  });

  test('renders Edit button', () => {
    setup();

    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});
