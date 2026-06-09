import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { CarouselSlider, type CarouselSliderProps, type CarouselSliderHandle } from '../CarouselSlider';

const ITEMS = Array.from({ length: 5 }, (_, i) => ({ id: i, label: String(i) }));

function setup(overrides?: Partial<CarouselSliderProps<(typeof ITEMS)[number]>>) {
  const ref: { current: CarouselSliderHandle<(typeof ITEMS)[number]> | null } = { current: null };

  render(
    <CarouselSlider
      ref={ref}
      items={ITEMS}
      renderItem={(item) => <div data-testid={`slide-${item.id}`}>{item.label}</div>}
      {...overrides}
    />,
  );

  const user = userEvent.setup();

  return { ref, user };
}

describe('CarouselSlider', () => {
  test('renders first item as current', () => {
    const { ref } = setup();

    expect(ref.current?.activeIndex).toBe(0);
    expect(ref.current?.currentItem.id).toBe(0);
    expect(screen.getByTestId('slide-0')).toBeInTheDocument();
  });

  test('renders second item as next', () => {
    setup();

    expect(screen.getByTestId('slide-1')).toBeInTheDocument();
  });

  test('goToNext advances to next item', () => {
    const { ref } = setup();

    act(() => { ref.current?.goToNext(); });

    expect(ref.current?.activeIndex).toBe(1);
    expect(ref.current?.currentItem.id).toBe(1);
  });

  test('goToPrev goes to previous item', () => {
    const { ref } = setup();

    act(() => { ref.current?.goToNext(); });
    act(() => { ref.current?.goToPrev(); });

    expect(ref.current?.activeIndex).toBe(0);
  });

  test('goToNext loops when loop is default (true)', () => {
    const { ref } = setup();

    for (let i = 0; i < 5; i++) {
      act(() => { ref.current?.goToNext(); });
    }

    expect(ref.current?.activeIndex).toBe(0);
  });

  test('goToNext returns the new item', () => {
    const { ref } = setup();

    let result: (typeof ITEMS)[number] | undefined;
    act(() => { result = ref.current?.goToNext(); });

    expect(result?.id).toBe(1);
  });

  test('goToPrev returns the new item', () => {
    const { ref } = setup();

    act(() => { ref.current?.goToNext(); });
    let result: (typeof ITEMS)[number] | undefined;
    act(() => { result = ref.current?.goToPrev(); });

    expect(result?.id).toBe(0);
  });

  test('goToNext returns undefined at end when loop=false', () => {
    const { ref } = setup({ loop: false });

    for (let i = 0; i < 5; i++) {
      act(() => { ref.current?.goToNext(); });
    }

    let result: (typeof ITEMS)[number] | undefined;
    act(() => { result = ref.current?.goToNext(); });

    expect(result).toBeUndefined();
    expect(ref.current?.activeIndex).toBe(4);
  });

  test('goToPrev returns undefined at start when loop=false', () => {
    const { ref } = setup({ loop: false });

    let result: (typeof ITEMS)[number] | undefined;
    act(() => { result = ref.current?.goToPrev(); });

    expect(result).toBeUndefined();
    expect(ref.current?.activeIndex).toBe(0);
  });

  test('canGoNext is false at end when loop=false', () => {
    const { ref } = setup({ loop: false });

    for (let i = 0; i < 4; i++) {
      act(() => { ref.current?.goToNext(); });
    }

    expect(ref.current?.canGoNext).toBe(false);
  });

  test('canGoPrev is false at start when loop=false', () => {
    const { ref } = setup({ loop: false });

    expect(ref.current?.canGoPrev).toBe(false);
  });

  test('canGoNext is true at start when loop=false', () => {
    const { ref } = setup({ loop: false });

    expect(ref.current?.canGoNext).toBe(true);
  });

  test('canGoNext is true when loop=true (infinite)', () => {
    const { ref } = setup({ loop: true });

    for (let i = 0; i < 10; i++) {
      act(() => { ref.current?.goToNext(); });
    }

    expect(ref.current?.canGoNext).toBe(true);
  });

  test('goToNext calls onGoToNext with current and next items', () => {
    const onGoToNext = vi.fn();
    const { ref } = setup({ onGoToNext });

    act(() => { ref.current?.goToNext(); });

    expect(onGoToNext).toHaveBeenCalledWith(ITEMS[0], ITEMS[1]);
  });

  test('goToPrev calls onGoToPrev with current and prev items', () => {
    const onGoToPrev = vi.fn();
    const { ref } = setup({ onGoToPrev });

    act(() => { ref.current?.goToNext(); });
    act(() => { ref.current?.goToPrev(); });

    expect(onGoToPrev).toHaveBeenCalledWith(ITEMS[1], ITEMS[0]);
  });

  test('goToNext is no-op at end when loop=false, does not call onGoToNext', () => {
    const onGoToNext = vi.fn();
    const items = [{ id: 0, label: '0' }];
    const ref: { current: CarouselSliderHandle<{ id: number; label: string }> | null } = { current: null };

    render(
      <CarouselSlider
        ref={ref}
        items={items}
        loop={false}
        renderItem={(item) => <div>{item.label}</div>}
        onGoToNext={onGoToNext}
      />,
    );

    let result: { id: number; label: string } | undefined;
    act(() => { result = ref.current?.goToNext(); });

    expect(result).toBeUndefined();
    expect(onGoToNext).not.toHaveBeenCalled();
  });

  test('handle is stable when items is empty', () => {
    const ref: { current: CarouselSliderHandle<never> | null } = { current: null };

    render(
      <CarouselSlider
        ref={ref}
        items={[]}
        renderItem={() => <div />}
      />,
    );

    expect(ref.current?.activeIndex).toBe(0);
    act(() => { expect(ref.current?.goToNext()).toBeUndefined(); });
    act(() => { expect(ref.current?.goToPrev()).toBeUndefined(); });
    expect(ref.current?.canGoNext).toBe(false);
    expect(ref.current?.canGoPrev).toBe(false);
  });
});
