import { Card, Collapse, Typography } from 'antd';
import ReactMarkdown from 'react-markdown'

import './PhraseCard.scss';

const { Panel } = Collapse;
const { Text } = Typography;

const PhraseCard = ({ cardData, openedCardId, setOpenCardId }) => {
  const { id, data, } = cardData;

  return (
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
    </Card>
  );
}

export default PhraseCard;
