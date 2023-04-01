import { useState } from 'react';
import { FloatButton, Modal, Button, } from 'antd';
import { InfoOutlined, MenuUnfoldOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import localforage from 'localforage';

import './App.scss';

import TrainArea from './components/TrainArea/TrainArea';
import EditArea from './components/EditArea/EditArea';
import { STORAGE_NAME } from './enums/storage';
import { MODE } from './enums/mode';

export const App = () => {
  localforage.config({ name: STORAGE_NAME });

  const [isModalAboutOpen, setIsModalAboutOpen] = useState(false);
  const [mode, setMode] = useState(MODE.LEARN);

  return (
    <div className="app">

      {mode === MODE.LEARN && <TrainArea />}
      {mode === MODE.EDIT && <EditArea />}

      <FloatButton.Group
        trigger="hover"
        style={{
          left: 34,
          bottom: 32,
        }}
        icon={<MenuUnfoldOutlined />}
      >
        <FloatButton
          icon={<InfoOutlined />}
          onClick={() => setIsModalAboutOpen(true)}
          tooltip="О проекте"
        />
        {mode !== MODE.EDIT && (
          <FloatButton
            icon={<EditOutlined />}
            onClick={() => { setMode(MODE.EDIT) }}
            tooltip="Редактировать фразы"
          />
        )}
        {mode !== MODE.LEARN && (
          <FloatButton
            icon={<PlayCircleOutlined />}
            onClick={() => { setMode(MODE.LEARN) }}
            tooltip="Учить фразы"
          />
        )}
      </FloatButton.Group>

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
        <p>Учи язык с markdown-ом и блэкджеком!</p>
        <p>Осторожно: данные сохраняются в браузере, никакого обмена данными с сервером нет.</p>
        <p>Автор: <a href="https://nicothin.pro/" target="_blank" rel="noreferrer">Николай Громов</a>.</p>
        <p>Вдохновлено видеокурсом <a href="https://www.youtube.com/watch?v=BAahBqreWZw&list=PLD6SPjEPomasNzHuJpcS1Fxa2PYf1Bm-x&index=1" target="_blank" rel="noreferrer">Английский язык по плейлистам</a>. </p>
      </Modal>
    </div>
  );
}

export default App;