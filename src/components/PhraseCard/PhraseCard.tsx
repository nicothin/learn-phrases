import { Card, Collapse, Typography, Rate } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

import './PhraseCard.scss';

import { Phrase } from '../../types';

const { Panel } = Collapse;
const { Text } = Typography;

type PhraseCardProps = {
  cardData: Phrase;
  openedCardId: number | undefined;
  setOpenCardId: (id: number) => void;
};

const PhraseCard = ({ cardData, openedCardId, setOpenCardId }: PhraseCardProps) => {
  return (
    <>
      <Card className="phrase-card" bordered={false} bodyStyle={{ padding: 0 }}>
        <Collapse
          expandIconPosition="end"
          activeKey={openedCardId}
          onChange={() => setOpenCardId(cardData.id)}
          size="large"
          ghost
        >
          <Panel
            showArrow={false}
            header={
              <div className="phrase-card__shown-phrase-wrap">
                <ReactMarkdown className="phrase-card__shown-phrase">
                  {cardData.first}
                </ReactMarkdown>
                {cardData?.firstD && (
                  <Text className="phrase-card__shown-phrase-description" type="secondary">
                    <ReactMarkdown>{cardData?.firstD}</ReactMarkdown>
                  </Text>
                )}
              </div>
            }
            key={cardData.id}
          >
            <div className="phrase-card__hidden-phrase-wrap">
              <ReactMarkdown className="phrase-card__hidden-phrase">
                {cardData.second}
              </ReactMarkdown>
              {cardData.secondD && (
                <Text className="phrase-card__hidden-phrase-description" type="secondary">
                  <ReactMarkdown>{cardData.secondD}</ReactMarkdown>
                </Text>
              )}

              <Rate
                className="phrase-card__rate"
                character={<CheckCircleOutlined />}
                count={9}
                value={cardData.myKnowledgeLvl}
                disabled
              />
            </div>
          </Panel>
        </Collapse>
      </Card>

      <div className="phrase-card__counter">
        <Text type="secondary">ID: {cardData.id}.</Text>
      </div>
    </>
  );
};

export default PhraseCard;
