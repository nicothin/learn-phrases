import { useCallback, useRef, useEffect, useState } from 'react';
import { Button, Icon, ProgressBar } from '@shared/components';
import { useLearningSession } from '../../hooks/useLearningSession';
import { useLearningActions } from '../../hooks/useLearningActions';
import { useSessionStore } from '../../services/store/sessionStore';
import { CarouselSlider } from '../../components/CarouselSlider';
import type { CarouselSliderHandle } from '../../components/CarouselSlider';
import { LearningCard } from '../../components/LearningCard/LearningCard';
import type { LearningItem } from '../../types';

import './Learn.css';

const INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT']);

export function Learn() {
  const { sessionId, items, isLoading, refresh } = useLearningSession();
  const evaluatedMap = useSessionStore((s) => s.evaluatedMap);
  const markEvaluated = useSessionStore((s) => s.markEvaluated);
  const carouselRef = useRef<CarouselSliderHandle<LearningItem>>(null);
  const [prevSessionId, setPrevSessionId] = useState(sessionId);
  const [activeIndex, setActiveIndex] = useState(0);

  if (sessionId !== prevSessionId) {
    setPrevSessionId(sessionId);
    setActiveIndex(0);
  }

  const progressPercentage = items.length > 0
    ? ((activeIndex + 1) / items.length) * 100
    : 0;

  const handleNext = useCallback(() => {
    carouselRef.current?.goToNext();
  }, []);

  const handlePrev = useCallback(() => {
    carouselRef.current?.goToPrev();
  }, []);

  const currentItem = items[activeIndex] ?? null;
  const currentMeaningId = currentItem?.meaning.id;
  const isEvaluated = currentMeaningId ? currentMeaningId in evaluatedMap : false;
  const { handleCorrect, handleIncorrect } = useLearningActions(currentItem);

  const handleCorrectAction = useCallback(async () => {
    if (!currentMeaningId) return;
    await handleCorrect();
    markEvaluated(currentMeaningId, 'correct');
    carouselRef.current?.goToNext();
  }, [handleCorrect, markEvaluated, currentMeaningId]);

  const handleIncorrectAction = useCallback(async () => {
    if (!currentMeaningId) return;
    await handleIncorrect();
    markEvaluated(currentMeaningId, 'incorrect');
    carouselRef.current?.goToNext();
  }, [handleIncorrect, markEvaluated, currentMeaningId]);

  const handleIndexChange = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target instanceof HTMLElement ? e.target : null;
      if (target && INPUT_TAGS.has(target.tagName)) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        if (!isEvaluated) {
          handleCorrectAction();
        }
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        if (!isEvaluated) {
          handleIncorrectAction();
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        carouselRef.current?.goToNext();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        carouselRef.current?.goToPrev();
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const toggleBtn = document.querySelector<HTMLElement>(
          '.carousel-slider__slide--current [role="button"][aria-expanded="false"]'
        );
        toggleBtn?.click();
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        const toggleBtn = document.querySelector<HTMLElement>(
          '.carousel-slider__slide--current [role="button"][aria-expanded="true"]'
        );
        toggleBtn?.click();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleCorrectAction, handleIncorrectAction, isEvaluated]);

  const renderContent = useCallback(() => {
    if (isLoading) {
      return <p>Loading session...</p>;
    }

    if (items.length === 0) {
      return <p>No items to review</p>;
    }

    return (
      <>
        <CarouselSlider<LearningItem>
          key={sessionId}
          ref={carouselRef}
          className="learn__carousel"
          items={items}
          renderItem={(item) => (
            <LearningCard
              key={item.meaning.id}
              item={item}
              evaluation={evaluatedMap[item.meaning.id] ?? null}
            />
          )}
          onIndexChange={handleIndexChange}
        />
        <div className="learn__actions">
          <Button className="learn__actions-btn" variant="secondary" circle disabled={isEvaluated} onClick={handleIncorrectAction} aria-label="Не вспомнил">
            <Icon name="close" />
          </Button>
          <Button className="learn__actions-btn" variant="secondary" circle disabled={isEvaluated} onClick={handleCorrectAction} aria-label="Угадал">
            <Icon name="success" />
          </Button>
        </div>
        <div className="learn__nav">
          <Button className="learn__nav-btn" variant="secondary" circle onClick={handlePrev} aria-label="Предыдущий">
            <Icon name="arrow-l" />
          </Button>
          <Button className="learn__nav-btn" variant="secondary" circle onClick={handleNext} aria-label="Следующий">
            <Icon name="arrow-r" />
          </Button>
        </div>
      </>
    );
  }, [isLoading, items, sessionId, handlePrev, handleNext, handleIndexChange, handleCorrectAction, handleIncorrectAction, evaluatedMap,  isEvaluated]);

  return (
    <div className="learn">
      {items.length > 0 && (
        <ProgressBar
          className="learn__progress"
          percentage={progressPercentage}
        >
          {activeIndex + 1} / {items.length}
        </ProgressBar>
      )}
      <Button className="learn__refresh-btn" variant="secondary" circle onClick={refresh} aria-label="Обновить сессию">
        <Icon name="refresh" />
      </Button>
      {renderContent()}
    </div>
  );
}
