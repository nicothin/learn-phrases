import { Card } from 'antd';

const PhraseCard = (cardData) => {
  return (
    <Card title="Card title" bordered={false}>
      Card content
      {cardData}
    </Card>
  );
}

export default PhraseCard;
