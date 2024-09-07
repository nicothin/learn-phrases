import { ReactNode, useEffect, useState } from 'react';

import './useImportFromJSON.css';

import { Phrase } from '../../types';
import { getAllPhrasesFromAllPhrasesDTO } from '../../services';
import { useActionsContext } from '../useActionsContext';
import { Modal } from '../../components/Modal/Modal';
import { InputText } from '../../components/InputText/InputText';

type ImportFromJSONResult = {
  importFromJSONContent: ReactNode | null;
};

export const useImportFromJSON = (): ImportFromJSONResult => {
  const { allPhrases, isImportFromJSONOpen, setIsImportFromJSONOpen, setPhrasesToResolveConflicts } =
    useActionsContext();

  const [isError, setIsError] = useState(true);
  const [lastExistingId, setLastExistingId] = useState<number>(0);
  const [messageText, setMessageText] = useState<string>('');
  const [correctPhrases, setCorrectPhrases] = useState<Partial<Phrase>[]>([]);

  const exampleData = [
    [lastExistingId + 1, 'Première phrase.', '', 'First phrase.', ''],
    [lastExistingId + 2, 'Deuxième phrase.', '', 'Second phrase.', ''],
  ];
  const exampleString = JSON.stringify(exampleData)
    .replace('[[', '[\n[')
    .replace('],[', '],\n[')
    .replace(']]', ']\n]');

  const onCancel = () => {
    setIsError(true);
    setMessageText('');
    setCorrectPhrases([]);
    setIsImportFromJSONOpen(false);
  };

  const onSave = () => {
    setIsError(true);
    setMessageText('');
    setCorrectPhrases([]);
    setIsImportFromJSONOpen(false);
    setPhrasesToResolveConflicts(correctPhrases);
  };

  const onTextChange = (text: string) => {
    try {
      const parsedText = JSON.parse(text);
      setIsError(false);
      const phrasesData = getAllPhrasesFromAllPhrasesDTO(parsedText);
      setMessageText(`Correct phrases found after parsing: ${phrasesData.phrases.length}`);
      setCorrectPhrases(phrasesData.phrases);
    } catch (error) {
      setIsError(true);
      if (error instanceof SyntaxError) {
        setMessageText(error.message);
      } else {
        setMessageText(`Unknown error: ${error}`);
      }
      console.error(error);
    }
  };

  useEffect(() => setLastExistingId(allPhrases?.[0]?.id ?? 0), [allPhrases]);

  return {
    importFromJSONContent: isImportFromJSONOpen ? (
      <Modal contentClassName="import-from-json" onCloseThisModal={onCancel} isOpen isHuge>
        <div className="import-from-json__header">
          <div className="import-from-json__header-content  title">
            <p className="title__text">
              Import from <a href="https://en.wikipedia.org/wiki/JSON">JSON</a>
            </p>
            <div className="title__description-wrapper">
              <p>
                Paste here a valid JSON with an array of tuples. Each tuple is: <br />
                <code>
                  [id, "phrase to learn", "description (can be empty)", "translation of phrase", "description
                  (can be empty)"]
                </code>
              </p>
            </div>
          </div>
        </div>

        <div className="import-from-json__wrapper">
          <div className="import-from-json__input-wrapper">
            <InputText
              name="json"
              className="import-from-json__input"
              initialValue={exampleString}
              onChange={onTextChange}
              isStandart
            />
          </div>
          <div
            className={`import-from-json__validate-msg ${isError ? 'import-from-json__validate-msg--error' : ''}`}
          >
            {messageText}
          </div>
        </div>

        <div className="import-from-json__footer">
          <button type="button" className="btn btn--secondary" onClick={onCancel}>
            Cancel
          </button>
          <div className="resolver__primary-btn">
            <button
              type="button"
              className="btn"
              onClick={onSave}
              disabled={isError || !correctPhrases.length}
            >
              Import
            </button>
          </div>
        </div>
      </Modal>
    ) : null,
  };
};
