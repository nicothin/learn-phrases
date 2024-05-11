import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, Rate, Select, Flex, Typography, Button, Popconfirm } from 'antd';
import { CheckCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { NotificationInstance } from 'antd/es/notification/interface';
import { ModalFooterRender } from 'antd/es/modal/interface';
import type { InputRef } from 'antd';
import dayjs from 'dayjs';

import { Phrase } from '../../types';
import { DATE_FORMAT, TAGS } from '../../constants';
import { savePhraseLocally, deletePhraseLocally } from '../../services/actions';
import { convertToKnowledgeLvl } from '../../utils';
import { useStateContext } from '../../hooks';

const { TextArea } = Input;
const { Text } = Typography;

interface PhraseModalProps {
  readonly editedPhraseData: Partial<Phrase> | null;
  readonly setEditedPhraseData: Dispatch<SetStateAction<Partial<Phrase> | null>>;
  readonly notificationApi?: NotificationInstance;
  // readonly onSave?: (values: Phrase) => Promise<void>;
  // readonly onCancel?: () => void;
  // readonly onDelete?: (id: number) => Promise<void>;
}

export default function EditPhraseModal({
  editedPhraseData,
  setEditedPhraseData,
  notificationApi,
}: PhraseModalProps) {
  const [form] = Form.useForm();

  const { setIsPhraseEditModalOpen } = useStateContext();

  const firstInputRef = useRef<InputRef>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [knowledgeLvl, setKnowledgeLvl] = useState(0);
  const [isFormValid, setIsFormValid] = useState(false);

  const isEdit = editedPhraseData?.id !== undefined;

  const title = isEdit ? `Edit Phrase (ID: ${editedPhraseData.id})` : 'Add phrase';

  const initialValues = {
    ...editedPhraseData,
    tags:
      editedPhraseData?.tags
        ?.split(',')
        .map((tag) => tag.trim())
        .filter((tag) => !!tag) ?? null,
  };

  const onThisModalCancel = () => {
    form.resetFields();
    setEditedPhraseData(null);
  };

  const onThisModalSave = () => {
    const thisPhrase: Phrase = {
      ...editedPhraseData,
      ...form.getFieldsValue(),
      knowledgeLvl,
      tags: form.getFieldsValue()?.tags?.join(',') ?? '',
    };

    savePhraseLocally(thisPhrase)
      .then(() => {
        notificationApi?.success({
          message: 'Phrase saved',
        });
        setEditedPhraseData(isEdit ? null : {});
        form.resetFields();
      })
      .catch((error) => {
        console.error(error, thisPhrase);
        notificationApi?.error({
          message: error,
        });
      });
  };

  const onThisModalDelete = () => {
    deletePhraseLocally(Number(editedPhraseData?.id))
      .then(() => {
        notificationApi?.success({
          message: 'Phrase deleted',
        });
        setEditedPhraseData(null);
        form.resetFields();
      })
      .catch((error) => {
        console.error(error, editedPhraseData?.id);
        notificationApi?.error({
          message: error,
        });
      });
  };

  const validateForm = useCallback(() => {
    form
      .validateFields()
      .then(() => {
        setIsFormValid(true);
      })
      .catch((info) => {
        setIsFormValid(info.errorFields.length === 0);
      });
  }, [form]);

  const getModalFooter: ModalFooterRender = (_, { OkBtn, CancelBtn }) => (
    <Flex gap={8}>
      {isEdit && (
        <Popconfirm
          placement="bottom"
          title="Are you sure?"
          onConfirm={onThisModalDelete}
          okText="Yes"
          okButtonProps={{ size: 'middle', danger: true }}
          cancelButtonProps={{ size: 'middle' }}
          cancelText="No"
          icon={<QuestionCircleOutlined />}
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      )}

      <Flex gap={8} style={{ marginLeft: 'auto' }}>
        <CancelBtn />
        <OkBtn />
      </Flex>
    </Flex>
  );

  // Set isOpen & Fill knowledgeLvl data
  useEffect(() => {
    setIsOpen(!!editedPhraseData);
    setKnowledgeLvl(convertToKnowledgeLvl(editedPhraseData?.knowledgeLvl));
  }, [editedPhraseData]);

  // setIsPhraseEditModalOpen
  useEffect(() => {
    if (setIsPhraseEditModalOpen) setIsPhraseEditModalOpen(!!editedPhraseData);

    return () => {
      if (setIsPhraseEditModalOpen) setIsPhraseEditModalOpen(false);
    };
  }, [editedPhraseData, setIsPhraseEditModalOpen]);

  // First once validate form
  useEffect(() => {
    if (!isEdit) return;
    validateForm();
  }, [isEdit, validateForm]);

  // Focus to first field
  useEffect(() => {
    setTimeout(() => {
      firstInputRef?.current?.focus({ cursor: 'all' });
    }, 0);
  }, []);

  return (
    <Modal
      open={isOpen}
      title={title}
      cancelText="Cancel"
      onCancel={onThisModalCancel}
      okText={isEdit ? 'Save' : 'Add'}
      onOk={onThisModalSave}
      okButtonProps={{
        disabled: !isFormValid,
      }}
      footer={getModalFooter}
      maskClosable={false}
      destroyOnClose
      centered
    >
      {isEdit && (
        <Text type="secondary" style={{ display: 'block', marginTop: -8 }}>
          Added {dayjs(editedPhraseData?.createDate).format(DATE_FORMAT)}
        </Text>
      )}

      <Form
        form={form}
        initialValues={initialValues}
        style={{ marginTop: '16px' }}
        onValuesChange={validateForm}
      >
        <Form.Item
          name="first"
          rules={[
            { required: true, message: 'Please enter a phrase' },
            { pattern: /\S+/g, message: 'Phrase cannot contain only whitespace or newlines' },
          ]}
          style={{ marginBottom: '12px' }}
          validateFirst
        >
          <TextArea rows={1} placeholder="First phrase" ref={firstInputRef} autoSize />
        </Form.Item>

        <Form.Item name="firstD">
          <TextArea placeholder="Description" autoSize />
        </Form.Item>

        <Form.Item
          name="second"
          rules={[
            { required: true, message: 'Please enter a phrase' },
            { pattern: /\S+/g, message: 'Phrase cannot contain only whitespace or newlines' },
          ]}
          style={{ marginBottom: '12px' }}
          validateFirst
        >
          <TextArea rows={1} placeholder="Second phrase" autoSize />
        </Form.Item>

        <Form.Item name="secondD">
          <TextArea placeholder="Description" autoSize />
        </Form.Item>

        {isEdit && (
          <Form.Item>
            <Flex gap="middle">
              <span>Memorization level:</span>
              <Rate
                count={9}
                value={knowledgeLvl}
                character={<CheckCircleOutlined />}
                onChange={(value: number) => setKnowledgeLvl(value)}
              />
            </Flex>
          </Form.Item>
        )}

        <Form.Item name="tags">
          <Select
            mode="multiple"
            allowClear={false}
            style={{ width: '100%' }}
            placeholder="Tags"
            options={TAGS}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
