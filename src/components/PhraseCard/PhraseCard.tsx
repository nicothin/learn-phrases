import { Dispatch, SetStateAction } from 'react';
import { Card, Collapse, Typography, Rate, CollapseProps, Button } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';

import './PhraseCard.css';

import { Phrase } from '../../types';
import { renderTags } from '../../utils';

const { Text } = Typography;

type PhraseCardProps = {
  readonly cardData?: Phrase;
  readonly activeKey?: number;
  readonly setOpenedCardId: Dispatch<SetStateAction<number | undefined>>;
  readonly onEditPhrase: (data: Phrase) => void;
};

export default function PhraseCard({
  cardData,
  activeKey,
  setOpenedCardId,
  onEditPhrase,
}: PhraseCardProps) {
  if (!cardData) return null;

  const onCardHeaderClick = () =>
    setOpenedCardId((prev) => (prev === undefined ? cardData.id : undefined));

  const item: CollapseProps['items'] = [
    {
      key: cardData.id,
      label: (
        <div
          className="lp-phrase-card__shown"
          onClick={onCardHeaderClick}
          role="button"
          tabIndex={0}
        >
          <ReactMarkdown className="lp-phrase-card__title">{cardData.first}</ReactMarkdown>

          {cardData?.firstD && (
            <Text className="lp-phrase-card__description" type="secondary">
              <ReactMarkdown>{cardData?.firstD}</ReactMarkdown>
            </Text>
          )}

          {cardData.knowledgeLvl > 8 && (
            <CheckCircleOutlined className="lp-phrase-card__done-icon" />
          )}
        </div>
      ),
      children: (
        <div className="lp-phrase-card__hidden">
          <ReactMarkdown className="lp-phrase-card__title">{cardData.second}</ReactMarkdown>

          {cardData.secondD && (
            <Text className="lp-phrase-card__description" type="secondary">
              <ReactMarkdown>{cardData.secondD}</ReactMarkdown>
            </Text>
          )}

          <Rate
            className="lp-phrase-card__rate"
            character={<CheckCircleOutlined />}
            count={9}
            value={cardData.knowledgeLvl}
            disabled
          />

          {cardData?.tags?.length ? (
            <p className="lp-phrase-card__tags">{renderTags(cardData)}</p>
          ) : null}
        </div>
      ),
      showArrow: false,
    },
  ];

  return (
    <Card className="lp-phrase-card" bordered={false}>
      <Collapse items={item} collapsible="header" activeKey={[activeKey ?? 'UNKNOWN']} ghost />

      <p className="lp-phrase-card__bottom-info">
        <Text type="secondary">
          ID: {cardData.id}.
          <Button type="text" size="small" onClick={() => onEditPhrase(cardData)}>
            Edit
          </Button>
        </Text>
      </p>
    </Card>
  );
}
