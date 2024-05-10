import { useState } from 'react';
import { Button, Form, Input, Radio, RadioChangeEvent, Space, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';

import { SETTING_KEYS, THEME } from '../../enums';
import { validateNoWhitespaceField } from '../../utils';
import { useSettingsContext } from '../../hooks/useSettingsContext';

const { Text } = Typography;

interface FieldData {
  // value?: string;
  errors?: string[];
}

export default function Settings() {
  const [form] = useForm();

  const { token, setToken, gistId, setGistId, preferredTheme, setPreferredTheme } =
    useSettingsContext();

  const [disabledSaveSyncSettings, setDisabledSaveSyncSettings] = useState(true);
  const [preferredThemeRadioValue, setPreferredThemeRadioValue] = useState(preferredTheme);

  const onFieldsChange = (_: FieldData[], allFields: FieldData[]) => {
    const hasErrors = !!Object.entries(allFields).filter(
      ([, fieldValue]) => fieldValue.errors && fieldValue.errors.length > 0,
    ).length;
    setDisabledSaveSyncSettings(hasErrors);
  };

  const onSettingsSave = (values: Record<string, string>) => {
    setToken(values[SETTING_KEYS.TOKEN]);
    setGistId(values[SETTING_KEYS.GIST_ID]);
  };

  const onPreferredThemeChange = (e: RadioChangeEvent) => {
    setPreferredTheme(e.target.value);
    setPreferredThemeRadioValue(e.target.value);
  };

  // prettier-ignore

  return (
    <>
      <h1>Settings</h1>

      <h2>Synchronization with gist</h2>

      <p>
        This is a serverless project. By default, all added words/phrases are saved in the browser storage. But you can specify data for accessing <a href="https://gist.github.com/" rel="noreferrer">gist</a> and then the data will be periodically saved to it.
      </p>

      <Form
        form={form}
        layout="vertical"
        initialValues={{
          [SETTING_KEYS.TOKEN]: token,
          [SETTING_KEYS.GIST_ID]: gistId,
        }}
        onFinish={onSettingsSave}
        onFieldsChange={onFieldsChange}
      >

        <Form.Item label="Token">
          <Form.Item name={SETTING_KEYS.TOKEN} rules={[{ validator: validateNoWhitespaceField }]} noStyle>
            <Input placeholder="ghp_..." />
          </Form.Item>
          <Text type="secondary">
            Gist is a service from <a href="https://github.com/">github</a> for storing small sets of files with a history of changes. It's free.
            <br />
            You can read about tokens <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens">here</a>. This project stores your token ONLY in your browser. The token is used only for gistrequests. You can check it out in <a href="https://github.com/nicothin/learnphrases2">this project's repository</a>.
            <br />
            You can create your own token <a href="https://github.com/settings/tokens">here</a> (the token must allow to work with gists).
          </Text>
        </Form.Item>

        <Form.Item label="Gist ID">
          <Form.Item name={SETTING_KEYS.GIST_ID} rules={[{ validator: validateNoWhitespaceField }]} noStyle>
            <Input />
          </Form.Item>
          <Text type="secondary">
            This can be copied from the gist's URL.
            <br />
            For example, if the URL is <code>https://gist.github.com/nicothin/ad14d17a04eec0d1217309e54f7c312e</code>, then the ID is <code>ad14d17a04eec0d1217309e54f7c312e</code>
          </Text>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" disabled={disabledSaveSyncSettings}>
            Save sync settings
          </Button>
        </Form.Item>
      </Form>

      <h2>Visual</h2>

      <Form layout="vertical">
        <Form.Item label="Preferred Theme" valuePropName="checked">
          <Radio.Group value={preferredThemeRadioValue} onChange={onPreferredThemeChange}>
            <Space >
              <Radio value={THEME.LIGHT}>Light</Radio>
              <Radio value={THEME.DARK}>Dark</Radio>
              <Radio value={undefined}>None (system theme)</Radio>
            </Space>
          </Radio.Group>
        </Form.Item>
      </Form>
    </>
  );
}
