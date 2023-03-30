import React, { useState, useEffect, useRef, useContext } from 'react';
import { Layout, Spin, Button, Table, Form, Input, Popconfirm } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import localforage from 'localforage';

import './EditArea.scss';

const EditableContext = React.createContext(null);

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };
  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };
  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

const EditArea = () => {
  localforage.config({ name: 'LearnPhrases' });

  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState([
    // {
    //   key: '0',
    //   name: 'Edward King 0',
    //   age: '32',
    //   address: 'London, Park Lane no. 0',
    // },
    // {
    //   key: '1',
    //   name: 'Edward King 1',
    //   age: '32',
    //   address: 'London, Park Lane no. 1',
    // },
  ]);
  const [count, setCount] = useState(0);

  // Получить фразы из локального хранилища
  useEffect(() => {
    async function fetchData() {
      try {
        const storagePhrases = await localforage.getItem('phrases');
        setDataSource(storagePhrases.map((phrase) => ({
          key: phrase.id,
          id: phrase.id,
          ru: phrase.data.ru.content,
          ruDescr: phrase.data.ru.descr,
          en: phrase.data.en.content,
          enDescr: phrase.data.en.descr,
          level: phrase.level,
          myKnowledgeLvl: phrase.myKnowledgeLvl,
        })));
        setCount(storagePhrases.length);
        setIsLoading(false);
      } catch (err) {
        console.log('localforage error', err);
      }
    }
    fetchData();
  }, []);

  const handleDelete = (key) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const defaultColumns = [
    {
      dataIndex: 'id',
      width: 42,
    },
    {
      title: 'Native',
      dataIndex: 'ru',
      width: '30%',
      editable: true,
    },
    Table.EXPAND_COLUMN,
    {
      title: 'Translate',
      dataIndex: 'en',
      width: '30%',
      editable: true,
    },
    {
      title: 'Action',
      dataIndex: 'operation',
      render: (_, record) =>
        dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            Delete
          </Popconfirm>
        ) : null,
    },
  ];

  const handleAdd = () => {
    const newData = {
      key: count,
      name: `Edward King ${count}`,
      age: '32',
      address: `London, Park Lane no. ${count}`,
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div className="edit-area">
      {isLoading && <Spin indicator={<LoadingOutlined style={{ fontSize: 48, }} spin />} className="edit-area__load" />}
      <Layout className="train-area__wrap">
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ marginBottom: 16,}}
        >
          Add a row
        </Button>

        <Table
          // showHeader={false}
          size="small"
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          showSizeChanger={false}
          dataSource={dataSource}
          columns={columns}
          expandable={{
            expandedRowRender: (record) => (
              <p
                style={{
                  margin: 0,
                }}
              >
                {record.address}
              </p>
            ),
            rowExpandable: (record) => record.name !== 'Not Expandable',
          }}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
          }}
          scroll={{
            y: 240,
          }}
        />
        {/* https://ant.design/components/table#examples */}
      </Layout>
    </div>
  );
}

export default EditArea;
