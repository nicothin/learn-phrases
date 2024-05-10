import { useEffect } from 'react';
import { Modal } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';

import { PhrasesDTO } from '../../types';

type ImportPhrasesResolveConflictsModalProps = {
  readonly newPhrasesDTO: PhrasesDTO;
  // readonly setNewPhrasesDTO: Dispatch<SetStateAction<PhrasesDTO>>;
  readonly notificationApi: NotificationInstance;
};

// TODO Show diff resolver

// interface DataType {
//   key: React.Key;
//   id: number;
//   first: string;
//   differentFields: string | ReactNode;
// }

// const COLUMNS: TableColumnsType<DataType> = [
//   { title: 'ID', dataIndex: 'id', key: 'id', width: 48, },
//   { title: 'First phrase', dataIndex: 'first', key: 'first', },
//   Table.EXPAND_COLUMN,
//   { title: 'Differenсe', dataIndex: 'differentFields', key: 'differentFields' },
//   {
//     title: 'Action',
//     dataIndex: '',
//     width: 320,
//     key: 'x',
//     render: (record) => {
//       console.log(record);
//       return (
//         <Radio.Group defaultValue="a" buttonStyle="solid" size="small">
//           <Radio.Button value="a">Replace with imported</Radio.Button>
//           <Radio.Button value="b">Leave as is</Radio.Button>
//           <Radio.Button value="c">Remove</Radio.Button>
//         </Radio.Group>
//       );
//     },
//   },
// ];

// const data: DataType[] = [
//   {
//     key: 1,
//     first: 'John Brown',
//     id: 32,
//     differentFields: (<>
//       <Tag>first</Tag>
//       <Tag>firstD</Tag>
//       <Tag>second</Tag>
//       <Tag>knowledgeLvl</Tag>
//     </>),
//   },
//   {
//     key: 2,
//     first: 'Jim Green',
//     id: 4243,
//     differentFields: <Tag color="orange">Missing from the imported data</Tag>,
//   },
//   {
//     key: 3,
//     first: 'Not Expandable',
//     id: 29,
//     differentFields: <Tag color="red">Missing in local data</Tag>,
//   },
//   {
//     key: 4,
//     first: 'Joe BlackJoe BlackJoe BlackJoe BlackJoe BlackJoe BlackJoe Black',
//     id: 32,
//     differentFields: '',
//   },
//   {
//     key: 5,
//     first: 'John Brown',
//     id: 32,
//     differentFields: '',
//   },
//   {
//     key: 6,
//     first: 'Jim Green',
//     id: 42,
//     differentFields: '',
//   },
//   {
//     key: 7,
//     first: 'Not Expandable',
//     id: 29,
//     differentFields: '',
//   },
//   {
//     key: 8,
//     first: 'Joe Black',
//     id: 32,
//     differentFields: 'Sydney No. 1 Lake Park',
//   },
// ];

export default function ImportPhrasesResolveConflictsModal({
  newPhrasesDTO,
  // setNewPhrasesDTO,
  notificationApi,
}: ImportPhrasesResolveConflictsModalProps) {
  const [modalApi, contextHolder] = Modal.useModal();

  // console.log('newPhrasesDTO', newPhrasesDTO);

  // const [isOpen, setIsOpen] = useState(false);

  // const onOk = () => {
  //   setNewPhrasesDTO([]);
  // };

  // const onCancel = () => {
  //   setNewPhrasesDTO([]);
  // };

  // const content = useMemo(() => (
  //   <Table
  //     columns={COLUMNS}
  //     expandable={{
  //       expandedRowRender: (record) => <pre>1</pre>,
  //       rowExpandable: (record) => record.name !== 'Not Expandable',
  //       expandIcon: ({ expanded, onExpand, record }) =>
  //         expanded ? (
  //           <UpOutlined onClick={e => onExpand(record, e)} />
  //         ) : (
  //           <DownOutlined onClick={e => onExpand(record, e)} />
  //         ),
  //       // expandedRowKeys: [0, 1, 5],
  //       onExpand: (expanded: boolean, record: DataType) => {
  //         console.log('expanded', expanded);
  //         console.log('record', record);
  //       },
  //     }}
  //     dataSource={data}
  //     size="small"
  //     pagination={false}
  //     scroll={{ x: 940 }}
  //   />
  // ), []);

  useEffect(() => {
    if (!newPhrasesDTO.length) {
      // setIsOpen(false);
      return;
    }

    modalApi.confirm({
      title: 'Are you sure?',
      content: (
        <>
          <p>
            If the ID of the imported phrases matches the local IDs, the local data will be
            replaced.{' '}
          </p>
          <p>This action cannot be reversed. Make a backup.</p>
        </>
      ),
      okText: 'Yes, replace the local data',
      cancelText: 'Cancel',
    });

    // getPhrasesDTOFromLocal()
    //   .then((phrasesDTO: PhrasesDTO) => {
    //     console.log('phrasesDTO', phrasesDTO);

    //     const diffData = getDiffFromPhrasesDTO(newPhrasesDTO, phrasesDTO);

    //     setIsOpen(!!diffData.diffs.length);

    //     DexieIndexedDB[STORAGE_TABLE_NAME].bulkPut(phrases)
    //       .then(() => {
    //         notificationApi.success({
    //           message: 'Import completed',
    //         });
    //       })
    //       .catch((error: Error) => {
    //         console.error(error);
    //         notificationApi.error({
    //           message: 'Import failed',
    //           description: String(error),
    //         });
    //       });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     notificationApi.error({
    //       message: 'Unable to get local phrases list',
    //       description: String(error),
    //     });
    //   });
  }, [modalApi, newPhrasesDTO, notificationApi]);

  return contextHolder;

  // return (
  //   <Modal
  //     title="Modal Title"
  //     open={isOpen}
  //     onOk={onOk}
  //     onCancel={onCancel}
  //     footer={[
  //       <Button key="cancel" onClick={onCancel}>
  //         Cancel
  //       </Button>,
  //       <Button key="ok" type="primary" onClick={onOk}>
  //         OK
  //       </Button>,
  //     ]}
  //     width={1000}
  //   >
  //     {content}
  //     {/* {newPhrasesDTO.map((item, index) => <p key={index}>{item}</p>)} */}
  //   </Modal>
  // );
}
