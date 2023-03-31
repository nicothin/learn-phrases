import React, { useState } from 'react';
import { Button, Input, Popconfirm, Collapse, Typography, Form, Space } from 'antd';

import './PhraseEditCard.scss';

const { Panel } = Collapse;
const { TextArea } = Input;
const { Text } = Typography;

const PhraseEditCard = ({ phrase, onEditPhraseFinish, onDeletePhrase }) => {
  const [openFirstPanel, setOpenFirstPanel] = useState(0);
  const [openSecondPanel, setOpenSecondPanel] = useState(0);

  const onFinish = (data) => {
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
          firstDescr: phrase.languages.first.descr,
          secondDescr: phrase.languages.second.descr,
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
            header={(
              <Form.Item
                name="first"
                rules={[{ required: true, message: 'Please input phrase.', },]}
              >
                <Input placeholder="First language" />
              </Form.Item>
            )}
            key={1}
          >
            <Form.Item name="firstDescr">
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
            header={(
              <Form.Item
                name="second"
                rules={[{ required: true, message: 'Please input phrase.', },]}
              >
                <Input placeholder="Second language" />
              </Form.Item>
            )}
            key={1}
          >
            <Form.Item name="secondDescr">
              <TextArea rows={2} placeholder="Description" />
            </Form.Item>
          </Panel>
        </Collapse>

        <div className="phrase-edit-card__footer">
          <div className="phrase-edit-card__id">
            <Text type="secondary">ID: {phrase.id}</Text>
          </div>
          <div className="phrase-edit-card__action">
            <Space wrap>
              <Button size="small" htmlType="submit">Save</Button>
              <Popconfirm
                title="Are you sure?"
                okText="Yes"
                cancelText="No"
                onConfirm={() => onDeletePhrase(phrase.id)}
              >
                <Button size="small" danger>Delete</Button>
              </Popconfirm>
            </Space>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default PhraseEditCard;
