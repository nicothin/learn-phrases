import { useRef, useState, useImperativeHandle, forwardRef, ReactNode, useCallback, Children } from 'react';

import './Carousel.css';

interface CarouselProps {
  className?: string;
  children: ReactNode[];
  beforeChange?: (current: number, next: number) => void;
}

export interface CarouselRef {
  next: () => void;
  prev: () => void;
}

export const Carousel = forwardRef<CarouselRef, CarouselProps>(
  ({ className = '', children, beforeChange }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const slideCount = children.length;

    useImperativeHandle(ref, () => ({
      next() {
        goToSlide(currentIndex + 1);
      },
      prev() {
        goToSlide(currentIndex - 1);
      },
    }));

    const goToSlide = useCallback(
      (index: number) => {
        const nextIndex = (index + slideCount) % slideCount;
        beforeChange?.(currentIndex, nextIndex);
        setCurrentIndex(nextIndex);
      },
      [beforeChange, currentIndex, slideCount],
    );

    return (
      <div className={`carousel ${className}`} ref={containerRef}>
        <div className="carousel__slides">
          {Children.map(children, (child, index) => (
            <div
              className={`carousel__slide ${index === currentIndex ? 'carousel__slide--active' : ''}`}
              key={index}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  },
);
