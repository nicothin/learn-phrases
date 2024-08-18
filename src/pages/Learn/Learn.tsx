import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Carousel, FloatButton, Progress } from 'antd';
import { CarouselRef } from 'antd/es/carousel';
import {
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';

import './Learn.css';

import { DEXIE_TABLE_NAME } from '../../constants';
import { DexieIndexedDB } from '../../services/DexieIndexedDB';
import { Gist } from '../../services/Gist';
import { savePhraseLocally } from '../../services/actions';
import {
  useSettingsContext,
  useStateContext,
  useExportToGistWhen100Percent,
  useArrayNavigator,
  useOverlayContext,
} from '../../hooks';
import { Phrase, Phrases } from '../../types';
import {
  convertToKnowledgeLvl,
  getFloatButtonPositionStyle,
  onSliderBeforeChange,
  shuffleSet,
} from '../../utils';
import PhraseCard from '../../components/PhraseCard/PhraseCard';
import ImportFromGistFloatButton from '../../components/ImportFromGistFloatButton/ImportFromGistFloatButton';
import ExportToGistFloatButton from '../../components/ExportToGistFloatButton/ExportToGistFloatButton';
import EditPhraseModal from '../../components/EditPhraseModal/EditPhraseModal';

export default function Learn() {
  const { notificationApi, modalApi, messageApi } = useOverlayContext();

  const [phrases, setPhrases] = useState<Phrases>([]);
  const [learnedIDs, setLearnedIDs] = useState<Set<number>>(new Set());
  const [unlearnedIDs, setUnlearnedIDs] = useState<Set<number>>(new Set());
  const [isNeedToShuffle, setIsNeedToShuffle] = useState(true);
  const [phrasesMapFromDexie, setPhrasesMapFromDexie] = useState<Map<number, Phrase>>(new Map());
  const [unlearnedPhrasesCounter, setUnlearnedPhrasesCounter] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [commonProgressPercent, setCommonProgressPercent] = useState(0);
  const [editedPhraseData, setEditedPhraseData] = useState<Partial<Phrase> | null>(null);
  const [isGoToNext, setIsGoToNext] = useState(false);

  const { token, gistId } = useSettingsContext();
  const { isPhraseEditModalOpen } = useStateContext();

  const gist = Gist.getInstance({ token, gistId });

  const carouselRef: MutableRefObject<CarouselRef | null> = useRef(null);

  const [openedCardId, setOpenedCardId] = useState<number | undefined>(undefined);
  const [canSynchronized, setCanSynchronized] = useState(false);

  useLiveQuery(() => {
    DexieIndexedDB[DEXIE_TABLE_NAME].orderBy('id')
      .toArray()
      .then((array) => {
        const tupleArray: [number, Phrase][] = array.map((phrase) => [phrase.id, phrase]);
        setPhrasesMapFromDexie(new Map(tupleArray));
      });
  }, []);

  const {
    prevIndex: prevPhraseIndex,
    nowIndex: nowPrasesIndex,
    nextIndex: nextPhraseIndex,
    goToNext: goToNextPhrase,
    goToPrev: goToPrevPhrase,
  } = useArrayNavigator(phrases);

  const {
    nowIndex: sliderNowIndex,
    goToNext: goToNextSlide,
    goToPrev: goToPrevSlide,
  } = useArrayNavigator([0, 1, 2]);

  const changeMyKnownLevel = useCallback(
    (phrase?: Phrase, isPlus?: boolean) => {
      if (!phrase) return;

      const newKnoledgeLvl = convertToKnowledgeLvl(phrase.knowledgeLvl + (isPlus ? 1 : -1));

      const newPhrase = {
        ...phrase,
        knowledgeLvl: newKnoledgeLvl,
      };

      savePhraseLocally(newPhrase)
        .then(() => {
          if (newKnoledgeLvl < 9) {
            carouselRef.current?.next();
          }
        })
        .catch((error) => {
          console.error(error);
          messageApi.open({
            type: 'error',
            content: 'Phrase update error!',
            duration: 10,
          });
        });
    },
    [messageApi],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') setOpenedCardId(phrases[nowPrasesIndex]?.id);
      if (event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'ArrowLeft')
        setOpenedCardId(undefined);
      if (event.key === 'ArrowRight') carouselRef.current?.next();
      if (event.key === 'ArrowLeft') carouselRef.current?.prev();
      if (event.key === 'Enter') changeMyKnownLevel(phrases[nowPrasesIndex], true);
      if (event.key === 'Escape') changeMyKnownLevel(phrases[nowPrasesIndex], false);
    },
    [changeMyKnownLevel, nowPrasesIndex, phrases],
  );

  const onEditPhrase = (phrase: Phrase) => {
    setEditedPhraseData(phrase);
  };

  const getSlideContent = (slideNumber: number) => {
    const cardData: Record<number, Record<number, Phrase | undefined>> = {
      0: {
        0: phrases[nowPrasesIndex],
        1: phrases[prevPhraseIndex],
        2: phrases[nextPhraseIndex],
      },
      1: {
        0: phrases[nextPhraseIndex],
        1: phrases[nowPrasesIndex],
        2: phrases[prevPhraseIndex],
      },
      2: {
        0: phrases[prevPhraseIndex],
        1: phrases[nextPhraseIndex],
        2: phrases[nowPrasesIndex],
      },
    };

    const phrase = cardData[slideNumber][sliderNowIndex];

    return (
      <PhraseCard
        cardData={phrase}
        activeKey={openedCardId}
        setOpenedCardId={setOpenedCardId}
        onEditPhrase={onEditPhrase}
      />
    );
  };

  // setLearnedIDs & setUnlearnedIDs
  useEffect(() => {
    if (!phrasesMapFromDexie.size) {
      setLearnedIDs(new Set());
      setUnlearnedIDs(new Set());
      return;
    }

    const calculatedLearnedIDs: Set<number> = new Set();
    const calculatedUnlearnedIDs: Set<number> = new Set();

    phrasesMapFromDexie?.forEach((phrase) => {
      if (phrase.knowledgeLvl >= 9) {
        calculatedLearnedIDs.add(phrase.id);
        return;
      }
      calculatedUnlearnedIDs.add(phrase.id);
    });

    setLearnedIDs((prev) => {
      const newIDs: Set<number> = new Set();
      prev.forEach((id) => {
        if (calculatedLearnedIDs.has(id)) newIDs.add(id);
      });
      calculatedLearnedIDs.forEach((id) => newIDs.add(id));
      return isNeedToShuffle ? shuffleSet(newIDs) : newIDs;
    });

    setUnlearnedIDs((prev) => {
      const newIDs: Set<number> = new Set();
      prev.forEach((id) => {
        if (calculatedUnlearnedIDs.has(id)) newIDs.add(id);
      });
      calculatedUnlearnedIDs.forEach((id) => newIDs.add(id));
      return isNeedToShuffle ? shuffleSet(newIDs) : newIDs;
    });

    setIsNeedToShuffle(false);
  }, [isNeedToShuffle, phrasesMapFromDexie]);

  // setPhrases
  useEffect(() => {
    const newPhrases: Phrases = [];

    unlearnedIDs.forEach((id) => {
      const thisPhrase = phrasesMapFromDexie.get(id);
      if (thisPhrase) {
        newPhrases.push(thisPhrase);
      }
    });
    learnedIDs.forEach((id) => {
      const thisPhrase = phrasesMapFromDexie.get(id);
      if (thisPhrase) {
        newPhrases.push(thisPhrase);
      }
    });

    setPhrases(newPhrases);
  }, [learnedIDs, phrasesMapFromDexie, unlearnedIDs]);

  // Set UnlearnedPhrasesCounter
  useEffect(() => {
    const unlearnedList: number[] = [];
    phrasesMapFromDexie?.forEach((phrase) => {
      if (phrase.knowledgeLvl < 9) {
        unlearnedList.push(phrase.id);
      }
    });
    setUnlearnedPhrasesCounter(unlearnedList.length);
  }, [phrasesMapFromDexie]);

  // Calculate progress
  useEffect(() => {
    const nowUnlearnPrasesIndex =
      nowPrasesIndex >= unlearnedPhrasesCounter ? unlearnedPhrasesCounter : nowPrasesIndex;
    const percent = (nowUnlearnPrasesIndex * 100) / unlearnedPhrasesCounter;
    setProgressPercent(percent);
    setCommonProgressPercent((nowPrasesIndex * 100) / phrases.length);
  }, [nowPrasesIndex, phrases.length, unlearnedPhrasesCounter]);

  // Event listeners
  useEffect(() => {
    if (isPhraseEditModalOpen) return;

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isPhraseEditModalOpen, onKeyDown]);

  // Show or hide SYNC button
  useEffect(() => {
    setCanSynchronized(!!token?.trim() && !!gistId?.trim());
  }, [gistId, token]);

  // To SYNC or not to SYNC now?
  useExportToGistWhen100Percent({
    isGoToNext,
    unlearnedIDs,
    learnedIDs,
    phrases,
    prevPhraseIndex,
    nowPrasesIndex,
    nextPhraseIndex,
    notificationApi,
  });

  return (
    <div className="lp-learn-page">
      <Carousel
        ref={carouselRef}
        className="lp-learn-page__carousel"
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
        dots={false}
        speed={100}
        waitForAnimate
      >
        <div className="lp-learn-page__slide">{getSlideContent(0)}</div>
        <div className="lp-learn-page__slide">{getSlideContent(1)}</div>
        <div className="lp-learn-page__slide">{getSlideContent(2)}</div>
      </Carousel>

      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle([0, 0])}
        icon={<ArrowRightOutlined />}
        onClick={() => carouselRef.current?.next()}
      />
      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle([1, 0])}
        icon={<ArrowDownOutlined />}
        onClick={() => setOpenedCardId(phrases[nowPrasesIndex]?.id)}
      />
      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle([2, 0])}
        icon={<ArrowLeftOutlined />}
        onClick={() => carouselRef.current?.prev()}
      />
      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle([1, 1])}
        icon={<CloseOutlined />}
        onClick={() => changeMyKnownLevel(phrases[nowPrasesIndex], false)}
      />
      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle([0, 1])}
        icon={<CheckOutlined />}
        onClick={() => changeMyKnownLevel(phrases[nowPrasesIndex], true)}
      />

      {canSynchronized && (
        <>
          <ImportFromGistFloatButton
            buttonPosition={getFloatButtonPositionStyle([0, 0], { isTop: true })}
            gist={gist}
            notificationApi={notificationApi}
            modalApi={modalApi}
          />
          <ExportToGistFloatButton
            buttonPosition={getFloatButtonPositionStyle([1, 0], { isTop: true })}
            gist={gist}
            notificationApi={notificationApi}
          />
        </>
      )}

      <Progress
        className="lp-learn-page__common-progress"
        percent={commonProgressPercent}
        format={(percent) => (
          <>
            {percent?.toFixed(1)}%<br />
            {nowPrasesIndex}/{phrases.length}
          </>
        )}
        strokeLinecap="butt"
        size="small"
      />
      <Progress
        className="lp-learn-page__progress"
        percent={progressPercent}
        strokeLinecap="butt"
        format={(percent) => (
          <>
            {percent?.toFixed(1)}%
            <br />
            {nowPrasesIndex >= unlearnedPhrasesCounter ? unlearnedPhrasesCounter : nowPrasesIndex}/
            {unlearnedPhrasesCounter}
          </>
        )}
        size="small"
      />

      {editedPhraseData && (
        <EditPhraseModal
          editedPhraseData={editedPhraseData}
          setEditedPhraseData={setEditedPhraseData}
          notificationApi={notificationApi}
        />
      )}
    </div>
  );
}
