import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import './Loader.scss';

const Loader = () => {
  return (
    <div className="loader">
      <Spin
        indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
        className="edit-area__load"
      />
    </div>
  );
};

export default Loader;
