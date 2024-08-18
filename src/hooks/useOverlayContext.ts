import { useContext } from 'react';

import OverlayContext from '../contexts/OverlayContext';

export const useOverlayContext = () => {
  const context = useContext(OverlayContext);
  if (!context) {
    throw new Error('useOverlayContext must be used within a OverlayContextProvider()');
  }
  return context;
};
