import { useState } from 'react';
import { Form, Radio, RadioChangeEvent, Space } from 'antd';

import { THEME } from '../../enums';
import { useSettingsContext } from '../../hooks/useSettingsContext';

export default function FormPreferredTheme() {
  const { preferredTheme, setPreferredTheme } = useSettingsContext();

  const [preferredThemeRadioValue, setPreferredThemeRadioValue] = useState(preferredTheme);

  const onPreferredThemeChange = (e: RadioChangeEvent) => {
    setPreferredTheme(e.target.value);
    setPreferredThemeRadioValue(e.target.value);
  };

  return (
    <Form layout="vertical">
      <Form.Item label="Preferred Theme" valuePropName="checked">
        <Radio.Group value={preferredThemeRadioValue} onChange={onPreferredThemeChange}>
          <Space>
            <Radio value={THEME.LIGHT}>Light</Radio>
            <Radio value={THEME.DARK}>Dark</Radio>
            <Radio value={undefined}>None (system theme)</Radio>
          </Space>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
}
