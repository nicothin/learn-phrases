import {
  createContext,
  useState,
  useMemo,
  useEffect,
  Dispatch,
  SetStateAction,
  ReactNode,
  FC,
} from 'react';

type StateContextType = {
  isTabActive: boolean;
  isPhraseEditModalOpen: boolean;
  setIsPhraseEditModalOpen: Dispatch<SetStateAction<boolean>>;
};

const StateContext = createContext<StateContextType | null>(null);

export const StateContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isTabActive, setIsTabActive] = useState(true);
  const [isPhraseEditModalOpen, setIsPhraseEditModalOpen] = useState(false);

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
      isPhraseEditModalOpen,
      setIsPhraseEditModalOpen,
    }),
    [isTabActive, isPhraseEditModalOpen],
  );

  return <StateContext.Provider value={contextValue}>{children}</StateContext.Provider>;
};

export default StateContext;
