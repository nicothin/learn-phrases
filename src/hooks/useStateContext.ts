import { useContext } from 'react';

import StateContext from '../contexts/StateContext';

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useStateContext must be used within a StateContextProvider()');
  }
  return context;
};
