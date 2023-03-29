import { useEffect, useState } from 'react';
import { Layout, FloatButton, Modal, Button, Form, Input } from 'antd';
import { InfoOutlined, MenuUnfoldOutlined, EditOutlined, PlayCircleOutlined } from '@ant-design/icons';
import localforage from 'localforage';
import { nanoid } from 'nanoid'

import './App.scss';

import TrainArea from './components/TrainArea/TrainArea';

// const { TextArea } = Input;

const MODE = {
  EDIT: 'edit',
  LEARN: 'learn',
}

export const App = () => {
  // const [ form ] = Form.useForm();
  // const [ modal, contextHolder ] = Modal.useModal();
  const [isModalAboutOpen, setIsModalAboutOpen] = useState(false);
  const [mode, setMode] = useState(MODE.LEARN);

  return (
    <div className="app">

      {mode === MODE.LEARN && (
        <TrainArea />
      )}

      {mode === MODE.LEARN && (
        Фрасработкэ
      )}

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
        <p>Автор: <a href="https://nicothin.pro/" target="_blank" rel="noreferrer">Николай Громов</a>.</p>
        <p>Вдохновлено видеокурсом <a href="https://www.youtube.com/watch?v=BAahBqreWZw&list=PLD6SPjEPomasNzHuJpcS1Fxa2PYf1Bm-x&index=1" target="_blank" rel="noreferrer">Английский язык по плейлистам</a>. </p>
      </Modal>

      {/* <Modal
        open={isModalAddOpen}
        title="Добавить фразу"
        footer={[
          <Button key="back" onClick={() => setIsModalAddOpen(false)}>
            Закрыть
          </Button>,
          <Button key="add" type="primary" onClick={addPhraseConfirm}>
            Добавить
          </Button>,
        ]}
        onCancel={() => setIsModalAddOpen(false)}
        centered
      >
        <p>Использовать markdown можешь ты, Люк.</p>
        <Form form={form} layout="vertical" onFinish={(e) => { console.log(e) }}>
          <Form.Item label="Фраза по-русски" name="ru" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Любое пояснение к фразе" name="descr-ru">
            <TextArea rows={2} />
          </Form.Item>
          <Form.Item label="Фраза по-английски" name="en" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Любое пояснение к фразе" name="descr-en">
            <TextArea rows={2} />
          </Form.Item>
          {contextHolder}
        </Form>
      </Modal>

      <Modal
        open={isModalExportOpen}
        title="Экспорт фраз"
        footer={[
          <Button key="back" onClick={() => setIsModalExportOpen(false)}>
            Закрыть
          </Button>,
        ]}
        onCancel={() => setIsModalExportOpen(false)}
        centered
      >
        <TextArea rows={16} value={exportedStorageText} />
      </Modal> */}
    </div>
  );
}

export default App;
