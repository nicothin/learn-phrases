import { useContext } from 'react';

import MainContext from '../contexts/MainContext';

export const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error('useMainContext must be used within a MainContextProvider()');
  }
  return context;
};
