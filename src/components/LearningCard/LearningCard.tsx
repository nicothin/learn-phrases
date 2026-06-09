import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Icon, MarkdownRenderer, Rating, Tag } from '@shared/components';
import { useUIStore } from '../../services/store/uiStore';
import { POS_LABELS } from '../../constants';
import type { LearningItem } from '../../types';

import './LearningCard.css';

export type LearningCardMode = 'direct' | 'reverse' | 'mixed';

interface LearningCardProps {
  item: LearningItem;
  mode?: LearningCardMode;
  evaluation?: 'correct' | 'incorrect' | null;
}

export function LearningCard({ item, mode = 'direct', evaluation }: LearningCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [collapsableMaxHeight, setCollapsableMaxHeight] = useState('0px');
  const setEditableMeaning = useUIStore((s) => s.setEditableMeaning);
  const setEditablePhrase = useUIStore((s) => s.setEditablePhrase);

  const collapsableRef = useRef<HTMLDivElement>(null);

  const [mixedRoll] = useState(() => Math.random());
  const isDirectFlow = mode === 'direct' || (mode === 'mixed' && mixedRoll < 0.5);

  const visibleFace = isDirectFlow
    ? { text: item.phrase.translation, description: item.phrase.translationDescription }
    : { text: item.phrase.text, description: item.phrase.textDescription };

  const hiddenFace = isDirectFlow
    ? { text: item.phrase.text, description: item.phrase.textDescription }
    : { text: item.phrase.translation, description: item.phrase.translationDescription };

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isExpanded) {
      setCollapsableMaxHeight(`${collapsableRef.current?.scrollHeight}px`);
    } else {
      setCollapsableMaxHeight('0px');
    }
  }, [item, isExpanded]);

  const handleMeaningClick = useCallback(() => {
    setEditableMeaning(item.meaning);
  }, [item.meaning, setEditableMeaning]);

  const isBlocked = item.meaning.knowledgeLvl >= 8;
  const isEvaluated = evaluation !== null;

  const evaluationIcon = evaluation === 'correct' ? 'success' : 'close';
  const evaluationTitle = evaluation === 'correct' ? 'Remembered' : 'Not remembered';

  const handleEditClick = useCallback(() => {
    if (isBlocked) return;
    setEditablePhrase(item.phrase);
  }, [item.phrase, setEditablePhrase, isBlocked]);

  return (
    <div className={`learning-card-wrapper${isEvaluated ? ' learning-card-wrapper--evaluated' : ''}`}>
      {isEvaluated && (
        <span className="learning-card__evaluation-badge" title={evaluationTitle}>
          <Icon name={evaluationIcon} width={16} height={16} />
        </span>
      )}
      <div className={`learning-card${isBlocked ? ' learning-card--blocked' : ''}`}>
        <div
          className="learning-card__header"
          onClick={toggleExpand}
          role="button"
          tabIndex={0}
          aria-expanded={isExpanded}
        >
          <div className="learning-card__text">
            <MarkdownRenderer>{visibleFace.text}</MarkdownRenderer>
          </div>
          {visibleFace.description && (
            <div className="learning-card__description">
              <MarkdownRenderer>{visibleFace.description}</MarkdownRenderer>
            </div>
          )}
        </div>

        <div
          className="learning-card__collapsable-wrap"
          style={{ maxHeight: collapsableMaxHeight }}
        >
          <div className="learning-card__collapsable" ref={collapsableRef}>
            <div className="learning-card__body">
              <div className="learning-card__text">
                <MarkdownRenderer>{hiddenFace.text}</MarkdownRenderer>
              </div>
              {hiddenFace.description && (
                <div className="learning-card__description">
                  <MarkdownRenderer>{hiddenFace.description}</MarkdownRenderer>
                </div>
              )}

              <div className="learning-card__details">
                <span className="learning-card__sense">
                  <Button variant="text-link" onClick={handleMeaningClick}>{item.meaning.lemma}</Button> <span className="learning-card__pos">({POS_LABELS[item.meaning.pos]})</span> — {item.meaning.translation}
                </span>
                <Tag className="learning-card__level" data-cefr={item.meaning.cefrLevel}>{item.meaning.cefrLevel}</Tag>
              </div>
              {item.meaning.description && (
                <div className="learning-card__meaning-description">
                  <MarkdownRenderer>{item.meaning.description}</MarkdownRenderer>
                </div>
              )}
              <Rating className="learning-card__knowledge-level" level={item.meaning.knowledgeLvl} maxLevel={8} />
            </div>
          </div>
        </div>
      </div>

      <Button
        className="learning-card__edit-btn"
        variant="text-link"
        onClick={handleEditClick}
      >
        Edit
      </Button>
    </div>
  );
}
