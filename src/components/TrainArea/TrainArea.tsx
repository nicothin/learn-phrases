import { useState, useEffect, useCallback } from 'react';
import { Layout, FloatButton, Button, Progress } from 'antd';
import { gray } from '@ant-design/colors';
import {
  ArrowRightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';

import './TrainArea.scss';

import { Mode, Phrase } from '../../types';
import { db } from '../../db';
import { STORAGE_TABLE_NAME } from '../../enums/storage';
import PhraseCard from '../PhraseCard/PhraseCard';
import Loader from '../Loader/Loader';
import { shuffleArray } from '../../utils/shuffleArray';

type TrainAreaProps = {
  changeMode: (newMode: Mode) => void;
};

const TrainArea = ({ changeMode }: TrainAreaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shownPhraseIndex, setShownPhraseIndex] = useState<number>(0);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [commonProgress, setCommonProgress] = useState<number>(0);
  const [openCardId, setOpenCardId] = useState<number | undefined>();
  const [unknownPhrasesCounter, setUnknownPhrasesCounter] = useState<number>(0);

  const showNextPhrase = useCallback(() => {
    setShownPhraseIndex((prevShownPhraseIndex: number): number =>
      phrases[prevShownPhraseIndex + 1] ? prevShownPhraseIndex + 1 : 0,
    );
  }, [phrases]);

  const showPrewPhrase = useCallback(() => {
    setShownPhraseIndex((prevShownPhraseIndex: number): number =>
      phrases[prevShownPhraseIndex - 1] ? prevShownPhraseIndex - 1 : phrases.length - 1,
    );
  }, [phrases]);

  const openPhrase = useCallback(() => {
    setOpenCardId(phrases[shownPhraseIndex].id);
  }, [phrases, shownPhraseIndex]);

  const closePhrase = () => {
    setOpenCardId(undefined);
  };

  const changeMyKnownLevel = useCallback(
    (phrase: Phrase, iKnowIt: boolean) => {
      const change = async (thisPhrase: Phrase, iKnowThisPhrase: boolean) => {
        let newKnowledgeLvl = thisPhrase.myKnowledgeLvl;
        if (iKnowThisPhrase && thisPhrase.myKnowledgeLvl < 9) newKnowledgeLvl += 1;
        if (!iKnowThisPhrase && thisPhrase.myKnowledgeLvl > 1) newKnowledgeLvl -= 1;
        try {
          const newPhrase = { ...thisPhrase, myKnowledgeLvl: newKnowledgeLvl };
          await db.phrases.update(thisPhrase.id, newPhrase);
          const newPhrases = phrases.map((item) => (item.id === thisPhrase.id ? newPhrase : item));
          setPhrases(newPhrases);
        } catch (error) {
          console.error(error);
        }
        showNextPhrase();
      };
      change(phrase, iKnowIt);
    },
    [phrases, showNextPhrase],
  );

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') openPhrase();
      if (event.key === 'ArrowUp') closePhrase();
      if (event.key === 'ArrowRight') showNextPhrase();
      if (event.key === 'ArrowLeft') showPrewPhrase();
      if (event.key === 'Enter') changeMyKnownLevel(phrases[shownPhraseIndex], true);
      if (event.key === 'Escape') changeMyKnownLevel(phrases[shownPhraseIndex], false);
    },
    [changeMyKnownLevel, openPhrase, phrases, showNextPhrase, showPrewPhrase, shownPhraseIndex],
  );

  const getShufflePhrases = (list: Phrase[]): Phrase[] => {
    const learnedList: Phrase[] = [];
    const unlearnedList: Phrase[] = [];
    list?.forEach((phrase: Phrase) => {
      if (phrase.myKnowledgeLvl === 9) {
        learnedList.push(phrase);
        return;
      }
      unlearnedList.push(phrase);
    });
    return [
      ...(shuffleArray(unlearnedList) as Phrase[]),
      ...(shuffleArray(learnedList) as Phrase[]),
    ];
  };

  // Первоначально получить список фраз
  useEffect(() => {
    const getPhrases = async () => {
      try {
        const data = await db.table(STORAGE_TABLE_NAME).toArray();
        setPhrases(getShufflePhrases(data.reverse()));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getPhrases();
  }, []);

  // Навесить слушатели событий
  useEffect(() => {
    window.addEventListener('keydown', keyUpHandler);

    return () => window.removeEventListener('keydown', keyUpHandler);
  }, [keyUpHandler]);

  // Прогресс для невыученных фраз
  useEffect(() => {
    const counterUnknown = phrases?.filter((item) => item.myKnowledgeLvl < 9)?.length || 0;
    setUnknownPhrasesCounter(counterUnknown);
    const percent = (shownPhraseIndex * 100) / counterUnknown;
    setProgressPercent(percent <= 100 ? percent : 100);
  }, [phrases, shownPhraseIndex]);

  // Прогресс для всех фраз
  useEffect(() => {
    const counterUnknown = phrases?.length || 0;
    const percent = (shownPhraseIndex * 100) / counterUnknown;
    setCommonProgress(percent <= 100 ? percent : 100);
  }, [phrases, shownPhraseIndex]);

  return (
    <div className="train-area">
      {isLoading && <Loader />}

      <Layout className="train-area__wrap">
        {phrases?.length ? (
          <>
            <PhraseCard
              cardData={phrases[shownPhraseIndex]}
              openedCardId={openCardId}
              setOpenCardId={setOpenCardId}
              thisNumber={shownPhraseIndex + 1}
              counter={unknownPhrasesCounter}
              counterTotal={phrases?.length}
            />
            <FloatButton
              shape="circle"
              style={{
                right: 32,
                bottom: 32,
              }}
              icon={<ArrowRightOutlined />}
              onClick={showNextPhrase}
            />
            <FloatButton
              shape="circle"
              style={{
                right: 92,
                bottom: 92,
              }}
              icon={<ArrowUpOutlined />}
              onClick={() => setOpenCardId(undefined)}
            />
            <FloatButton
              shape="circle"
              style={{
                right: 92,
                bottom: 32,
              }}
              icon={<ArrowDownOutlined />}
              onClick={openPhrase}
            />
            <FloatButton
              shape="circle"
              style={{
                right: 152,
                bottom: 32,
              }}
              icon={<ArrowLeftOutlined />}
              onClick={showPrewPhrase}
            />

            <FloatButton
              shape="circle"
              style={{
                right: 152,
                bottom: 92,
              }}
              tooltip="Until I learned"
              icon={<CloseOutlined />}
              onClick={() => changeMyKnownLevel(phrases[shownPhraseIndex], false)}
            />
            <FloatButton
              shape="circle"
              style={{
                right: 32,
                bottom: 92,
              }}
              tooltip="Already learned"
              icon={<CheckOutlined />}
              onClick={() => changeMyKnownLevel(phrases[shownPhraseIndex], true)}
            />
          </>
        ) : (
          <p>
            No phrases.
            <Button type="link" onClick={() => changeMode('edit')}>
              Add or import some.
            </Button>
          </p>
        )}
      </Layout>

      <Progress
        className="train-area__progress"
        percent={progressPercent}
        // percent={(shownPhraseIndex * 100) / phrases.length}
        strokeLinecap="butt"
        strokeColor={gray[0]}
        showInfo={false}
        size="small"
      />
      <Progress
        className="train-area__common-progress"
        percent={commonProgress}
        // percent={(shownPhraseIndex * 100) / phrases.length}
        strokeLinecap="butt"
        strokeColor={gray[0]}
        showInfo={false}
        size="small"
      />
    </div>
  );
};

export default TrainArea;
