import { useContext } from 'react';

import ActionsContext from '../contexts/ActionsContext';

export const useActionsContext = () => {
  const context = useContext(ActionsContext);
  if (!context) {
    throw new Error('useActionsContext must be used within a ActionsContextProvider()');
  }
  return context;
};
