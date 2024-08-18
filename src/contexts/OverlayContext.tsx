import { createContext, ReactNode, FC, useMemo } from 'react';
import { message, Modal, notification } from 'antd';
import { NotificationInstance } from 'antd/es/notification/interface';
import { HookAPI } from 'antd/es/modal/useModal';
import { MessageInstance } from 'antd/es/message/interface';

interface OverlayContextType {
  notificationApi: NotificationInstance;
  contextNotification: React.ReactElement;
  modalApi: HookAPI;
  contextModal: React.ReactElement;
  messageApi: MessageInstance;
  contextMessage: React.ReactElement;
}

const OverlayContext = createContext<OverlayContextType | null>(null);

export const OverlayContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [notificationApi, contextNotification] = notification.useNotification();
  const [modalApi, contextModal] = Modal.useModal();
  const [messageApi, contextMessage] = message.useMessage();

  const contextValue = useMemo(
    () => ({
      notificationApi,
      contextNotification,
      modalApi,
      contextModal,
      messageApi,
      contextMessage,
    }),
    [contextModal, contextNotification, modalApi, notificationApi, messageApi, contextMessage],
  );

  return <OverlayContext.Provider value={contextValue}>{children}</OverlayContext.Provider>;
};

export default OverlayContext;
