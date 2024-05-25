import { useEffect, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { NotificationInstance } from 'antd/es/notification/interface';

import { SETTING_KEYS } from '../../enums';
import { TAGS_JSON_STRING } from '../../constants';
import { useSettingsContext } from '../../hooks';
import { FieldData } from '../../types';
import { arrayToString, validateJSON } from '../../utils';

const { TextArea } = Input;

interface FormTagsProps {
  notificationApi: NotificationInstance;
}

export default function FormTags({ notificationApi }: FormTagsProps) {
  const [tagsForm] = useForm();

  const { tags, setTags } = useSettingsContext();

  const [disabledSaveTags, setDisabledSaveTags] = useState(true);

  const onClickFillTagsField = () => {
    tagsForm.setFieldsValue({ [SETTING_KEYS.TAGS]: TAGS_JSON_STRING });
    setDisabledSaveTags(false);
  };

  const onTagsChange = (_: unknown, allFields: FieldData[]) => {
    const hasErrors = !!Object.entries(allFields).filter(
      ([, fieldValue]) => fieldValue.errors && fieldValue.errors.length > 0,
    ).length;
    setDisabledSaveTags(hasErrors);
  };

  const onTagsSave = (values: Record<string, string>) => {
    const newTags = JSON.parse(values[SETTING_KEYS.TAGS]);
    setTags(newTags)
      .then(() => {
        notificationApi.success({
          message: 'Tags saved',
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

  useEffect(() => {
    tagsForm.setFieldsValue({ [SETTING_KEYS.TAGS]: arrayToString(tags) });
  }, [tags, tagsForm]);

  // prettier-ignore

  return (
    <>
      <p style={{ marginTop: 0 }}>
        You can specify a set of tags and their colors in <a href="https://www.google.com/search?q=json+syntax" target="_blank">JSON</a> format. In the simplest case: <code>[]</code>.
        <br />
        The set of tags is collected from tags found in phrases and tags additionally specified in this field. As long as at least one phrase has a tag, it will always be in the list of phrases.
      </p>
      <p>
        The <code>value</code> field must be specified, the <code>color</code> field can be omitted.
        <br />
        For example:
      </p>
      <pre>
          {`[
  { "value": "Positive", "color": "green" },
  { "value": "Вопрос", "color": "orange" },
  { "value": "否定", "color": "red" },
]`}
      </pre>

      <p>
        <Button type="dashed" onClick={onClickFillTagsField}>Fill in the field with tags for English</Button>
      </p>

      <Form
        form={tagsForm}
        layout="vertical"
        onFinish={onTagsSave}
        onFieldsChange={onTagsChange}
      >
        <Form.Item
          name={SETTING_KEYS.TAGS}
          rules={[{ validator: validateJSON }]}
          validateFirst
        >
          <TextArea
            rows={4}
            placeholder="JSON"
            style={{ fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace' }}
            autoSize
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={disabledSaveTags}>
            Save tags
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
