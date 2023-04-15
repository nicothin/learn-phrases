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
  ReloadOutlined,
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

type PhraseGroupsType = Record<number, Phrase[]>;

const TrainArea = ({ changeMode }: TrainAreaProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [shownPhraseIndex, setShownPhraseIndex] = useState<number>(0);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [openCardId, setOpenCardId] = useState<number | undefined>();

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

  const getShufflePhrases = (list: Phrase[]) => {
    const result = [];
    const phraseGroups: PhraseGroupsType = {};
    list?.forEach((phrase: Phrase) => {
      // NOTE[@nicothin]: исключаем выученные
      if (phrase.myKnowledgeLvl > 8) return;
      if (!phraseGroups[phrase.myKnowledgeLvl]) phraseGroups[phrase.myKnowledgeLvl] = [];
      phraseGroups[phrase.myKnowledgeLvl].push({ ...phrase });
    });
    for (let i = 1; i < 10; i += 1) {
      if (phraseGroups[i]) {
        result.push(shuffleArray(phraseGroups[i]));
      }
    }
    return result.flat() as Phrase[];
  };

  const shufflePhrases = async () => {
    const newPhrases = getShufflePhrases(phrases);
    setPhrases(newPhrases);
  };

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
              icon={<CloseOutlined />}
              onClick={() => changeMyKnownLevel(phrases[shownPhraseIndex], false)}
            />
            <FloatButton
              shape="circle"
              style={{
                right: 32,
                bottom: 92,
              }}
              icon={<CheckOutlined />}
              onClick={() => changeMyKnownLevel(phrases[shownPhraseIndex], true)}
            />

            <FloatButton
              shape="circle"
              style={{
                right: 212,
                bottom: 32,
              }}
              tooltip="Перемешать фразы и расставить по изученности"
              icon={<ReloadOutlined />}
              onClick={shufflePhrases}
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
        percent={(shownPhraseIndex * 100) / phrases.length}
        strokeLinecap="butt"
        strokeColor={gray[0]}
        showInfo={false}
      />
    </div>
  );
};

export default TrainArea;
