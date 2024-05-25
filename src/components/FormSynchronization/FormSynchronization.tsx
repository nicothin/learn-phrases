import { useState } from 'react';
import { Button, Checkbox, Form, Input, Typography } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { NotificationInstance } from 'antd/es/notification/interface';

import { SETTING_KEYS } from '../../enums';
import { validateNoWhitespaceField } from '../../utils';
import { FieldData } from '../../types';
import { useSettingsContext } from '../../hooks/useSettingsContext';

const { Text } = Typography;

interface FormSynchronizationProps {
  notificationApi: NotificationInstance;
}

export default function FormSynchronization({ notificationApi }: FormSynchronizationProps) {
  const [settingsForm] = useForm();

  const { token, setToken, gistId, setGistId, isSyncWhen100percent, setIsSyncWhen100percent } =
    useSettingsContext();

  const [disabledSaveSyncSettings, setDisabledSaveSyncSettings] = useState(true);

  const onSyncFieldsChange = (_: unknown, allFields: FieldData[]) => {
    const hasErrors = !!Object.entries(allFields).filter(
      ([, fieldValue]) => fieldValue.errors && fieldValue.errors.length > 0,
    ).length;
    setDisabledSaveSyncSettings(hasErrors);
  };

  const onSyncSettingsSave = (values: Record<string, string>) => {
    Promise.all([
      setToken(values[SETTING_KEYS.TOKEN]),
      setGistId(values[SETTING_KEYS.GIST_ID]),
      setIsSyncWhen100percent(!!values[SETTING_KEYS.SYNC_WHEN_100_PERCENT]),
    ]).then(() => {
      notificationApi.success({
        message: 'Gist settings saved',
      });
    });
  };

  // prettier-ignore

  return (
    <Form
      form={settingsForm}
      layout="vertical"
      initialValues={{
        [SETTING_KEYS.TOKEN]: token,
        [SETTING_KEYS.GIST_ID]: gistId,
        [SETTING_KEYS.SYNC_WHEN_100_PERCENT]: isSyncWhen100percent,
      }}
      onFinish={onSyncSettingsSave}
      onFieldsChange={onSyncFieldsChange}
    >

      <Form.Item label="Token">
        <Form.Item name={SETTING_KEYS.TOKEN} rules={[{ validator: validateNoWhitespaceField }]} noStyle>
          <Input placeholder="ghp_..." />
        </Form.Item>
        <Text type="secondary">
          Gist is a service from <a href="https://github.com/">github</a> for storing small sets of files with a history of changes. It's free.
          <br />
          You can read about tokens <a href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens">here</a>. This project stores your token ONLY in your browser. The token is used only for requests to gist.github.com.
          <br />
          You can create your own token <a href="https://github.com/settings/tokens">here</a> (the token must allow to work with gists).
        </Text>
      </Form.Item>

      <Form.Item label="Gist ID">
        <p style={{ marginTop: 0 }}><a href="https://gist.github.com/" target="_blank">Create a new gist</a> with file <code>phrases.json</code> and use it to synchronization.</p>
        <Form.Item name={SETTING_KEYS.GIST_ID} rules={[{ validator: validateNoWhitespaceField }]} noStyle>
          <Input />
        </Form.Item>
        <Text type="secondary">
          This can be copied from the gist's URL.
          <br />
          For example, if the URL is <code>https://gist.github.com/nicothin/ad14d17a04eec0d1217309e54f7c312e</code>, then the ID is <code>ad14d17a04eec0d1217309e54f7c312e</code>
        </Text>
      </Form.Item>

      <Form.Item name={SETTING_KEYS.SYNC_WHEN_100_PERCENT} valuePropName="checked">
        <Checkbox>Synchronization with gist when 100% viewing of unlearned phrases is reached (backup to file first).</Checkbox>
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" disabled={disabledSaveSyncSettings}>
          Save sync settings
        </Button>
      </Form.Item>
    </Form>
  );
}
