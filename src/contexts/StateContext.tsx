import { createContext, useState, useMemo, Dispatch, SetStateAction, ReactNode, FC } from 'react';

type StateContextType = {
  isPhraseEditModalOpen: boolean;
  setIsPhraseEditModalOpen: Dispatch<SetStateAction<boolean>>;
};

const StateContext = createContext<StateContextType | null>(null);

export const StateContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isPhraseEditModalOpen, setIsPhraseEditModalOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      isPhraseEditModalOpen,
      setIsPhraseEditModalOpen,
    }),
    [isPhraseEditModalOpen],
  );

  return <StateContext.Provider value={contextValue}>{children}</StateContext.Provider>;
};

export default StateContext;
