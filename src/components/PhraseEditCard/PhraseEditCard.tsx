import React, { useState } from 'react';
import {
  Button,
  Input,
  Popconfirm,
  Collapse,
  Typography,
  Form,
  Space,
  Rate,
  Card,
  notification,
} from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import localforage from 'localforage';

import './PhraseEditCard.scss';

import { CreatePhraseType, Phrase } from '../../types';
import { createItem } from '../../utils/createItem';
import { openNotification } from '../../utils/openNotification';
import { STORAGE_NAME, STORAGE_PHRASES_NAME } from '../../enums/storage';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Text } = Typography;

type PhraseEditCardProps = {
  phrase: Phrase;
};

const PhraseEditCard = ({ phrase }: PhraseEditCardProps) => {
  localforage.config({ name: STORAGE_NAME });

  const [openFirstPanel, setOpenFirstPanel] = useState(0);
  const [openSecondPanel, setOpenSecondPanel] = useState(0);

  const [showNotification, contextNotificationHolder] = notification.useNotification();

  const onEditPhraseFinish = async (data: CreatePhraseType) => {
    try {
      const newItem = createItem({
        id: data.id,
        first: data.first,
        second: data.second,
        firstD: data.firstD,
        secondD: data.secondD,
      });
      const storagePhrases: Phrase[] = (await localforage.getItem(STORAGE_PHRASES_NAME)) || [];
      const newPhrases = storagePhrases.map((item: Phrase) =>
        item.id === data.id ? newItem : item,
      );
      await localforage.setItem(STORAGE_PHRASES_NAME, newPhrases);
      openNotification(showNotification, 'success', 'Phrase updated');
    } catch (error) {
      console.error(error);
      openNotification(showNotification, 'error', 'Phrase not updated');
    }
  };

  const onDeletePhrase = async (id: string) => {
    try {
      const storagePhrases: Phrase[] = (await localforage.getItem(STORAGE_PHRASES_NAME)) || [];
      const newPhrases = storagePhrases.filter((item) => item.id !== id);
      await localforage.setItem(STORAGE_PHRASES_NAME, newPhrases);
      openNotification(showNotification, 'success', 'Phrase deleted');
    } catch (error) {
      console.error(error);
      openNotification(showNotification, 'error', 'Phrase not deleted');
    }
  };

  const onMyKnowledgeLvlChange = async (id: string, value: number) => {
    if (value === 0) return;

    try {
      const storagePhrases: Phrase[] = (await localforage.getItem(STORAGE_PHRASES_NAME)) || [];
      const newPhrases = storagePhrases.map((item) =>
        item.id === id ? { ...item, myKnowledgeLvl: Number(value) } : item,
      );
      await localforage.setItem(STORAGE_PHRASES_NAME, newPhrases);
      openNotification(showNotification, 'success', 'Phrase updated');
    } catch (error) {
      console.error(error);
      openNotification(showNotification, 'error', 'Phrase not updated');
    }
  };

  const onFinish = (data: CreatePhraseType) => {
    setOpenFirstPanel(0);
    setOpenSecondPanel(0);
    onEditPhraseFinish({ id: phrase.id, ...data });
  };

  return (
    <Card className="phrase-edit-card" size="small">
      <Form
        initialValues={{
          first: phrase.languages.first.content,
          second: phrase.languages.second.content,
          firstD: phrase.languages.first.descr,
          secondD: phrase.languages.second.descr,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Collapse
          expandIconPosition="end"
          collapsible="icon"
          size="small"
          activeKey={openFirstPanel}
          onChange={() => setOpenFirstPanel(openFirstPanel === 0 ? 1 : 0)}
          ghost
        >
          <Panel
            header={
              <Form.Item name="first" rules={[{ required: true, message: 'Please input phrase.' }]}>
                <Input placeholder="First language" />
              </Form.Item>
            }
            key={1}
          >
            <Form.Item name="firstD">
              <TextArea rows={2} placeholder="Description" />
            </Form.Item>
          </Panel>
        </Collapse>
        <Collapse
          expandIconPosition="end"
          collapsible="icon"
          size="small"
          activeKey={openSecondPanel}
          onChange={() => setOpenSecondPanel(openSecondPanel === 0 ? 1 : 0)}
          ghost
        >
          <Panel
            header={
              <Form.Item
                name="second"
                rules={[{ required: true, message: 'Please input phrase.' }]}
              >
                <Input placeholder="Second language" />
              </Form.Item>
            }
            key={1}
          >
            <Form.Item name="secondD">
              <TextArea rows={2} placeholder="Description" />
            </Form.Item>
          </Panel>
        </Collapse>

        <Rate
          character={<CheckCircleOutlined />}
          count={9}
          defaultValue={phrase.myKnowledgeLvl}
          onChange={(value) => onMyKnowledgeLvlChange(phrase.id, value)}
          allowClear={false}
        />

        <div className="phrase-edit-card__footer">
          <div className="phrase-edit-card__id">
            <Text type="secondary">ID: {phrase.id}</Text>
          </div>
          <div className="phrase-edit-card__action">
            <Space wrap>
              <Button size="small" htmlType="submit">
                Save
              </Button>
              <Popconfirm
                title="Are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => onDeletePhrase(phrase.id)}
              >
                <Button size="small" danger>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          </div>
        </div>
      </Form>

      {contextNotificationHolder}
    </Card>
  );
};

export default PhraseEditCard;
