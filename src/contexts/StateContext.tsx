import React, { createContext, useState, useMemo, useEffect } from 'react';

type StateContextType = {
  isTabActive: boolean;
};

const StateContext = createContext<StateContextType | null>(null);

export const StateContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isTabActive, setIsTabActive] = useState(true);

  useEffect(() => {
    const onFocus = () => {
      setIsTabActive(true);
    };
    const onBlur = () => {
      setIsTabActive(false);
    };

    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);

    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      isTabActive,
    }),
    [isTabActive],
  );

  return <StateContext.Provider value={contextValue}>{children}</StateContext.Provider>;
};

export default StateContext;
