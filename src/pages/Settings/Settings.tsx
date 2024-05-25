import { notification } from 'antd';

import FormSynchronization from '../../components/FormSynchronization/FormSynchronization';
import FormPreferredTheme from '../../components/FormPreferredTheme/FormPreferredTheme';
import FormTags from '../../components/FormTags/FormTags';

export default function Settings() {
  const [notificationApi, contextNotification] = notification.useNotification();

  // prettier-ignore

  return (
    <>
      <h1>Settings</h1>

      <h2>Synchronization</h2>

      <p>
        This is a serverless project. By default, all added words/phrases are saved in the browser storage. But you can specify data for accessing <a href="https://gist.github.com/" rel="noreferrer">gist</a> and then the data will be periodically saved to it.
      </p>

      <FormSynchronization notificationApi={notificationApi} />

      <h2>Tags</h2>

      <FormTags notificationApi={notificationApi} />

      <h2>Visual</h2>

      <FormPreferredTheme />

      {contextNotification}
    </>
  );
}
