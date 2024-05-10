import { FloatButton } from 'antd';
import {
  CaretRightOutlined,
  EditOutlined,
  MenuUnfoldOutlined,
  QuestionOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

import { getFloatButtonPositionStyle } from '../../utils';

export default function MainMenu() {
  return (
    <FloatButton.Group
      trigger="hover"
      style={getFloatButtonPositionStyle([0, 0], { isLeft: true })}
      icon={<MenuUnfoldOutlined />}
    >
      <Link to="/settings" style={{ display: 'block', marginBottom: 16 }}>
        <FloatButton icon={<SettingOutlined />} tooltip="Your settings" />
      </Link>
      <Link to="/about" style={{ display: 'block', marginBottom: 16 }}>
        <FloatButton icon={<QuestionOutlined />} tooltip="About this project" />
      </Link>
      <Link to="/admin" style={{ display: 'block', marginBottom: 16 }}>
        <FloatButton icon={<EditOutlined />} tooltip="Edit phrases" />
      </Link>
      <Link to="/" style={{ display: 'block', marginBottom: 16 }}>
        <FloatButton icon={<CaretRightOutlined />} tooltip="Learn phrases" />
      </Link>
    </FloatButton.Group>
  );
}
