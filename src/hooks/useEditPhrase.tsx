import { ReactNode, useState } from 'react';

import { Phrase } from '../types';
import { Modal } from '../components/Modal/Modal';
import { EditPhraseForm } from '../components/EditPhraseForm/EditPhraseForm';

type EditPhraseResult = {
  editPhraseContent: ReactNode | null;
  isEditPhraseModalOpen: boolean;
  startEditingPhrase: (phrase: Partial<Phrase>) => void;
};

export const useEditPhrase = (): EditPhraseResult => {
  const [isEditPhraseModalOpen, setIsEditPhraseModalOpen] = useState(false);
  const [editedPhrase, setEditedPhrase] = useState<Partial<Phrase>>({});

  const startEditingPhrase = (phrase: Partial<Phrase>) => {
    setEditedPhrase(phrase);
    setIsEditPhraseModalOpen(true);
  };

  const stopEditingPhrase = () => {
    setIsEditPhraseModalOpen(false);
    setEditedPhrase({});
  };

  return {
    editPhraseContent: isEditPhraseModalOpen
      ? (
        <Modal isOpen={isEditPhraseModalOpen} onCloseThisModal={stopEditingPhrase}>
          <EditPhraseForm phrase={editedPhrase} onCancel={stopEditingPhrase} />
        </Modal>
      )
      : null,
    isEditPhraseModalOpen,
    startEditingPhrase,
  };
};
