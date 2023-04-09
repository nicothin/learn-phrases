import React, { useState } from 'react';
import { Button, Input, Popconfirm, Collapse, Typography, Form, Space, Rate } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';

import './PhraseEditCard.scss';

import { CreatePhraseType, Phrase } from '../../types';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Text } = Typography;

type PhraseEditCardProps = {
  phrase: Phrase;
  onEditPhraseFinish: (args: CreatePhraseType) => void;
  onDeletePhrase: (id: string) => void;
  onMyKnowledgeLvlChange: (phraseId: string, value: number) => void;
};

const PhraseEditCard = ({
  phrase,
  onEditPhraseFinish,
  onDeletePhrase,
  onMyKnowledgeLvlChange,
}: PhraseEditCardProps) => {
  const [openFirstPanel, setOpenFirstPanel] = useState(0);
  const [openSecondPanel, setOpenSecondPanel] = useState(0);

  const onFinish = (data: CreatePhraseType) => {
    setOpenFirstPanel(0);
    setOpenSecondPanel(0);
    onEditPhraseFinish({ id: phrase.id, ...data });
  };

  return (
    <div className="phrase-edit-card">
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
    </div>
  );
};

export default PhraseEditCard;
