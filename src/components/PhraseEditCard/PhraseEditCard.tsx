import React from 'react';
import { Button, Input, Popconfirm, Typography, Form, Space, Rate, Card, notification } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

import './PhraseEditCard.scss';

import { Phrase } from '../../types';
import { db } from '../../db';
import { openNotification } from '../../utils/openNotification';

const { TextArea } = Input;
const { Text } = Typography;

type PhraseEditCardProps = {
  phrase: Phrase;
};

const PhraseEditCard = ({ phrase }: PhraseEditCardProps) => {
  const [showNotification, contextNotificationHolder] = notification.useNotification();

  const onEditPhraseFinish = async (data: Phrase) => {
    try {
      const newItem = {
        id: data.id,
        first: data.first,
        second: data.second,
        firstD: data.firstD,
        secondD: data.secondD,
        myKnowledgeLvl: phrase.myKnowledgeLvl,
      };
      await db.phrases.update(phrase.id, newItem);
      openNotification(showNotification, 'success', 'Phrase updated');
    } catch (error) {
      console.error(error);
      openNotification(showNotification, 'error', 'Phrase not updated');
    }
  };

  const onDeletePhrase = async (id: number) => {
    try {
      await db.phrases.delete(id);
      openNotification(showNotification, 'success', 'Phrase deleted');
    } catch (error) {
      console.error(error);
      openNotification(showNotification, 'error', 'Phrase not deleted');
    }
  };

  const onMyKnowledgeLvlChange = async (id: number, value: number) => {
    if (value < 1 || value > 9) {
      openNotification(showNotification, 'error', 'Phrase not updated');
      return;
    }

    if (value === phrase.myKnowledgeLvl) {
      openNotification(
        showNotification,
        'info',
        'Phrase not updated: The level of knowledge has not changed.',
      );
      return;
    }

    try {
      await db.phrases.update(id, {
        myKnowledgeLvl: value,
      });
      openNotification(showNotification, 'success', 'Phrase updated');
    } catch (error) {
      console.error(error);
      openNotification(showNotification, 'error', 'Phrase not updated');
    }
  };

  return (
    <Card className="phrase-edit-card" size="small">
      <Form
        initialValues={{
          first: phrase.first,
          second: phrase.second,
          firstD: phrase.firstD,
          secondD: phrase.secondD,
        }}
        onFinish={(data) => onEditPhraseFinish({ id: phrase.id, ...data })}
        autoComplete="off"
      >
        <Form.Item name="first" rules={[{ required: true, message: 'Please input phrase.' }]}>
          <Input placeholder="First language" />
        </Form.Item>
        <Form.Item name="firstD">
          <TextArea placeholder="Description" autoSize />
        </Form.Item>
        <Form.Item name="second" rules={[{ required: true, message: 'Please input phrase.' }]}>
          <Input placeholder="Second language" />
        </Form.Item>
        <Form.Item name="secondD">
          <TextArea placeholder="Description" autoSize />
        </Form.Item>

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
                Save It
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
