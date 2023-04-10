import { useState } from 'react';
import { FloatButton, Modal, Button, Typography } from 'antd';
import {
  InfoOutlined,
  MenuUnfoldOutlined,
  EditOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';

import TrainArea from './components/TrainArea/TrainArea';
import EditArea from './components/EditArea/EditArea';
import { Mode } from './types';

const { Link } = Typography;

export const App = () => {
  const [isModalAboutOpen, setIsModalAboutOpen] = useState(false);
  const [mode, setMode] = useState<Mode>('edit');

  const onChangeMode = (newMode: Mode) => {
    setMode(newMode);
  };

  return (
    <div className="app">
      {mode === 'learn' && <TrainArea changeMode={onChangeMode} />}
      {mode === 'edit' && <EditArea changeMode={onChangeMode} />}

      <FloatButton.Group
        trigger="hover"
        style={{
          left: 34,
          bottom: 32,
          zIndex: 1000,
        }}
        icon={<MenuUnfoldOutlined />}
      >
        <FloatButton
          icon={<InfoOutlined />}
          onClick={() => setIsModalAboutOpen(true)}
          tooltip="О проекте"
        />
        {mode !== 'edit' && (
          <FloatButton
            icon={<EditOutlined />}
            onClick={() => {
              setMode('edit');
            }}
            tooltip="Редактировать фразы"
          />
        )}
        {mode !== 'learn' && (
          <FloatButton
            icon={<PlayCircleOutlined />}
            onClick={() => {
              setMode('learn');
            }}
            tooltip="Учить фразы"
          />
        )}
      </FloatButton.Group>

      <Modal
        open={isModalAboutOpen}
        title="About Learn Phrases"
        footer={[
          <Button key="back" onClick={() => setIsModalAboutOpen(false)}>
            Close
          </Button>,
        ]}
        onCancel={() => setIsModalAboutOpen(false)}
        centered
      >
        <p>Learn a language with markdown and blackjack!</p>
        <p>
          Caution: the data is stored in the browser, there is no data exchange with the server.
        </p>
        <p>
          Author:{' '}
          <Link href="https://nicothin.pro/" target="_blank">
            Nikolay Gromov
          </Link>
          .
        </p>
        <p>
          Inspired by the video course{' '}
          <a
            href="https://www.youtube.com/watch?v=BAahBqreWZw&list=PLD6SPjEPomasNzHuJpcS1Fxa2PYf1Bm-x&index=1"
            target="_blank"
            rel="noreferrer"
          >
            English by playlists
          </a>
          .{' '}
        </p>
      </Modal>
    </div>
  );
};

export default App;
