import { useCallback, useEffect, useState } from 'react';
import { Layout, Carousel } from 'antd';

import './App.scss';

import PhraseCard from './components/PhraseCard';
import { phrases } from './mocks/phrases';

export const App = () => {
  console.log('phrases', phrases);

  const [openCardId, setOpenCardId] = useState(null);
  const [activeSlideNumber, setActiveSlideNumber] = useState(0);

  const carouselChange = (_, slideIndex) => {
    setActiveSlideNumber(slideIndex);
  };

  const keyUpHandler = useCallback((e) => {
    if (e.keyCode === 40) {
      setOpenCardId(activeSlideNumber);
    }
  }, [activeSlideNumber]);

  useEffect(() => {
    window.addEventListener('keydown', keyUpHandler);
  }, [keyUpHandler]);

  return (
    <div className="app">
      <Layout className="app__wrap">
        <Carousel className="app__carousel" effect="fade" beforeChange={carouselChange}>
          {phrases.map((phrase) => (
            <div className="app__slide-wrap" key={phrase.id}>
              <PhraseCard cardData={phrase} openedCardId={openCardId} />
            </div>
          ))}
        </Carousel>
      </Layout>
    </div>
  );
}

export default App;
