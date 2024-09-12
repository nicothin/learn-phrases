import { useEffect, useRef, useState } from 'react';

import './PhraseCard.css';

import { Phrase } from '../../types';
import { REPLACEMENTS } from '../../constants';
import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer';
import { Rating } from '../Rating/Rating';
import { VoiceButton } from '../VoiceButton/VoiceButton';

interface PhraseCardProps {
  phrase: Phrase;
  onEditPhrase?: (id: Phrase['id']) => void;
  openedCardId?: Phrase['id'];
}

export function PhraseCard(data: PhraseCardProps) {
  const { phrase, onEditPhrase, openedCardId } = data;

  const [isOpenNow, setIsOpenNow] = useState(false);
  const [secondPhraseAsText, setSecondPhraseAsText] = useState('');
  const [collapsableWrapMaxHeight, setCollapsableWrapMaxHeight] = useState('0px');

  const collapsableWrapRef = useRef<HTMLDivElement>(null);
  const collapsableRef = useRef<HTMLDivElement>(null);

  const onToggle = () => {
    setIsOpenNow(!isOpenNow);
  };

  useEffect(() => {
    setIsOpenNow(openedCardId === phrase.id);
  }, [openedCardId, phrase.id]);

  useEffect(() => {
    if (isOpenNow) {
      setCollapsableWrapMaxHeight(`${collapsableRef.current?.scrollHeight}px`);
    } else {
      setCollapsableWrapMaxHeight('0px');
    }
  }, [phrase, isOpenNow]);

  useEffect(() => {
    const newSecondPhrsae = REPLACEMENTS.reduce((acc, { search }) => {
      return acc.replace(search, '$1');
    }, phrase.second);
    setSecondPhraseAsText(newSecondPhrsae);
  }, [phrase]);

  return (
    <div className={`phrase-card ${isOpenNow ? 'phrase-card--open' : ''}`}>
      <div className="phrase-card__main" onClick={() => onToggle()} role="button">
        <div className="phrase-card__main-text-wrap">
          <MarkdownRenderer>{phrase.first}</MarkdownRenderer>
        </div>
        {phrase.firstD && (
          <div className="phrase-card__description-text-wrap  text-secondary">
            <MarkdownRenderer>{phrase.firstD}</MarkdownRenderer>
          </div>
        )}
      </div>

      <div
        className="phrase-card__collapsable-wrap"
        ref={collapsableWrapRef}
        style={{ maxHeight: collapsableWrapMaxHeight }}
      >
        <div className="phrase-card__collapsable" ref={collapsableRef}>
          <div className="phrase-card__main-text-wrap">
            <MarkdownRenderer>{phrase.second}</MarkdownRenderer>

            <VoiceButton text={secondPhraseAsText} className="phrase-card__second-phrase-voice" />
          </div>

          {phrase.secondD && (
            <div className="phrase-card__description-text-wrap  text-secondary">
              <MarkdownRenderer>{phrase.secondD}</MarkdownRenderer>
            </div>
          )}

          <Rating className="phrase-card__memo-rating" level={phrase?.knowledgeLvl} />
        </div>
      </div>

      <p className="phrase-card__bottom-info">
        <span className="text-secondary">ID: {phrase.id}.</span>
        <button type="button" className="btn  btn--text  btn--xs" onClick={() => onEditPhrase?.(phrase.id)}>
          Edit
        </button>
      </p>
    </div>
  );
}
