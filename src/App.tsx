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
  const [mode, setMode] = useState<Mode>('learn');

  const onChangeMode = (newMode: Mode) => {
    setMode(newMode);
  };

  return (
    <div className="app">
      {mode === 'learn' && <TrainArea changeMode={onChangeMode} />}
      {mode === 'edit' && <EditArea />}

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
          tooltip="About"
        />
        {mode !== 'edit' && (
          <FloatButton
            icon={<EditOutlined />}
            onClick={() => {
              setMode('edit');
            }}
            tooltip="Edit phrases"
          />
        )}
        {mode !== 'learn' && (
          <FloatButton
            icon={<PlayCircleOutlined />}
            onClick={() => {
              setMode('learn');
            }}
            tooltip="Learn phrases"
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
        <p>Useful resources:</p>
        <ul>
          <li>
            <Link
              href="https://context.reverso.net/%D0%BF%D0%B5%D1%80%D0%B5%D0%B2%D0%BE%D0%B4/%D0%B0%D0%BD%D0%B3%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9/"
              target="_blank"
            >
              context.reverso.net
            </Link>
          </li>
          <li>
            <Link
              href="https://www.babla.ru/%D0%B0%D0%BD%D0%B3%D0%BB%D0%B8%D0%B9%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D1%83%D1%81%D1%81%D0%BA%D0%B8%D0%B9/"
              target="_blank"
            >
              babla.ru
            </Link>
          </li>
          <li>
            <Link href="https://myefe.ru/anglijskaya-transkriptsiya.html" target="_blank">
              myefe.ru
            </Link>
          </li>
        </ul>
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
