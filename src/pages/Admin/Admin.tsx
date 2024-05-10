import { BaseSyntheticEvent, useEffect, useRef, useState } from 'react';
import {
  notification,
  Upload,
  Table,
  FloatButton,
  Pagination,
  Row,
  Col,
  Form,
  Input,
  Modal,
  Popconfirm,
} from 'antd';
import type { PaginationProps } from 'antd';
import {
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
} from '@ant-design/icons';
import { useLiveQuery } from 'dexie-react-hooks';

import './Admin.css';

import { Phrase, PhrasesDTO, PhrasesFilterFunction } from '../../types';
import { DEXIE_DEFAULT_FILTER_FUNC_OBJ, DEXIE_TABLE_NAME } from '../../constants';
import { useSettingsContext } from '../../hooks';
import { getDate, getFloatButtonPositionStyle } from '../../utils';
import { DexieIndexedDB } from '../../services/DexieIndexedDB';
import { Gist } from '../../services/Gist';
import {
  deleteAllPhrasesLocally,
  getPhrasesDTOFromLocal,
  startDownloadFile,
} from '../../services/actions';
import { importPhrases } from '../../services/actions/importPhrases';
import PhrasesTable from '../../components/PhrasesTable/PhrasesTable';
import EditPhraseModal from '../../components/EditPhraseModal/EditPhraseModal';
import ImportFromGistFloatButton from '../../components/ImportFromGistFloatButton/ImportFromGistFloatButton';
import ExportToGistFloatButton from '../../components/ExportToGistFloatButton/ExportToGistFloatButton';

const PHRASES_ON_PAGE_COUNT = 30;
const REMOVE_MARKDOWN_REGEX = /([*_~]{2})+/gim;

export default function Admin() {
  const [modalApi, contextModal] = Modal.useModal();
  const [notificationApi, contextNotification] = notification.useNotification();

  const tableRef: Parameters<typeof Table>[0]['ref'] = useRef(null);

  const { token, gistId } = useSettingsContext();

  const gist = Gist.getInstance({ token, gistId });

  const [filter, setFilter] = useState<PhrasesFilterFunction>(DEXIE_DEFAULT_FILTER_FUNC_OBJ);
  const [paginationPage, setPaginationPage] = useState(1);
  const [phrasesCounterStart, setPhrasesCounterStart] = useState(0);
  const [phrasesCounter, setPhrasesCounter] = useState(0);

  const [canSynchronized, setCanSynchronized] = useState(false);

  const [editedPhraseData, setEditedPhraseData] = useState<Partial<Phrase> | null>(null);

  const phrasesInTheSelection = useLiveQuery(
    () =>
      DexieIndexedDB[DEXIE_TABLE_NAME].orderBy('id')
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
    tableRef.current?.scrollTo({ index: 0 });
  };

  const onFilterSubmit = (value: { search: string }) => {
    const search = value?.search?.toLowerCase().trim();

    if (search === '') {
      setFilter(DEXIE_DEFAULT_FILTER_FUNC_OBJ);
      return;
    }

    if (search && search !== '' && search?.length < 2) {
      notificationApi.warning({
        message: 'Enter 2+ characters',
      });
      setFilter(DEXIE_DEFAULT_FILTER_FUNC_OBJ);
      return;
    }

    setPaginationPage(1);

    setFilter({
      func: (phrase: Phrase) =>
        String(phrase.id).includes(search) ||
        phrase.first.toLowerCase().replace(REMOVE_MARKDOWN_REGEX, '').includes(search) ||
        phrase?.firstD?.toLowerCase().replace(REMOVE_MARKDOWN_REGEX, '').includes(search) ||
        phrase.second.toLowerCase().replace(REMOVE_MARKDOWN_REGEX, '').includes(search) ||
        phrase?.secondD?.toLowerCase().replace(REMOVE_MARKDOWN_REGEX, '').includes(search) ||
        false,
    });
  };

  const filterInputChange = async (event: BaseSyntheticEvent) => {
    if (!event.target.value) setFilter(DEXIE_DEFAULT_FILTER_FUNC_OBJ);
  };

  const onRowClick = (thisPhrase: Phrase) => {
    setEditedPhraseData(thisPhrase);
  };

  const onClickExportFileBtn = async () => {
    getPhrasesDTOFromLocal()
      .then((data: PhrasesDTO) => {
        const text = JSON.stringify(data);
        const timeStamp = getDate(null, { divider: '-', timeDivider: '_', addTime: true });

        startDownloadFile(`phrases_${timeStamp}.json`, text);

        notificationApi.success({
          message: 'Export completed',
          description: 'Look in the Downloads folder.',
        });
      })
      .catch((error) => {
        console.error(error);
        notificationApi.error({
          message: 'Export failed',
          description: String(error),
        });
      });
  };

  const onClickAddPhraseBtn = () => {
    setEditedPhraseData({});
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFileUpload = (event: any) => {
    const reader = new FileReader();
    reader.readAsText(event.file);

    reader.onload = () => {
      const content = reader.result;

      try {
        const newPhrasesDTO = JSON.parse(content as string);

        if (!newPhrasesDTO.length) {
          const errorText = 'The imported file is not a valid JSON.';
          console.error(errorText);
          notificationApi.error({
            message: 'Import failed',
            description: errorText,
          });
          throw Error(errorText);
        }

        importPhrases({ newPhrasesDTO, notificationApi, modalApi });
      } catch (error) {
        const errorText = 'The imported file does not contain phrases.';
        console.error(errorText, error);
        notificationApi.error({
          message: 'Import failed',
          description: errorText,
        });
      }
    };
  };

  const onDeleteAllLocalPhrases = () => {
    deleteAllPhrasesLocally()
      .then(() => {
        notificationApi.success({
          message: 'Cleared',
          description: 'The local storage has been cleared. I hope you have a backup.',
        });
      })
      .catch((error) => {
        console.error(error);
        notificationApi.error({
          message: 'Clear failed',
          description: String(error),
        });
      });
  };

  // Set PhrasesCounter
  useEffect(() => {
    if (!phrasesInTheSelection) return;

    const checkCounter = async () => {
      const counter = await DexieIndexedDB[DEXIE_TABLE_NAME].filter(filter.func).count();
      setPhrasesCounter(counter);
    };

    checkCounter();
  }, [filter, phrasesInTheSelection]);

  // Show or hide SYNC button
  useEffect(() => {
    setCanSynchronized(!!token?.trim() && !!gistId?.trim());
  }, [gistId, token]);

  return (
    <div className="lp-admin-page">
      <Row gutter={[16, 0]} wrap={false} style={{ marginBottom: '1em' }}>
        <Col flex="1 1 40%" style={{ minWidth: 0 }}>
          <Form onFinish={onFilterSubmit} autoComplete="on">
            <Form.Item name="search" style={{ marginBottom: 0 }}>
              <Input placeholder="Search (2+ characters)" onChange={filterInputChange} />
            </Form.Item>
          </Form>
        </Col>
        <Col
          flex="1 1 60%"
          style={{
            minWidth: 230,
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginLeft: 'auto',
          }}
        >
          <Pagination
            style={{ marginBottom: 0 }}
            size="small"
            current={paginationPage}
            onChange={onPaginationChange}
            total={phrasesCounter}
            pageSize={PHRASES_ON_PAGE_COUNT}
            showSizeChanger={false}
            simple
          />
        </Col>
      </Row>

      <PhrasesTable
        wrapperSelector=".lp-admin-page"
        phrasesInTheSelection={phrasesInTheSelection}
        onRowClick={onRowClick}
        tableRef={tableRef}
      />

      {editedPhraseData && (
        <EditPhraseModal
          editedPhraseData={editedPhraseData}
          setEditedPhraseData={setEditedPhraseData}
          notificationApi={notificationApi}
        />
      )}

      <FloatButton
        shape="circle"
        type="primary"
        style={getFloatButtonPositionStyle([0, 0])}
        icon={<PlusOutlined />}
        tooltip="Add phrase"
        onClick={onClickAddPhraseBtn}
      />

      {canSynchronized && (
        <>
          <ImportFromGistFloatButton
            buttonPosition={getFloatButtonPositionStyle([0, 3])}
            gist={gist}
            notificationApi={notificationApi}
            modalApi={modalApi}
          />
          <ExportToGistFloatButton
            buttonPosition={getFloatButtonPositionStyle([0, 4])}
            gist={gist}
            notificationApi={notificationApi}
          />
        </>
      )}

      <Upload customRequest={onFileUpload}>
        <FloatButton
          shape="circle"
          style={getFloatButtonPositionStyle([0, 1])}
          icon={<DownloadOutlined />}
          tooltip="Import phrases from file"
        />
      </Upload>

      <FloatButton
        shape="circle"
        style={getFloatButtonPositionStyle([0, 2])}
        icon={<SaveOutlined />}
        onClick={onClickExportFileBtn}
        tooltip="Export phrases to file"
      />

      <Popconfirm
        placement="left"
        title="Do you really want to delete all local phrases?"
        onConfirm={onDeleteAllLocalPhrases}
        okText="Yes"
        okButtonProps={{ size: 'middle', danger: true }}
        cancelButtonProps={{ size: 'middle' }}
        cancelText="No"
        icon={<QuestionCircleOutlined />}
      >
        <FloatButton
          shape="circle"
          style={getFloatButtonPositionStyle([0, 5])}
          icon={<DeleteOutlined />}
        />
      </Popconfirm>

      {contextModal}
      {contextNotification}
    </div>
  );
}
