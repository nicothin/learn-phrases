import { useState, useEffect, useRef } from 'react';
import {
  Layout,
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
  Pagination,
  PaginationProps,
} from 'antd';
import { useLiveQuery } from 'dexie-react-hooks';

import './EditArea.scss';

import { Phrase } from '../../types';
import { db } from '../../db';
import PhraseEditCard from '../PhraseEditCard/PhraseEditCard';
import { checkData } from '../../utils/checkData';
import { downloadFile } from '../../utils/downloadFile';
import { STORAGE_TABLE_NAME } from '../../enums/storage';
import { formatDate } from '../../utils/formateDate';
import { openNotification } from '../../utils/openNotification';
import Loader from '../Loader/Loader';

type FilterFunction = {
  func: (phrase: Phrase) => boolean;
};

const { TextArea } = Input;

const DEFAULT_FILTER_FUNC_OBJ = { func: () => true };

const EditArea = () => {
  const PHRASES_ON_PAGE_COUNT = 9;

  const formRef = useRef<FormInstance>(null);
  const firstInputRef = useRef<InputRef>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isModalAddOpen, setIsModalAddOpen] = useState(false);
  const [paginationPage, setPaginationPage] = useState(1);
  const [phrasesCounterStart, setPhrasesCounterStart] = useState(0);
  const [phrasesCounter, setPhrasesCounter] = useState(0);

  const [showNotification, contextNotificationHolder] = notification.useNotification();
  const [modal, contextModalHolder] = Modal.useModal();

  const [filter, setFilter] = useState<FilterFunction>(DEFAULT_FILTER_FUNC_OBJ);

  const phrases = useLiveQuery(
    () =>
      db[STORAGE_TABLE_NAME].orderBy('id')
        .reverse()
        .filter(filter.func)
        .offset(phrasesCounterStart)
        .limit(PHRASES_ON_PAGE_COUNT)
        .toArray(),
    [phrasesCounterStart, filter],
  );

  const onPaginationChange: PaginationProps['onChange'] = (page) => {
    setPaginationPage(page);
    setPhrasesCounterStart((page - 1) * PHRASES_ON_PAGE_COUNT);
  };

  const onImportFile = (file: File) => {
    const reader = new FileReader();
    reader.readAsText(file);

    reader.onload = async () => {
      const content = reader.result;
      setIsLoading(true);
      try {
        const data = JSON.parse(content as string);
        const result = checkData(data);
        if (!result.length) {
          throw new Error('Checking the imported file did not reveal phrases in it.');
        }

        await db[STORAGE_TABLE_NAME].bulkAdd(result);

        openNotification(
          showNotification,
          'success',
          'Import completed successfully',
          `Imported ${result.length} phrases.`,
        );
      } catch (error) {
        console.error(error);
        openNotification(showNotification, 'error', 'Import failed with an error');
      }
      setIsLoading(false);
    };
  };

  const onExportFile = async () => {
    try {
      const data = await db.table(STORAGE_TABLE_NAME).toArray();
      const text = JSON.stringify(data, null, 2);
      const timeStamp = formatDate(new Date());
      downloadFile(`phrases_${timeStamp}.json`, text);
      openNotification(showNotification, 'success', 'Export completed successfully');
    } catch (error) {
      console.error(error);
      openNotification(showNotification, 'error', 'Export failed with an error');
    }
  };

  const onClearPhrasesList = async () => {
    try {
      await db[STORAGE_TABLE_NAME].clear();
      openNotification(showNotification, 'success', 'Phrase list cleared');
    } catch (error) {
      console.error(error);
      openNotification(showNotification, 'error', 'Phrase list not cleared');
    }
  };

  const onFilterSubmit = async (value: any) => {
    const search = value?.search?.toLowerCase();

    if (!search || (search && search?.length < 3)) {
      openNotification(showNotification, 'warning', 'Enter 3+ characters.');
      setFilter(DEFAULT_FILTER_FUNC_OBJ);
      return;
    }

    setPaginationPage(1);

    setFilter({
      func: (phrase: Phrase) =>
        String(phrase.id).includes(search) ||
        phrase.first.includes(search) ||
        phrase?.firstD?.includes(search) ||
        phrase.second.includes(search) ||
        phrase?.secondD?.includes(search) ||
        false,
    });
  };

  const showImportConfirm = (file: File) => {
    modal.confirm({
      title: 'Are you sure?',
      content: 'This may overwrite some of the data if the IDs of some phrases match.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        setIsLoading(true);
        onImportFile(file);
      },
    });
  };

  const showAddModal = () => {
    setIsModalAddOpen(true);
    setTimeout(() => firstInputRef.current?.focus({ cursor: 'start' }), 0);
  };

  const onAddPhrase = async (data: Phrase) => {
    try {
      const lastItem = await db.table(STORAGE_TABLE_NAME).orderBy('id').last();
      const newPhrase: Phrase = { ...data, myKnowledgeLvl: 1, id: lastItem.id + 1 };
      await db[STORAGE_TABLE_NAME].add(newPhrase);
      openNotification(
        showNotification,
        'success',
        'Phrase successfully added to the top of the list',
      );
      formRef.current?.resetFields();
      setTimeout(() => firstInputRef.current?.focus({ cursor: 'start' }), 0);
    } catch (error) {
      console.error(error);
      openNotification(showNotification, 'error', 'Phrase not added');
    }
  };

  // Отправка формы из модального окна
  useEffect(() => {
    if (!isModalAddOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'Enter') {
        formRef?.current?.submit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // eslint-disable-next-line consistent-return
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalAddOpen]);

  // Скрыть лоадер, когда список фраз загружен
  useEffect(() => {
    if (phrases) {
      setIsLoading(false);

      const checkCounter = async () => {
        const counter = await db[STORAGE_TABLE_NAME].filter(filter.func).count();
        setPhrasesCounter(counter);
      };

      checkCounter();
    }
  }, [filter, phrases]);

  return (
    <div className="edit-area">
      {isLoading && <Loader />}

      <Layout className="edit-area__wrap">
        <Row gutter={[16, 0]}>
          <Col flex="1 0 auto" style={{ maxWidth: '240px', marginBottom: '16px' }}>
            <Form onFinish={onFilterSubmit} autoComplete="on">
              <Form.Item name="search">
                <Input style={{ width: '100%' }} placeholder="Search (3+ characters)" />
              </Form.Item>
            </Form>
          </Col>

          <Col style={{ marginLeft: 'auto', marginBottom: '16px' }}>
            <Space wrap>
              <Button onClick={showAddModal}>Add</Button>
              <Upload
                className="edit-area__upload"
                customRequest={(event) => {
                  showImportConfirm(event.file as File);
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
                <Button type="primary" danger>
                  Clear Phrases list
                </Button>
              </Popconfirm>
            </Space>
          </Col>
        </Row>

        <Row
          className="edit-area__phrase-list"
          gutter={[
            { xs: 8, md: 16 },
            { xs: 8, sm: 16, md: 16 },
          ]}
        >
          {phrases?.map((phrase) => (
            <Col xs={24} md={12} xl={8} key={phrase.id}>
              <PhraseEditCard phrase={phrase} />
            </Col>
          ))}
        </Row>

        <Pagination
          className="edit-area__pagination"
          current={paginationPage}
          onChange={onPaginationChange}
          total={phrasesCounter}
          pageSize={PHRASES_ON_PAGE_COUNT}
          simple
        />
      </Layout>

      {contextNotificationHolder}
      {contextModalHolder}

      <Modal
        title="Add phrase"
        open={isModalAddOpen}
        onOk={() => formRef?.current?.submit()}
        onCancel={() => setIsModalAddOpen(false)}
      >
        <Form ref={formRef} onFinish={onAddPhrase}>
          <Form.Item name="first" rules={[{ required: true, message: 'Please input phrase.' }]}>
            <Input placeholder="First language" ref={firstInputRef} />
          </Form.Item>
          <Form.Item name="firstD">
            <TextArea rows={2} placeholder="Description" />
          </Form.Item>

          <Form.Item name="second" rules={[{ required: true, message: 'Please input phrase.' }]}>
            <Input placeholder="Second language" />
          </Form.Item>
          <Form.Item name="secondD">
            <TextArea rows={2} placeholder="Description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EditArea;
