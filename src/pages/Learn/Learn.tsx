import { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';
import { Carousel, FloatButton, message, Modal, notification, Progress } from 'antd';
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
import { useSettingsContext } from '../../hooks';
import { Phrase, Phrases } from '../../types';
import {
  convertToKnowledgeLvl,
  getFloatButtonPositionStyle,
  onSliderBeforeChange,
} from '../../utils';
import useArrayNavigator from '../../hooks/useArrayNavigator';
import PhraseCard from '../../components/PhraseCard/PhraseCard';
import ImportFromGistFloatButton from '../../components/ImportFromGistFloatButton/ImportFromGistFloatButton';
import ExportToGistFloatButton from '../../components/ExportToGistFloatButton/ExportToGistFloatButton';

export default function Learn() {
  const [modalApi, contextModal] = Modal.useModal();
  const [messageApi, contextMessage] = message.useMessage();
  const [notificationApi, contextNotification] = notification.useNotification();

  const [phrases, setPhrases] = useState<Phrases>([]);
  const [shuffledPhraseIDs, setShuffledPhraseIDs] = useState<Set<number>>(new Set());
  const [phrasesMapFromDexie, setPhrasesMapFromDexie] = useState<Map<number, Phrase>>(new Map());
  const [unlearnedPhrasesCounter, setUnlearnedPhrasesCounter] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);

  const { token, gistId } = useSettingsContext();

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
    nowIndex: nowPrasesIndex,
    next: goToNextPhrase,
    prev: goToPrevPhrase,
    getNow: getNowPhrase,
    getNext: getNextPhrase,
    getPrev: getPrevPhrase,
  } = useArrayNavigator(phrases);

  const {
    nowIndex: sliderNowIndex,
    next: goToNextSlide,
    prev: goToPrevSlide,
  } = useArrayNavigator([0, 1, 2]);

  const changeMyKnownLevel = useCallback(
    (phrase?: Phrase, isPlus?: boolean) => {
      if (!phrase) return;

      const newPhrase = {
        ...phrase,
        knowledgeLvl: convertToKnowledgeLvl(phrase.knowledgeLvl + (isPlus ? 1 : -1)),
      };

      savePhraseLocally(newPhrase)
        .then(() => {
          carouselRef.current?.next();
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: 'error',
            content: 'Phrase update error!',
            duration: 10,
          });
        });
    },
    [messageApi],
  );

  const onPhrasesCarouselKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') setOpenedCardId(getNowPhrase()?.id);
      if (event.key === 'ArrowUp' || event.key === 'ArrowRight' || event.key === 'ArrowLeft')
        setOpenedCardId(undefined);
      if (event.key === 'ArrowRight') carouselRef.current?.next();
      if (event.key === 'ArrowLeft') carouselRef.current?.prev();
      if (event.key === 'Enter') changeMyKnownLevel(getNowPhrase(), true);
      if (event.key === 'Escape') changeMyKnownLevel(getNowPhrase(), false);
    },
    [changeMyKnownLevel, getNowPhrase],
  );

  const getSlideContent = (slideNumber: number) => {
    const cardData: Record<number, Record<number, Phrase | undefined>> = {
      0: {
        0: getNowPhrase(),
        1: getPrevPhrase(),
        2: getNextPhrase(),
      },
      1: {
        0: getNextPhrase(),
        1: getNowPhrase(),
        2: getPrevPhrase(),
      },
      2: {
        0: getPrevPhrase(),
        1: getNextPhrase(),
        2: getNowPhrase(),
      },
    };

    const phrase = cardData[slideNumber][sliderNowIndex];

    return (
      <PhraseCard cardData={phrase} activeKey={openedCardId} setOpenedCardId={setOpenedCardId} />
    );
  };

  // Get shuffled IDs & Make phrases list with shuffle
  useEffect(() => {
    if (!phrasesMapFromDexie.size) {
      setShuffledPhraseIDs(new Set());
      return;
    }

    const newShuffledPhraseIDs: Set<number> = new Set();

    // shuffledPhraseIDs has been calculated before
    if (shuffledPhraseIDs.size) {
      if (shuffledPhraseIDs.size > phrasesMapFromDexie.size) {
        shuffledPhraseIDs.forEach((item) => {
          if (phrasesMapFromDexie.get(item)) newShuffledPhraseIDs.add(item);
        });
        setShuffledPhraseIDs(newShuffledPhraseIDs);
      } else if (shuffledPhraseIDs.size < phrasesMapFromDexie.size) {
        shuffledPhraseIDs.forEach((item) => {
          newShuffledPhraseIDs.add(item);
        });
        phrasesMapFromDexie.forEach((item) => item.id);
        setShuffledPhraseIDs(newShuffledPhraseIDs);
      } else {
        shuffledPhraseIDs.forEach((item) => {
          newShuffledPhraseIDs.add(item);
        });
      }
    }

    // shuffledPhraseIDs has NOT been calculated before
    else {
      const learnedList: number[] = [];
      const unlearnedList: number[] = [];
      phrasesMapFromDexie?.forEach((phrase) => {
        if (phrase.knowledgeLvl >= 9) {
          learnedList.push(phrase.id);
          return;
        }
        unlearnedList.push(phrase.id);
      });

      // TODO add shuffle! shuffleArray()

      unlearnedList.forEach((item) => {
        newShuffledPhraseIDs.add(item);
      });
      learnedList.forEach((item) => {
        newShuffledPhraseIDs.add(item);
      });

      setShuffledPhraseIDs(newShuffledPhraseIDs);
    }

    const newPhrases: Phrases = [];
    newShuffledPhraseIDs.forEach((id) => {
      const phrase = phrasesMapFromDexie?.get(id);
      if (phrase) {
        newPhrases.push(phrase);
      }
    });

    setPhrases(newPhrases);
  }, [phrasesMapFromDexie, shuffledPhraseIDs]);

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
  }, [nowPrasesIndex, unlearnedPhrasesCounter]);

  // Event listeners
  useEffect(() => {
    window.addEventListener('keydown', onPhrasesCarouselKeyDown);

    return () => {
      window.removeEventListener('keydown', onPhrasesCarouselKeyDown);
    };
  }, [onPhrasesCarouselKeyDown]);

  // Show or hide SYNC button
  useEffect(() => {
    setCanSynchronized(!!token?.trim() && !!gistId?.trim());
  }, [gistId, token]);

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
            },
            onToPrev: () => {
              goToPrevPhrase();
              goToPrevSlide();
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
        onClick={() => setOpenedCardId(getNowPhrase()?.id)}
      />
      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle([2, 0])}
        icon={<ArrowLeftOutlined />}
        onClick={() => carouselRef.current?.prev()}
      />
      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle([0, 1])}
        // tooltip="I don't now it"
        icon={<CloseOutlined />}
        onClick={() => changeMyKnownLevel(getNowPhrase(), false)}
      />
      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle([1, 1])}
        // tooltip="I now it"
        icon={<CheckOutlined />}
        onClick={() => changeMyKnownLevel(getNowPhrase(), true)}
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
        className="lp-learn-page__progress"
        percent={progressPercent}
        strokeLinecap="butt"
        showInfo={false}
        size="small"
      />

      {contextMessage}
      {contextNotification}
      {contextModal}
    </div>
  );
}
