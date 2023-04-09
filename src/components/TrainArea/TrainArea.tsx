import { useState, useEffect, useRef, useCallback } from 'react';
import { Layout, Carousel, Spin, FloatButton, notification } from 'antd';
import {
  LoadingOutlined,
  ArrowRightOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { CarouselRef } from 'antd/es/carousel';
import localforage from 'localforage';

import './TrainArea.scss';

import { phrases as defaultPhrases } from '../../mocks/phrases';
import PhraseCard from '../PhraseCard/PhraseCard';
import { shuffleArray } from '../../utils/shuffleArray';
import { STORAGE_NAME, STORAGE_PHRASES_NAME } from '../../enums/storage';
import { getKnowledgeFilteredPhrases } from '../../utils/getKnowledgeFilteredPhrases';
import { NotificationType, Phrase } from '../../types';

const TrainArea = () => {
  localforage.config({ name: STORAGE_NAME });

  const carouselRef = useRef<CarouselRef | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [activeSlideId, setActiveSlideId] = useState<string>('0');
  const [openCardId, setOpenCardId] = useState<string | undefined>();

  const [showNotification, contextHolder] = notification.useNotification();

  const openNotification = useCallback((type: NotificationType = 'info', message: string, description?: string) => {
    if (!message && !description) return;

    showNotification[type]({
      message,
      description,
    });
  }, [showNotification]);

  const shufflePhrases = () => {
    const filteredPhrases = structuredClone(getKnowledgeFilteredPhrases(phrases));
    if (!filteredPhrases.length) return;
    setPhrases(
      shuffleArray(filteredPhrases)
    );
  };

  const carouselChange = (_: number, newIndex: number) => {
    setActiveSlideId(phrases[newIndex]?.id);
  };

  const keyUpHandler = useCallback((event: KeyboardEvent) => {
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
  }, [activeSlideId]);

  // Получить фразы из локального хранилища
  useEffect(() => {
    async function fetchData() {
      try {
        const storagePhrases: Phrase[] = await localforage.getItem(STORAGE_PHRASES_NAME) || [];
        if (!storagePhrases?.length) {
          localforage.setItem(STORAGE_PHRASES_NAME, defaultPhrases);
          setPhrases(
            getKnowledgeFilteredPhrases(defaultPhrases)
          );
        }
        else {
          setPhrases(
            structuredClone(
              getKnowledgeFilteredPhrases(storagePhrases)
            )
          );
        }
        setIsLoading(false);
      } catch (error) {
        openNotification('error', 'Localforage error');
        console.log('Localforage error', error);
      }
    }

    fetchData();
  }, []);

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
      {isLoading && <Spin indicator={<LoadingOutlined style={{ fontSize: 48, }} spin />} className="train-area__load" />}

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
    </div>
  );
}

export default TrainArea;
