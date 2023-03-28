import { useCallback, useEffect, useState, useRef } from 'react';
import { Layout, Carousel, Spin, FloatButton, Modal, Button } from 'antd';
import { LoadingOutlined, RightOutlined, DownOutlined, LeftOutlined, UpOutlined, InfoOutlined, PlusOutlined } from '@ant-design/icons';
import localforage from 'localforage';

import './App.scss';

import PhraseCard from './components/PhraseCard';
import { phrases as defaultPhrases } from './mocks/phrases';
import { shuffleArray } from './utils/shuffleArray';

export const App = () => {
  const carouselRef = useRef(null);
  const [isModalAboutOpen, setIsModalAboutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [phrases, setPhrases] = useState([]);
  const [openCardId, setOpenCardId] = useState(null);
  const [activeSlideId, setActiveSlideId] = useState(0);

  const carouselChange = (oldIndex, newIndex) => {
    setActiveSlideId(phrases[newIndex].id);
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
    localforage.config({ name: 'LearnPhrases' });
    async function fetchData() {
      try {
        const storagePhrases = await localforage.getItem('phrases');
        if (!storagePhrases?.length) {
          localforage.setItem('phrases', defaultPhrases);
          setPhrases(
            shuffleArray(defaultPhrases)
          );
        }
        else {
          setPhrases(storagePhrases);
          setPhrases(
            shuffleArray(storagePhrases)
          );
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
  }, [keyUpHandler]);

  // Определить первый ID
  useEffect(() => {
    if (!phrases.length) return;

    setActiveSlideId(phrases[0].id);
  }, [phrases]);

  return (
    <div className="app">
      {isLoading && <Spin indicator={<LoadingOutlined style={{ fontSize: 48, }} spin />} className="app__load" />}
      <Layout className="app__wrap">
        <Carousel
          ref={carouselRef}
          className="app__carousel"
          effect="fade"
          beforeChange={carouselChange}
          speed={200}
          accessibility={false}
        >
          {phrases.map((phrase) => (
            <div className="app__slide-wrap" key={phrase.id}>
              <PhraseCard cardData={phrase} openedCardId={openCardId} setOpenCardId={setOpenCardId} />
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
        icon={<RightOutlined />}
        onClick={() => carouselRef?.current?.next()}
      />
      <FloatButton
        shape="circle"
        style={{
          right: 92,
          bottom: 92,
        }}
        icon={<UpOutlined />}
        onClick={() => setOpenCardId(null)}
      />
      <FloatButton
        shape="circle"
        style={{
          right: 92,
          bottom: 32,
        }}
        icon={<DownOutlined />}
        onClick={() => setOpenCardId(activeSlideId)}
      />
      <FloatButton
        shape="circle"
        style={{
          right: 152,
          bottom: 32,
        }}
        icon={<LeftOutlined />}
        onClick={() => carouselRef?.current?.prev()}
      />

      <FloatButton
        shape="circle"
        style={{
          left: 34,
          bottom: 32,
        }}
        icon={<InfoOutlined />}
        onClick={() => setIsModalAboutOpen(true)}
      />

      <Modal
        open={isModalAboutOpen}
        title="О проекте Learn Phrases"
        footer={[
          <Button key="back" onClick={() => setIsModalAboutOpen(false)}>
            Закрыть
          </Button>,
        ]}
        onCancel={() => setIsModalAboutOpen(false)}
        centered
      >
        <p>Учите язык с markdown-ом и блэкджеком!</p>
        <p>Автор: <a href="https://nicothin.pro/" target="_blank" rel="noreferrer">Николай Громов</a>.</p>
        <p>Вдохновлено видеокурсом <a href="https://www.youtube.com/watch?v=BAahBqreWZw&list=PLD6SPjEPomasNzHuJpcS1Fxa2PYf1Bm-x&index=1" target="_blank" rel="noreferrer">Английский язык по плейлистам</a>. </p>
      </Modal>
    </div>
  );
}

export default App;
