import React, { useState, useEffect, } from 'react';
import { Layout, Spin, Button, Input, Popconfirm, Row, Col, notification } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import localforage from 'localforage';

import './EditArea.scss';
import PhraseEditCard from '../PhraseEditCard/PhraseEditCard';

const EditArea = () => {
  localforage.config({ name: 'LearnPhrases' });

  const [isLoading, setIsLoading] = useState(true);
  const [phrases, setPhrases] = useState([]);
  const [filterValue, setFilterValue] = useState('');
  const [isPhrasesFiltered, setIsPhrasesFiltered] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  const openDeleteNotification = () => {
    api.warning({
      message: `Phrase deleted.`,
      placement: 'bottomRight',
    });
  };

  const openEditNotification = () => {
    api.success({
      message: `Phrase updated.`,
      placement: 'bottomRight',
    });
  };

  const onClearPhrasesList = async () => {
    try {
      await localforage.clear();
      setPhrases([]);
    } catch (err) {
      console.log('localforage error', err);
    }
  };

  const onEditPhraseFinish = async (data) => {
    try {
      const newItem = {
        id: data.id,
        languages: {
          first: { content: data.first, descr: data.firstDescr || '' },
          second: { content: data.second, descr: data.secondDescr || '' },
        },
        level: 'a0',
        myKnowledgeLvl: 5,
      };
      const storagePhrases = await localforage.getItem('phrases');
      const newPhrases = storagePhrases.map((phrase) => phrase.id === data.id ? newItem : phrase);
      await localforage.setItem('phrases', newPhrases);
      setPhrases(newPhrases);
      openEditNotification();
    } catch (err) {
      console.log('localforage error', err);
    }
  };

  const onDeletePhrase = async (id) => {
    try {
      const storagePhrases = await localforage.getItem('phrases');
      const newPhrases = storagePhrases.filter((phrase) => phrase.id !== id);
      await localforage.setItem('phrases', newPhrases);
      setPhrases(newPhrases);
      openDeleteNotification();
    } catch (err) {
      console.log('localforage error', err);
    }
  };

  const onFilterChange = async (value) => {
    const search = value.target.value;
    setFilterValue(search);
    const str = search.trim().toLowerCase();
    if (search.length > 2) {
      setIsPhrasesFiltered(true);
      try {
        const storagePhrases = await localforage.getItem('phrases');
        const filteredPhrases = storagePhrases.filter((phrase) => (
          phrase?.languages?.first?.content?.toLowerCase().includes(str) ||
          phrase?.languages?.second?.content?.toLowerCase().includes(str) ||
          phrase?.languages?.first?.descr?.toLowerCase().includes(str) ||
          phrase?.languages?.second?.descr?.toLowerCase().includes(str)
        ));
        setPhrases(filteredPhrases);
      } catch (err) {
        console.log('localforage error', err);
      }
    }
    else if (isPhrasesFiltered) {
      setIsPhrasesFiltered(false);
      try {
        const storagePhrases = await localforage.getItem('phrases');
        setPhrases(storagePhrases);
      } catch (err) {
        console.log('localforage error', err);
      }
    }
  };

  // Получить фразы из локального хранилища
  useEffect(() => {
    async function fetchData() {
      try {
        const storagePhrases = await localforage.getItem('phrases');
        setPhrases(storagePhrases);
        setIsLoading(false);
      } catch (err) {
        console.log('localforage error', err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="edit-area">
      {isLoading && <Spin indicator={<LoadingOutlined style={{ fontSize: 48, }} spin />} className="edit-area__load" />}
      <Layout className="edit-area__wrap">
        <Row gutter={[16, 0]} style={{ }}>
          <Col flex="1 0 auto" style={{ maxWidth: '240px', marginBottom: '16px' }}>
            <Input
              style={{ width: '100%' }}
              placeholder="Search (3+ characters)"
              value={filterValue}
              onChange={onFilterChange}
              className={isPhrasesFiltered ? '' : 'edit-area__inactive-filter'}
            />
          </Col>
          <Col flex="100px" style={{ marginLeft: 'auto', marginBottom: '16px' }}>
            <Popconfirm
              title="Are you sure? This will clear all saved phrases."
              onConfirm={onClearPhrasesList}
              okText="Yes"
              cancelText="No"
            >
              <Button type="primary" danger>Clear Phrases list</Button>
            </Popconfirm>
          </Col>
        </Row>

        <Row gutter={[{ xs: 8, md: 16 }, { xs: 8, sm: 16, md: 16 }]}>
          {phrases.map((phrase) => (
            <Col xs={24} md={12} xl={8} key={phrase.id}>
              <PhraseEditCard phrase={phrase} onEditPhraseFinish={onEditPhraseFinish} onDeletePhrase={onDeletePhrase} />
            </Col>
          ))}
        </Row>
        {contextHolder}
      </Layout>
    </div>
  );
}

export default EditArea;
