import { useEffect, useRef, useState } from 'react';

import './PhraseCard.css';

import { Phrase, UserSettings } from '../../types';
import { MarkdownRenderer } from '../MarkdownRenderer/MarkdownRenderer';
import { Rating } from '../Rating/Rating';
import { TextToSpeechButton } from '../TextToSpeechButton/TextToSpeechButton';
import { useMainContext } from '../../hooks';

interface PhraseCardProps {
  phrase: Phrase;
  onEditPhrase?: (id: Phrase['id']) => void;
  openedCardId?: Phrase['id'];
}

const MAIN_USER_ID = 1;

export function PhraseCard({ phrase, onEditPhrase, openedCardId }: PhraseCardProps) {
  const { allSettings } = useMainContext();

  const [isOpenNow, setIsOpenNow] = useState(false);
  const [collapsableWrapMaxHeight, setCollapsableWrapMaxHeight] = useState('0px');
  const [speechSynthesisVoiceForSecondPhrase, setSpeechSynthesisVoiceForSecondPhrase] = useState('');

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
    const thisMainUserData: UserSettings | undefined = allSettings?.find(
      (item) => item.userId === MAIN_USER_ID,
    );
    setSpeechSynthesisVoiceForSecondPhrase(thisMainUserData?.speechSynthesisVoiceForSecondPhrase || '');
  }, [allSettings]);

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
            <TextToSpeechButton
              className="phrase-card__second-phrase-speech"
              text={phrase.second}
              voiceURI={speechSynthesisVoiceForSecondPhrase}
            />
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
