import { useState, useEffect, useRef, useCallback } from 'react';
import { Layout, Carousel, Spin, FloatButton } from 'antd';
import { LoadingOutlined, ArrowRightOutlined, ArrowUpOutlined, ArrowDownOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import localforage from 'localforage';

import './TrainArea.scss';

import { phrases as defaultPhrases } from '../../mocks/phrases';
import PhraseCard from '../PhraseCard/PhraseCard';
import { shuffleArray } from '../../utils/shuffleArray';
import { STORAGE_NAME } from '../../enums/storage';

const TrainArea = () => {
  localforage.config({ name: STORAGE_NAME });

  const carouselRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [phrases, setPhrases] = useState([]);
  const [activeSlideId, setActiveSlideId] = useState(0);
  const [openCardId, setOpenCardId] = useState(null);

  const carouselChange = (_, newIndex) => {
    setActiveSlideId(phrases[newIndex]?.id);
  };

  const keyUpHandler = useCallback((e) => {
    if (e.keyCode === 40) {
      setOpenCardId(activeSlideId);
    }
    if (e.keyCode === 38) {
      setOpenCardId(null);
    }
    if (e.keyCode === 39) {
      carouselRef?.current?.next();
    }
    if (e.keyCode === 37) {
      carouselRef?.current?.prev();
    }
  }, [activeSlideId]);

  // Получить фразы из локального хранилища
  useEffect(() => {
    async function fetchData() {
      try {
        const storagePhrases = await localforage.getItem('phrases');
        if (!storagePhrases?.length) {
          localforage.setItem('phrases', defaultPhrases);
          setPhrases(
            shuffleArray(structuredClone(defaultPhrases))
          );
        }
        else {
          setPhrases(storagePhrases);
        }
        setIsLoading(false);
      } catch (err) {
        console.log('localforage error', err);
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
              <PhraseCard cardData={phrase} openedCardId={openCardId} setOpenCardId={setOpenCardId} thisNumber={i} counter={phrases.length} />
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
        onClick={() => setOpenCardId(null)}
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
    </div>
  );
}

export default TrainArea;
