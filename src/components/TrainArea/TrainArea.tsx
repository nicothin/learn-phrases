import { useState, useEffect, useCallback } from 'react';
import { Layout, FloatButton, Button } from 'antd';
import {
  ArrowRightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';

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
  const dbPhrases: Phrase[] | undefined = useLiveQuery(() =>
    db[STORAGE_TABLE_NAME].orderBy('id').reverse().toArray(),
  );

  const [isLoading, setIsLoading] = useState(true);
  const [shownPhraseIndex, setShownPhraseIndex] = useState<number>(0);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [openCardId, setOpenCardId] = useState<number | undefined>();

  useEffect(() => {
    if (dbPhrases?.length) {
      setIsLoading(false);

      const result = [];
      const phraseGroups: PhraseGroupsType = {};
      dbPhrases.forEach((phrase: Phrase) => {
        if (!phraseGroups[phrase.myKnowledgeLvl]) phraseGroups[phrase.myKnowledgeLvl] = [];
        phraseGroups[phrase.myKnowledgeLvl].push(phrase);
      });
      for (let i = 1; i < 10; i += 1) {
        if (phraseGroups[i]) {
          result.push(shuffleArray(phraseGroups[i]));
        }
      }
      setPhrases(result.flat() as Phrase[]);
    }
  }, [dbPhrases]);

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

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') openPhrase();
      if (event.key === 'ArrowUp') closePhrase();
      if (event.key === 'ArrowRight') showNextPhrase();
      if (event.key === 'ArrowLeft') showPrewPhrase();
    },
    [openPhrase, showNextPhrase, showPrewPhrase],
  );

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
              thisNumber={shownPhraseIndex + 1}
              counter={phrases?.length}
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
    </div>
  );
};

export default TrainArea;
