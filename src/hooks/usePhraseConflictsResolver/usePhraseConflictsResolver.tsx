import { ReactNode, useCallback, useEffect, useState } from 'react';

import './usePhraseConflictsResolver.css';

import { Conflict, Phrase, UserSettings } from '../../types';
import { STATUS } from '../../enums';
import { arePhrasesDifferent } from '../../utils';
import { useMainContext } from '../useMainContext';
import { useNotificationContext } from '../useNotificationContext';
import { getClass, getTextWithBreaks } from './utils';
import { Modal } from '../../components/Modal/Modal';
import { Rating } from '../../components/Rating/Rating';
import { ExportToFileButton } from '../../components/ExportToFileButton/ExportToFileButton';

type PhraseConflictsResolverResult = {
  phraseConflictsResolverContent: ReactNode | null;
  isPhraseConflictsResolverOpen: boolean;
};

const MAIN_USER_ID = 1;

export const usePhraseConflictsResolver = (): PhraseConflictsResolverResult => {
  const {
    allPhrases,
    addPhrases,
    phrasesToResolveConflicts,
    setPhrasesToResolveConflicts,
    allSettings,
    exportPhrasesDTOToGist,
  } = useMainContext();
  const { addNotification } = useNotificationContext();

  const [conflicts, setConflicts] = useState<Conflict[]>([]);

  const onCancel = useCallback(() => {
    setPhrasesToResolveConflicts([]);
    setConflicts([]);
  }, [setPhrasesToResolveConflicts]);

  const importAllPhrasesAndResetStatesAndExportToGist = useCallback(
    (phrases: Partial<Phrase>[]) => {
      addPhrases(phrases)
        .then((result) => {
          addNotification(result);

          setPhrasesToResolveConflicts([]);
          setConflicts([]);

          const thisMainUserData: UserSettings | undefined = allSettings?.find(
            (item) => item.userId === MAIN_USER_ID,
          );

          if (thisMainUserData?.token && thisMainUserData?.gistId) {
            exportPhrasesDTOToGist(MAIN_USER_ID)
              .then((result) => addNotification(result))
              .catch((result) => addNotification(result));
          }
        })
        .catch((result) => addNotification(result))
        .finally(() => onCancel());
    },
    [
      addNotification,
      addPhrases,
      allSettings,
      exportPhrasesDTOToGist,
      onCancel,
      setPhrasesToResolveConflicts,
    ],
  );

  const onSelectOption = (id: Conflict['incomingPhrase']['id'], isIncomingSelected: boolean) => {
    setConflicts((prev) =>
      prev.map((item) => (item.incomingPhrase.id === id ? { ...item, isIncomingSelected } : item)),
    );
  };

  const onSelectAll = (isIncomingSelected: boolean) => {
    setConflicts((prev) => prev.map((item) => ({ ...item, isIncomingSelected: isIncomingSelected })));
  };

  const onSaveSelected = () => {
    const resolvedPhrases: Partial<Phrase>[] = [];

    conflicts.forEach((conflict) => {
      if (conflict.isIncomingSelected) {
        resolvedPhrases.push(conflict.incomingPhrase);
      } else if (conflict.existingPhrase) {
        resolvedPhrases.push(conflict.existingPhrase);
      }
    });

    importAllPhrasesAndResetStatesAndExportToGist(resolvedPhrases);
  };

  // Search for conflicts between incoming and existing phrases
  useEffect(() => {
    if (!phrasesToResolveConflicts.length) {
      setConflicts([]);
      return;
    }

    if (phrasesToResolveConflicts.length && !allPhrases.length) {
      importAllPhrasesAndResetStatesAndExportToGist(phrasesToResolveConflicts);
      return;
    }

    const lastExistingId = allPhrases?.[0].id;

    let counter = 0;

    phrasesToResolveConflicts.forEach((incomingPhrase) => {
      if (!incomingPhrase.id || incomingPhrase.id > lastExistingId) {
        counter++;
        return;
      }

      const existingPhrase = allPhrases.find((phrase) => phrase.id === incomingPhrase.id);

      if (!existingPhrase) {
        setConflicts((prev) => [
          ...prev,
          { incomingPhrase, existingPhrase, differentFields: [], isIncomingSelected: false },
        ]);
        counter++;
        return;
      }

      const differentFields = arePhrasesDifferent(incomingPhrase, existingPhrase);

      if (differentFields?.length) {
        setConflicts((prev) => [
          ...prev,
          { incomingPhrase, existingPhrase, differentFields, isIncomingSelected: true },
        ]);
        counter++;
      }
    });

    if (phrasesToResolveConflicts.length && counter === 0) {
      addNotification({
        text: 'No phrases added.',
        description: 'There are no new or different phrases in the imported data.',
        type: STATUS.SUCCESS,
        duration: 3000,
      });
      onCancel();
    }
  }, [
    allPhrases,
    phrasesToResolveConflicts,
    setPhrasesToResolveConflicts,
    addNotification,
    importAllPhrasesAndResetStatesAndExportToGist,
    onCancel,
  ]);

  return {
    phraseConflictsResolverContent: conflicts?.length ? (
      <Modal contentClassName="resolver" isOpen isHuge isNonClosable>
        <div className="resolver__header">
          <div className="title">
            <p className="title__text">Which options to keep?</p>
            <div className="title__description-wrapper">
              <p>
                Some imported phrases conflict with existing ones. Conflicting filds are highlighted. Select
                which option to save.
              </p>
            </div>
          </div>

          <p className="resolver__item resolver__item--header">
            <span className="resolver__item-data resolver__item-data--incoming">Incoming</span>
            <span className="resolver__item-data resolver__item-data--existing">Local</span>
          </p>
        </div>

        <div className="resolver__wrapper">
          {conflicts.map((conflict) => (
            <div className="resolver__item" key={crypto.randomUUID()}>
              <button
                type="button"
                onClick={() => onSelectOption(conflict.incomingPhrase.id, true)}
                className={`resolver__item-data resolver__item-data--incoming ${conflict.isIncomingSelected ? 'resolver__item-data--selected' : ''}`}
              >
                <span className="resolver__item-id">
                  <span className="text-secondary">ID: {conflict.incomingPhrase.id}</span>
                </span>
                <span className={getClass(conflict, 'first')}>
                  {getTextWithBreaks(conflict.incomingPhrase.first)}
                </span>
                <span className={getClass(conflict, 'firstD')}>
                  {getTextWithBreaks(conflict.incomingPhrase.firstD)}
                </span>
                <span className={getClass(conflict, 'second')}>
                  {getTextWithBreaks(conflict.incomingPhrase.second)}
                </span>
                <span className={getClass(conflict, 'secondD')}>
                  {getTextWithBreaks(conflict.incomingPhrase.secondD)}
                </span>
                <span className={getClass(conflict, 'knowledgeLvl')}>
                  <Rating level={conflict.incomingPhrase.knowledgeLvl} isSmall />
                </span>
              </button>
              <button
                type="button"
                onClick={() => onSelectOption(conflict.incomingPhrase.id, false)}
                className={`resolver__item-data resolver__item-data--existing ${!conflict.isIncomingSelected ? 'resolver__item-data--selected' : ''} ${!conflict.existingPhrase ? 'resolver__item-data--empty' : ''}`}
              >
                {conflict.existingPhrase ? (
                  <>
                    <span className="resolver__item-id">
                      <span className="text-secondary">ID: {conflict.existingPhrase.id}</span>
                    </span>
                    <span className={getClass(conflict, 'first')}>
                      {getTextWithBreaks(conflict.existingPhrase.first)}
                    </span>
                    <span className={getClass(conflict, 'firstD')}>
                      {getTextWithBreaks(conflict.existingPhrase.firstD)}
                    </span>
                    <span className={getClass(conflict, 'second')}>
                      {getTextWithBreaks(conflict.existingPhrase.second)}
                    </span>
                    <span className={getClass(conflict, 'secondD')}>
                      {getTextWithBreaks(conflict.existingPhrase.secondD)}
                    </span>
                    <span className={getClass(conflict, 'knowledgeLvl')}>
                      <Rating level={conflict.existingPhrase.knowledgeLvl} isSmall />
                    </span>
                  </>
                ) : (
                  <span className="resolver__item-empty  text-secondary">Missing locally. Don't save.</span>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="resolver__footer">
          <button type="button" className="btn btn--secondary" onClick={() => onSelectAll(true)}>
            Select all incoming
          </button>
          <button type="button" className="btn btn--secondary" onClick={() => onSelectAll(false)}>
            Select all existing
          </button>
          <ExportToFileButton className="btn btn--secondary">
            Export existing phrases to file
          </ExportToFileButton>
          <div className="resolver__primary-btn">
            <button type="button" className="btn btn--secondary" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="btn" onClick={onSaveSelected}>
              Save selected
            </button>
          </div>
        </div>
      </Modal>
    ) : null,
    isPhraseConflictsResolverOpen: !!conflicts?.length,
  };
};
