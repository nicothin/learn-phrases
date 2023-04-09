
import { Card, Collapse, Typography } from 'antd';
// import { CheckCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown'

import './PhraseCard.scss';
import { Phrase } from '../../types';

const { Panel } = Collapse;
const { Text } = Typography;

type PhraseCardProps = {
  cardData: Phrase,
  openedCardId: string,
  setOpenCardId: Function,
  thisNumber: number,
  counter: number,
  onMyKnowledgeLvlChange: Function,
};

const PhraseCard = ({
  cardData,
  openedCardId,
  setOpenCardId,
  thisNumber,
  counter,
  onMyKnowledgeLvlChange,
}: PhraseCardProps) => {
  const { id, languages } = cardData;

  return (
    <>
      <Card className="phrase-card" bordered={false} bodyStyle={{ padding: 0 }}>
        <Collapse expandIconPosition="end" activeKey={openedCardId} onChange={(e) => setOpenCardId(cardData.id)} size="large" ghost>
          <Panel
            showArrow={false}
            header={(
              <div className="phrase-card__shown-phrase-wrap">
                <ReactMarkdown className="phrase-card__shown-phrase">{languages.first.content}</ReactMarkdown>
                {languages.first.descr && (
                  <Text className="phrase-card__shown-phrase-description" type="secondary">
                    <ReactMarkdown>{languages.first.descr}</ReactMarkdown>
                  </Text>
                )}

              </div>
            )}
            key={id}
          >
            <div className="phrase-card__hidden-phrase-wrap">
              <ReactMarkdown className="phrase-card__hidden-phrase">{languages.second.content}</ReactMarkdown>
              {languages.second.descr && (
                <Text className="phrase-card__hidden-phrase-description" type="secondary">
                  <ReactMarkdown>{languages.second.descr}</ReactMarkdown>
                </Text>
              )}
            </div>
          </Panel>
        </Collapse>

        {/* <div className="phrase-card__my-knowledge-level">
          <Rate
            character={<CheckCircleOutlined />}
            count={9}
            defaultValue={myKnowledgeLvl}
            onChange={(value) => onMyKnowledgeLvlChange(id, value)}
            allowClear={false}
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
