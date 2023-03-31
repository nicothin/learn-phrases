import { Card, Collapse, Typography } from 'antd';
// import { CloseOutlined, MehOutlined, CheckOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown'

import './PhraseCard.scss';

const { Panel } = Collapse;
const { Text } = Typography;

const PhraseCard = ({ cardData, openedCardId, setOpenCardId, thisNumber,  counter }) => {
  const { id, data, } = cardData;

  // const getKnowledgeLevel = () => {
  //   if (cardData.myKnowledgeLvl === 5) return 5;
  //   if (cardData.myKnowledgeLvl < 5) return 1;
  //   return 9;
  // };

  // const onChangeKnowledgeLevel = (value) => {
  //   console.log('value', value);
  // };

  return (
    <>
      <Card className="phrase-card" bordered={false} bodyStyle={{ padding: 0 }}>
        <Collapse expandIconPosition="end" activeKey={openedCardId} onChange={(e) => setOpenCardId(cardData.id)} size="large" ghost>
          <Panel
            showArrow={false}
            header={(
              <div className="phrase-card__shown-phrase-wrap">
                <ReactMarkdown className="phrase-card__shown-phrase">{data.ru.content}</ReactMarkdown>
                {data.ru.descr && (
                  <Text className="phrase-card__shown-phrase-description" type="secondary">
                    <ReactMarkdown>{data.ru.descr}</ReactMarkdown>
                  </Text>
                )}

              </div>
            )}
            key={id}
          >
            <div className="phrase-card__hidden-phrase-wrap">
              <ReactMarkdown className="phrase-card__hidden-phrase">{data.en.content}</ReactMarkdown>
              {data.en.descr && (
                <Text className="phrase-card__hidden-phrase-description" type="secondary">
                  <ReactMarkdown>{data.en.descr}</ReactMarkdown>
                </Text>
              )}
            </div>
          </Panel>
        </Collapse>
        {/* <div className="phrase-card__my-knowledge-level">
          <Segmented
            options={[
              { label: <CloseOutlined style={{ color: '#A9A9A9' }} />, value: 1 },
              { label: <MehOutlined style={{ color: '#A9A9A9' }} />, value: 5 },
              { label: <CheckOutlined style={{ color: '#A9A9A9' }} />, value: 9 },
            ]}
            defaultValue={getKnowledgeLevel()}
            onChange={onChangeKnowledgeLevel}
          />
        </div> */}
      </Card>
      <div className="phrase-card__counter">
        <Text type="secondary">ID: {id}. &nbsp; {thisNumber}/{counter} </Text>
      </div>
    </>
  );
}

export default PhraseCard;
