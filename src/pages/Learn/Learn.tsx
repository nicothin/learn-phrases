import { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import './Learn.css';
import '../../assets/btn-circle.css';

import { Phrase, UserSettings } from '../../types';
import { convertToKnowledgeLvl, shuffleArray } from '../../utils';
import { STATUS } from '../../enums';
import { useActionsContext, useNotificationContext, useArrayNavigator, useEditPhrase } from '../../hooks';
import { onSliderBeforeChange } from './utils/onSliderBeforeChange';
import { Carousel, CarouselRef } from '../../components/Carousel/Carousel';
import { PhraseCard } from '../../components/PhraseCard/PhraseCard';
import { Progress } from '../../components/Progress/Progress';
import { ImportFromGist } from '../../components/ImportFromGist/ImportFromGist';
import { ExportToGist } from '../../components/ExportToGist/ExportToGist';
import { NavLink } from 'react-router-dom';

const MAIN_USER_ID = 1;

export default function Learn() {
  const { allPhrases, addPhrases, allSettings, savePhrasesDTOToGist } = useActionsContext();
  const { addNotification } = useNotificationContext();
  const { editPhraseContent, isEditPhraseModalOpen, startEditingPhrase } = useEditPhrase();

  const carouselRef: MutableRefObject<CarouselRef | null> = useRef(null);

  const [learnedIDs, setLearnedIDs] = useState<Phrase['id'][]>([]);
  const [unlearnedIDs, setUnlearnedIDs] = useState<Phrase['id'][]>([]);
  const [phrasesIDs, setPhrasesIDs] = useState<Phrase['id'][]>([]);
  const [openedCardId, setOpenedCardId] = useState<Phrase['id'] | undefined>();
  const [thisUserSettings, setThisUserSettings] = useState<UserSettings | undefined>(undefined);
  const [isGoToNext, setIsGoToNext] = useState(false);

  const canTrySyncToGist = !!(thisUserSettings?.token && thisUserSettings?.gistId);

  const {
    prevIndex: prevPhraseIndex,
    nowIndex: nowPhraseIndex,
    nextIndex: nextPhraseIndex,
    goToNext: goToNextPhrase,
    goToPrev: goToPrevPhrase,
  } = useArrayNavigator(phrasesIDs);

  const {
    nowIndex: sliderNowIndex,
    goToNext: goToNextSlide,
    goToPrev: goToPrevSlide,
  } = useArrayNavigator([0, 1, 2]);

  const sliderData: Record<number, Record<number, Phrase['id']>> = useMemo(() => ({
    0: {
      0: phrasesIDs[nowPhraseIndex],
      1: phrasesIDs[prevPhraseIndex],
      2: phrasesIDs[nextPhraseIndex],
    },
    1: {
      0: phrasesIDs[nextPhraseIndex],
      1: phrasesIDs[nowPhraseIndex],
      2: phrasesIDs[prevPhraseIndex],
    },
    2: {
      0: phrasesIDs[prevPhraseIndex],
      1: phrasesIDs[nextPhraseIndex],
      2: phrasesIDs[nowPhraseIndex],
    },
  }), [phrasesIDs, prevPhraseIndex, nowPhraseIndex, nextPhraseIndex]);

  const onEditPhrase = (phraseID: Phrase['id']) => {
    startEditingPhrase(allPhrases.find((phrase) => phrase.id === phraseID) ?? {});
  };

  const getSlideContent = (slideNumber: number) => {
    const phraseID = sliderData[slideNumber][sliderNowIndex];
    const phrase = allPhrases.find((ph) => ph.id === phraseID);

    if (!phrase) return null;

    return (
      <PhraseCard
        key={phrase.id}
        phrase={phrase}
        openedCardId={openedCardId}
        onEditPhrase={onEditPhrase}
      />
    );
  };

  const changeMyKnownLevel = useCallback((isPlus: boolean) => {
    const phraseId = sliderData[1][1];
    const newPhrase = allPhrases.find((phrase) => phrase.id === phraseId);

    if (!newPhrase) {
      addNotification({
        text: `Something is wrong`,
        type: STATUS.ERROR,
        description: 'When trying to save a new level of learning a phrase, the phrase was not found by ID.',
      })
      return;
    }

    newPhrase.knowledgeLvl = convertToKnowledgeLvl(newPhrase.knowledgeLvl + (isPlus ? 1 : -1));

    addPhrases([newPhrase])
      .then(() => {
        carouselRef.current?.next();
        setOpenedCardId(undefined);
      })
      .catch((result) => addNotification(result));

    },
    [addNotification, addPhrases, allPhrases, sliderData],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') setOpenedCardId(phrasesIDs[nowPhraseIndex]);
      if (
        event.key === 'ArrowUp' ||
        event.key === 'ArrowRight' ||
        event.key === 'ArrowLeft'
      ) setOpenedCardId(undefined);
      if (event.key === 'ArrowRight') carouselRef.current?.next();
      if (event.key === 'ArrowLeft') carouselRef.current?.prev();
      if (event.key === 'Enter') changeMyKnownLevel(true);
      if (event.key === 'Escape') changeMyKnownLevel(false);
      if (event.code === 'KeyE') {
        event.preventDefault();
        const phraseId = sliderData[1][1];
        const phrase = allPhrases.find((phrase) => phrase.id === phraseId);
        if (!phrase) return;
        startEditingPhrase(phrase);
      };
    },
    [allPhrases, changeMyKnownLevel, startEditingPhrase, nowPhraseIndex, phrasesIDs, sliderData],
  );

  // Event listeners
  useEffect(() => {
    if (isEditPhraseModalOpen) return;

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isEditPhraseModalOpen, onKeyDown]);

  // setLearnedIDs & setUnlearnedIDs
  useEffect(() => {
    if (!allPhrases.length) {
      setLearnedIDs([]);
      setUnlearnedIDs([]);
      return;
    }

    const calculatedLearnedIDs: Set<Phrase['id']> = new Set();
    const calculatedUnlearnedIDs: Set<Phrase['id']> = new Set();

    allPhrases?.forEach((phrase) => {
      if (phrase.knowledgeLvl >= 9) {
        calculatedLearnedIDs.add(phrase.id);
        return;
      }
      calculatedUnlearnedIDs.add(phrase.id);
    });

    setLearnedIDs((prev) => {
      const newIDs: Set<Phrase['id']> = new Set();

      prev.forEach((prevId) => {
        if (calculatedUnlearnedIDs.has(prevId)) {
          newIDs.add(prevId);
        }
      });
      calculatedLearnedIDs.forEach((calculatedId) => newIDs.add(calculatedId));

      return !prev.length ? shuffleArray([...newIDs]) : [...newIDs];
    });

    setUnlearnedIDs((prev) => {
      const newIDs: Set<Phrase['id']> = new Set();

      prev.forEach((prevId) => {
        if (calculatedUnlearnedIDs.has(prevId)) {
          newIDs.add(prevId);
        }
      });
      calculatedUnlearnedIDs.forEach((calculatedId) => newIDs.add(calculatedId));

      return !prev.length ? shuffleArray([...newIDs]) : [...newIDs];
    });
  }, [allPhrases]);

  // setPhrasesIDs
  useEffect(() => setPhrasesIDs([...unlearnedIDs, ...learnedIDs]), [learnedIDs, unlearnedIDs]);

  // Set actual user settings
  useEffect(() => {
    const thisMainUserData: UserSettings | undefined = allSettings?.find(
      (item) => item.userId === MAIN_USER_ID
    );
    setThisUserSettings(thisMainUserData);
  }, [allSettings]);

  // Export phrases to gist if needed
  useEffect(() => {
    if (
      canTrySyncToGist &&
      isGoToNext &&
      nowPhraseIndex === unlearnedIDs.length &&
      thisUserSettings?.syncOn100percent
    ) {
      savePhrasesDTOToGist(MAIN_USER_ID)
        .then((result) => addNotification(result))
        .catch((result) => addNotification(result))
    }
  }, [
    addNotification,
    canTrySyncToGist,
    isGoToNext,
    nowPhraseIndex,
    savePhrasesDTOToGist,
    thisUserSettings,
    unlearnedIDs.length,
  ]);

  return phrasesIDs.length
    ? (
      <div className="learn">
        <Carousel
          ref={carouselRef}
          className="learn__carousel"
          beforeChange={(current, next) =>
            onSliderBeforeChange({
              current,
              next,
              onToNext: () => {
                goToNextPhrase();
                goToNextSlide();
                setIsGoToNext(true);
              },
              onToPrev: () => {
                goToPrevPhrase();
                goToPrevSlide();
                setIsGoToNext(false);
              },
            })
          }
        >
          <div className="learn__slide">{getSlideContent(0)}</div>
          <div className="learn__slide">{getSlideContent(1)}</div>
          <div className="learn__slide">{getSlideContent(2)}</div>
        </Carousel>

          <Progress
            className="learn__common-progress"
            percentage={(100 / phrasesIDs.length * Math.min(nowPhraseIndex, phrasesIDs.length)) || 0}
          >
            <small className="learn__common-progress-info">
              {Math.round((100 / phrasesIDs.length * Math.min(nowPhraseIndex, phrasesIDs.length)) * 10) / 10}%
              <br />
              {Math.min(nowPhraseIndex, phrasesIDs.length)} / {phrasesIDs.length}
            </small>
          </Progress>

        {!!unlearnedIDs.length && (
          <Progress
            className="learn__unlearned-progress"
            percentage={(100 / unlearnedIDs.length * Math.min(nowPhraseIndex, unlearnedIDs.length)) || 0}
          >
            <small className="learn__common-progress-info">
              {Math.round(
                (100 / unlearnedIDs.length * Math.min(nowPhraseIndex, unlearnedIDs.length)) * 10
              ) / 10}%
              <br />
              {Math.min(nowPhraseIndex, unlearnedIDs.length)} / {unlearnedIDs.length}
            </small>
          </Progress>
        )}

        <button
          className="learn__btn  btn-circle"
          style={{ right: '6em', bottom: '6em' }}
          onClick={() => changeMyKnownLevel(true)}
        >
          <svg width="18" height="18">
            <use xlinkHref="#success" />
          </svg>
        </button>

        <button
          className="learn__btn  btn-circle"
          style={{ right: '2em', bottom: '6em' }}
          onClick={() => changeMyKnownLevel(false)}
        >
          <svg width="18" height="18">
            <use xlinkHref="#error" />
          </svg>
        </button>

        <button
          className="learn__btn  btn-circle"
          style={{ right: '10em', bottom: '2em' }}
          onClick={() => carouselRef.current?.prev()}
        >
          <svg width="18" height="18">
            <use xlinkHref="#arrow-l" />
          </svg>
        </button>

        <button
          className="learn__btn  btn-circle"
          style={{ right: '6em', bottom: '2em' }}
          onClick={() => setOpenedCardId(phrasesIDs[nowPhraseIndex])}
        >
          <svg width="18" height="18">
            <use xlinkHref="#arrow-d" />
          </svg>
        </button>

        <button
          className="learn__btn  btn-circle"
          style={{ right: '2em', bottom: '2em' }}
          onClick={() => carouselRef.current?.next()}
        >
          <svg width="18" height="18">
            <use xlinkHref="#arrow-r" />
          </svg>
        </button>

        {canTrySyncToGist && (
          <ImportFromGist
            className="learn__btn  btn-circle"
            classNameLoading="btn-circle--loading"
            style={{ right: '2em', bottom: '18em' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <use xlinkHref="#download" />
            </svg>
          </ImportFromGist>
        )}

        {canTrySyncToGist && (
          <ExportToGist
            className="learn__btn  btn-circle"
            classNameLoading="btn-circle--loading"
            style={{ right: '2em', bottom: '14em' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <use xlinkHref="#upload" />
            </svg>
          </ExportToGist>
        )}

        {editPhraseContent}
      </div>
    )
    : (
      <div className="learn">
        <p className="learn__empty">
          <span>
            There are no phrases here yet.
            Go to <NavLink to="/admin">the admin section</NavLink> and add a few.
          </span>
        </p>
      </div>
    );
}
