import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

export default function Loader() {
  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 666,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        className="edit-area__load"
      />
    </div>
  );
}
