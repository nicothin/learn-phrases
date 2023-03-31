import React, { useState, useEffect, } from 'react';
import { Layout, Spin, Button, Input, Popconfirm, Row, Col, notification, Space, Upload } from 'antd';
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

  const downloadFile = (filename, text) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  }

  const readFile = () => {
    let fileInput = document.getElementById('fileInput');
    let file = fileInput.files[0];
    let reader = new FileReader();

    reader.readAsText(file);

    reader.onload = function () {
      let content = reader.result;
      let data = JSON.parse(content);
      console.log(data);
      // дальнейшая обработка данных
    };
  };

  const onExport = async () => {
    try {
      const storagePhrases = await localforage.getItem('phrases');
      downloadFile('phrases.json', JSON.stringify(storagePhrases, null, 2));
    } catch (err) {
      console.log('localforage error', err);
    }
  };

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

  const openErrorImportNotification = () => {
    api.error({
      message: `Import not possible.`,
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
          first: { content: data.first?.trim(), descr: data.firstDescr?.trim() || '' },
          second: { content: data.second?.trim(), descr: data.secondDescr?.trim() || '' },
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
          <Col style={{ marginLeft: 'auto', marginBottom: '16px' }}>
            <Space wrap>
              <label>
                <span className="ant-btn">1111</span>
                <input type="file" id="fileInput" onChange={readFile} />
                <Button type="link">Import</Button>
              </label>
              <Button onClick={onExport}>Export</Button>
              <Popconfirm
                title="Are you sure? This will clear all saved phrases."
                onConfirm={onClearPhrasesList}
                okText="Yes"
                cancelText="No"
              >
                <Button type="primary" danger>Clear Phrases list</Button>
              </Popconfirm>
            </Space>
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
