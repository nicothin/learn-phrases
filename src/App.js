import { Row, Col, Layout } from 'antd';

import './App.scss';

import PhraseCard from './components/PhraseCard';
import { phrases } from './mocks/phrases';

export const App = () => {

  console.log('phrases', phrases);

  return (
    <div className="app">
      <Layout style={{ minHeight: '100vh', padding: 8, }}>
        <Row gutter={[{ xs: 8, md: 16 }, { xs: 16, sm: 16, md: 16 }]}>
          <Col xs={24} md={12} xl={8}>
            {/* <PhraseCard cardData={1} /> */}
          </Col>
        </Row>
      </Layout>
    </div>
  );
}

export default App;
