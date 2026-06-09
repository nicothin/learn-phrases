import {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
  type Ref,
} from 'react';

import './CarouselSlider.css';

export interface CarouselSliderProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  className?: string;
  onGoToNext?: (current: T, next: T | null) => void;
  onGoToPrev?: (current: T, next: T | null) => void;
  onIndexChange?: (index: number) => void;
  loop?: boolean;
}

export interface CarouselSliderHandle<T = unknown> {
  goToNext: () => T | undefined;
  goToPrev: () => T | undefined;
  readonly activeIndex: number;
  readonly canGoNext: boolean;
  readonly canGoPrev: boolean;
  readonly currentItem: T;
}

function CarouselSliderInner<T>(
  props: CarouselSliderProps<T>,
  ref: Ref<CarouselSliderHandle<T>>,
) {
  const {
    items,
    renderItem,
    className,
    onGoToNext,
    onGoToPrev,
    onIndexChange,
    loop = true,
  } = props;

  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const prevIndex = getPrevIndex(activeIndex, items.length, loop);
  const nextIndex = getNextIndex(activeIndex, items.length, loop);

  const currentItem = items[activeIndex] as T | undefined;
  const prevItem = prevIndex !== null ? items[prevIndex] : null;
  const nextItem = nextIndex !== null ? items[nextIndex] : null;

  const goToNext = useCallback(() => {
    const current = activeIndexRef.current;

    if (items.length === 0) return undefined;
    if (!loop && current >= items.length - 1) return undefined;

    const nextIndexResult = (current + 1) % items.length;
    const next = items[nextIndexResult];
    const currentItem = items[current];

    setActiveIndex(nextIndexResult);
    activeIndexRef.current = nextIndexResult;
    onGoToNext?.(currentItem as T, (next as T) ?? null);
    onIndexChange?.(nextIndexResult);

    return next as T;
  }, [items, loop, onGoToNext, onIndexChange]);

  const goToPrev = useCallback(() => {
    const current = activeIndexRef.current;

    if (items.length === 0) return undefined;
    if (!loop && current <= 0) return undefined;

    const prevIndexResult = (current - 1 + items.length) % items.length;
    const prev = items[prevIndexResult];
    const currentItem = items[current];

    setActiveIndex(prevIndexResult);
    activeIndexRef.current = prevIndexResult;
    onGoToPrev?.(currentItem as T, (prev as T) ?? null);
    onIndexChange?.(prevIndexResult);

    return prev as T;
  }, [items, loop, onGoToPrev, onIndexChange]);

  useImperativeHandle(
    ref,
    () => ({
      goToNext,
      goToPrev,
      get activeIndex() { return activeIndexRef.current; },
      get canGoNext() {
        if (items.length === 0) return false;
        return loop ? true : activeIndexRef.current < items.length - 1;
      },
      get canGoPrev() {
        if (items.length === 0) return false;
        return loop ? true : activeIndexRef.current > 0;
      },
      get currentItem() { return items[activeIndexRef.current] as T; },
    } as CarouselSliderHandle<T>),
    [goToNext, goToPrev, items, loop],
  );

  return (
    <div className={`carousel-slider${className ? ` ${className}` : ''}`}>
      <div key={`prev-${activeIndex}`} className="carousel-slider__slide carousel-slider__slide--prev">
        {prevItem !== null && renderItem(prevItem)}
      </div>
      <div key={`current-${activeIndex}`} className="carousel-slider__slide carousel-slider__slide--current">
        {currentItem !== undefined && renderItem(currentItem)}
      </div>
      <div key={`next-${activeIndex}`} className="carousel-slider__slide carousel-slider__slide--next">
        {nextItem !== null && renderItem(nextItem)}
      </div>
    </div>
  );
}

function getPrevIndex(
  activeIndex: number,
  length: number,
  loop: boolean,
): number | null {
  if (length === 0) return null;
  if (activeIndex === 0) return loop ? length - 1 : null;
  return activeIndex - 1;
}

function getNextIndex(
  activeIndex: number,
  length: number,
  loop: boolean,
): number | null {
  if (length === 0) return null;
  if (activeIndex >= length - 1) return loop ? 0 : null;
  return activeIndex + 1;
}

export const CarouselSlider = forwardRef(CarouselSliderInner) as <T>(
  props: CarouselSliderProps<T> & { ref?: Ref<CarouselSliderHandle<T>> },
) => ReactNode;
