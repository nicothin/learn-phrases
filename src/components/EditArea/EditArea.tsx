import React, { useState, useEffect, useRef, useCallback, ChangeEvent } from 'react';
import {
  Layout,
  Spin,
  Button,
  Input,
  Popconfirm,
  Row,
  Col,
  notification,
  Space,
  Upload,
  Modal,
  Form,
  InputRef,
  FormInstance,
} from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import localforage from 'localforage';

import './EditArea.scss';

import PhraseEditCard from '../PhraseEditCard/PhraseEditCard';
import { checkData } from '../../utils/checkData';
import { downloadFile } from '../../utils/downloadFile';
import { STORAGE_NAME, STORAGE_PHRASES_NAME } from '../../enums/storage';
import { formatDate } from '../../utils/formateDate';
import { createItem } from '../../utils/createItem';
import { CreatePhraseType, NotificationType, Phrase } from '../../types';

const { confirm } = Modal;
const { TextArea } = Input;

const EditArea = () => {
  localforage.config({ name: STORAGE_NAME });

  const formRef = useRef<FormInstance>(null);
  const firstInputRef = useRef<InputRef>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [filterValue, setFilterValue] = useState('');
  const [isPhrasesFiltered, setIsPhrasesFiltered] = useState(false);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);

  const [showNotification, contextHolder] = notification.useNotification();

  const openNotification = useCallback((type: NotificationType = 'info', message: string, description?: string) => {
    if (!message && !description) return;

    showNotification[type]({
      message,
      description,
    });
  }, [showNotification]);

  const onImportFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async function () {
      const content = reader.result;
      try {
        const data = JSON.parse(content as string);
        const result = checkData(data);
        if (!result.length) {
          throw new Error('Checking the imported file did not reveal phrases in it.');
        }
        await localforage.setItem(STORAGE_PHRASES_NAME, result);
        setPhrases(result);
        openNotification('success', 'Import completed successfully', `Imported ${result.length} phrases.`)
      } catch (error) {
        console.error(error);
        openNotification('error', 'Import failed with an error');
      }
    };
  };

  const onExportFile = async () => {
    try {
      const storagePhrases = await localforage.getItem(STORAGE_PHRASES_NAME);
      const timeStamp = formatDate(new Date());
      downloadFile(`phrases_${timeStamp}.json`, JSON.stringify(storagePhrases, null, 2));
      openNotification('success', 'Export completed successfully');
    } catch (error) {
      console.error(error);
      openNotification('error', 'Export failed with an error');
    }
  };

  const onClearPhrasesList = async () => {
    try {
      await localforage.clear();
      setPhrases([]);
      openNotification('success', 'Phrase list cleared');
    } catch (error) {
      console.error(error);
      openNotification('error', 'Phrase list not cleared');
    }
  };

  const onEditPhraseFinish = async (data: CreatePhraseType) => {
    try {
      const newItem = createItem({
        id: data.id,
        first: data.first,
        second: data.second,
        firstD: data.firstD,
        secondD: data.secondD,
      });
      const storagePhrases: Phrase[] = await localforage.getItem(STORAGE_PHRASES_NAME) || [];
      const newPhrases = storagePhrases.map((phrase: Phrase) => phrase.id === data.id ? newItem : phrase);
      await localforage.setItem(STORAGE_PHRASES_NAME, newPhrases);
      setPhrases(newPhrases);
      openNotification('success', 'Phrase updated');
      setFilterValue('');
    } catch (error) {
      console.error(error);
      openNotification('error', 'Phrase not updated');
    }
  };

  const onDeletePhrase = async (id: string) => {
    try {
      const storagePhrases: Phrase[] = await localforage.getItem(STORAGE_PHRASES_NAME) || [];
      const newPhrases = storagePhrases.filter((phrase) => phrase.id !== id);
      await localforage.setItem(STORAGE_PHRASES_NAME, newPhrases);
      setPhrases(newPhrases);
      openNotification('success', 'Phrase deleted');
    } catch (error) {
      console.error(error);
      openNotification('error', 'Phrase not deleted');
    }
  };

  const onFilterChange = async (value: ChangeEvent<HTMLInputElement>) => {
    const search = value?.target?.value;
    setFilterValue(search);
    const str = search.trim().toLowerCase();
    if (search.length > 2) {
      setIsPhrasesFiltered(true);
      try {
        const storagePhrases: Phrase[] = await localforage.getItem(STORAGE_PHRASES_NAME) || [];
        const filteredPhrases = storagePhrases.filter((phrase) => (
          phrase?.languages?.first?.content?.toLowerCase().includes(str) ||
          phrase?.languages?.second?.content?.toLowerCase().includes(str) ||
          phrase?.languages?.first?.descr?.toLowerCase().includes(str) ||
          phrase?.languages?.second?.descr?.toLowerCase().includes(str)
        ));
        setPhrases(filteredPhrases);
      } catch (error) {
        console.error(error);
        openNotification('error', 'Phrase not filtered');
      }
    }
    else if (isPhrasesFiltered) {
      setIsPhrasesFiltered(false);
      try {
        const storagePhrases: Phrase[] = await localforage.getItem(STORAGE_PHRASES_NAME) || [];
        setPhrases(storagePhrases);
      } catch (error) {
        console.error(error);
        openNotification('error', 'Phrase not filtered');
      }
    }
  };

  const showDeleteConfirm = (file: File) => {
    confirm({
      title: 'Are you sure?',
      content: 'This will permanently overwrite the current list of phrases.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        onImportFile(file)
      },
    });
  }

  const showAddModal = () => {
    setIsModalAddOpen(true);
    setTimeout(() => firstInputRef.current?.focus({ cursor: 'start', }), 0);
  };

  const onMyKnowledgeLvlChange = async (id: string, value: number) => {
    if (value === 0) return;

    try {
      const storagePhrases: Phrase[] = await localforage.getItem(STORAGE_PHRASES_NAME) || [];
      const newPhrases = storagePhrases.map((phrase) => phrase.id === id
        ? { ...phrase, myKnowledgeLvl: Number(value) }
        : phrase
      );
      await localforage.setItem(STORAGE_PHRASES_NAME, newPhrases);
      setPhrases(newPhrases);
      openNotification('success', 'Phrase updated');
      setFilterValue('');
    } catch (error) {
      console.error(error);
      openNotification('error', 'Phrase not updated');
    }
  };

  const onAddPhrase = async (data: CreatePhraseType) => {
    try {
      const newPhrase = createItem({
        first: data.first,
        second: data.second,
        firstD: data.firstD,
        secondD: data.secondD,
      });
      const storagePhrases: Phrase[] = await localforage.getItem(STORAGE_PHRASES_NAME) || [];
      const newPhrases = [newPhrase, ...storagePhrases];
      await localforage.setItem(STORAGE_PHRASES_NAME, newPhrases);
      setPhrases(newPhrases);
      openNotification('success', 'Phrase successfully added to the top of the list');
      formRef.current?.resetFields();
      setTimeout(() => firstInputRef.current?.focus({ cursor: 'start', }), 0);
      setFilterValue('');
    } catch (error) {
      console.error(error);
      openNotification('error', 'Phrase not added');
    }
  };

  // Получить фразы из локального хранилища
  useEffect(() => {
    async function fetchData() {
      try {
        const storagePhrases: Phrase[] = await localforage.getItem(STORAGE_PHRASES_NAME) || [];
        setPhrases(storagePhrases);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        openNotification('error', 'Phrase list reading error');
      }
    }
    fetchData();
  }, [openNotification]);

  // Отправка формы из модального окна
  useEffect(() => {
    if (!isModalAddOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        formRef?.current?.submit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalAddOpen]);

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
              <Button onClick={showAddModal}>Add</Button>
              <Upload
                className="edit-area__upload"
                customRequest={(event) => {
                  showDeleteConfirm(event.file as File);
                }}
              >
                <Button>Import</Button>
              </Upload>
              <Button onClick={onExportFile}>Export</Button>
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
              <PhraseEditCard
                phrase={phrase}
                onEditPhraseFinish={onEditPhraseFinish}
                onDeletePhrase={onDeletePhrase}
                onMyKnowledgeLvlChange={onMyKnowledgeLvlChange}
              />
            </Col>
          ))}
        </Row>
        {contextHolder}
      </Layout>

      <Modal
        title="Add phrase"
        open={isModalAddOpen}
        onOk={() => formRef?.current?.submit()}
        onCancel={() => setIsModalAddOpen(false)}
      >
        <Form ref={formRef} onFinish={onAddPhrase}>
          <Form.Item
            name="first"
            rules={[{ required: true, message: 'Please input phrase.', },]}
          >
            <Input placeholder="First language" ref={firstInputRef} />
          </Form.Item>
          <Form.Item name="firstDescr">
            <TextArea rows={2} placeholder="Description" />
          </Form.Item>

          <Form.Item
            name="second"
            rules={[{ required: true, message: 'Please input phrase.', },]}
          >
            <Input placeholder="Second language" />
          </Form.Item>
          <Form.Item name="secondDescr">
            <TextArea rows={2} placeholder="Description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default EditArea;
