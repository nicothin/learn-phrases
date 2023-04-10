import { useState, useEffect, useRef, useCallback } from 'react';
import { Layout, Carousel, Spin, FloatButton, notification, Button } from 'antd';
import {
  LoadingOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { CarouselRef } from 'antd/es/carousel';
import { useLiveQuery } from 'dexie-react-hooks';

import './TrainArea.scss';

import { Mode, Phrase } from '../../types';
import { db } from '../../db';
import { STORAGE_TABLE_NAME } from '../../enums/storage';
import PhraseCard from '../PhraseCard/PhraseCard';
import { shuffleArray } from '../../utils/shuffleArray';
import { getKnowledgeFilteredPhrases } from '../../utils/getKnowledgeFilteredPhrases';
import { openNotification } from '../../utils/openNotification';

type TrainAreaProps = {
  changeMode: (newMode: Mode) => void;
};

const TrainArea = ({ changeMode }: TrainAreaProps) => {
  const carouselRef = useRef<CarouselRef | null>(null);

  const [phrases, setPhrases] = useState<Phrase[]>(
    useLiveQuery(() => db[STORAGE_TABLE_NAME].toArray()) || [],
  );
  const [activeSlideId, setActiveSlideId] = useState<string>('0');
  const [openCardId, setOpenCardId] = useState<string | undefined>();

  const [showNotification, contextNotificationHolder] = notification.useNotification();

  async function addFriend(name, age) {
    try {
      // Add the new friend!
      // const id = await db.friends.add({
      //   name,
      //   age,
      // });
      const id1 = await db.phrases.add({
        id: '123ddf',
        first: 'qwert',
        second: 'asdfg',
        // firstD: '',
        // secondD: '',
        myKnowledgeLvl: 1,
      });
      console.log(`Friend ${name} successfully added. Got id ${id1}`);
    } catch (error) {
      console.error(error);
    }
  }

  const shufflePhrases = () => {
    const filteredPhrases = structuredClone(getKnowledgeFilteredPhrases(phrases));
    if (!filteredPhrases.length) return;
    setPhrases(shuffleArray(filteredPhrases));
  };

  const carouselChange = (_: number, newIndex: number) => {
    setActiveSlideId(phrases[newIndex]?.id);
  };

  const keyUpHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        setOpenCardId(activeSlideId);
      }
      if (event.key === 'ArrowUp') {
        setOpenCardId(undefined);
      }
      if (event.key === 'ArrowRight') {
        carouselRef?.current?.next();
      }
      if (event.key === 'ArrowLeft') {
        carouselRef?.current?.prev();
      }
    },
    [activeSlideId],
  );

  // Навесить слушатели событий
  useEffect(() => {
    window.addEventListener('keydown', keyUpHandler);

    return () => window.removeEventListener('keydown', keyUpHandler);
  }, [keyUpHandler]);

  // Определить первый ID
  useEffect(() => {
    if (!phrases?.length) return;

    setActiveSlideId(phrases[0].id);
  }, [phrases]);

  return (
    <div className="train-area">
      {/* <button
        type="button"
        onClick={() => {
          addFriend('TEST', 87);
        }}
      >
        Add
      </button> */}

      <Layout className="train-area__wrap">
        <Carousel
          ref={carouselRef}
          className="train-area__carousel"
          effect="fade"
          beforeChange={carouselChange}
          speed={200}
          accessibility={false}
          dots={false}
        >
          {!phrases.length && (
            <div className="train-area__slide-wrap">
              <p>
                No phrases.
                <Button type="link" onClick={() => changeMode('edit')}>
                  Add or import some.
                </Button>
              </p>
            </div>
          )}

          {phrases?.map((phrase, i) => (
            <div className="train-area__slide-wrap" key={phrase.id}>
              <PhraseCard
                cardData={phrase}
                openedCardId={openCardId}
                setOpenCardId={setOpenCardId}
                thisNumber={i}
                counter={phrases.length}
              />
            </div>
          ))}
        </Carousel>
      </Layout>

      {!!phrases.length && (
        <>
          <FloatButton
            shape="circle"
            style={{
              right: 32,
              bottom: 32,
            }}
            icon={<ArrowRightOutlined />}
            onClick={() => carouselRef?.current?.next()}
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
            onClick={() => setOpenCardId(activeSlideId)}
          />
          <FloatButton
            shape="circle"
            style={{
              right: 152,
              bottom: 32,
            }}
            icon={<ArrowLeftOutlined />}
            onClick={() => carouselRef?.current?.prev()}
          />
          <FloatButton
            shape="circle"
            style={{
              right: 212,
              bottom: 32,
            }}
            icon={<ReloadOutlined />}
            onClick={shufflePhrases}
          />
        </>
      )}

      {contextNotificationHolder}
    </div>
  );
};

export default TrainArea;
