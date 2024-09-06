import { useEffect, useMemo, useState } from 'react';

import './Admin.css';
import '../../assets/btn.css';

import { UserSettings } from '../../types';
import { useActionsContext, useNotificationContext, useEditPhrase } from '../../hooks';
import { PhrasesTable } from '../../components/PhrasesTable/PhrasesTable';
import { ImportButton } from '../../components/ImportButton/ImportButton';
import { Pagination } from '../../components/Pagination/Pagination';
import { ExportButton } from '../../components/ExportButton/ExportButton';
import { Confirm } from '../../components/Confirm/Confirm';
import { InputText } from '../../components/InputText/InputText';
import { DropButton } from '../../components/DropButton/DropButton';
import { ExportToGist } from '../../components/ExportToGist/ExportToGist';
import { ImportFromGist } from '../../components/ImportFromGist/ImportFromGist';

const PHRASES_PER_PAGE = 50;
const SEARCH_MIN_LENGTH = 3;
const MAIN_USER_ID = 1;

export default function Admin() {
  const { allPhrases, exportPhrasesDTOToFile, deleteAllPhrases, allSettings } = useActionsContext();
  const { addNotification } = useNotificationContext();
  const { editPhraseContent, startEditingPhrase } = useEditPhrase();

  const [isConfirmDeleteAllPhrasesOpen, setIsConfirmDeleteAllPhrasesOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [shownPhrasesCounter, setShownPhrasesCounter] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [thisUserSettings, setThisUserSettings] = useState<UserSettings | undefined>(undefined);

  const thereArePhrases = !!allPhrases?.length;
  const canTrySyncToGist = !!(thisUserSettings?.token && thisUserSettings?.gistId);

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const onEditPhrase = (phraseId: number) => {
    const phrase = allPhrases.find(({ id }) => id === phraseId) || {}
    startEditingPhrase(phrase);
  };

  const onDeleteAllPhrases = () => {
    setIsConfirmDeleteAllPhrasesOpen(true);
  };

  const onConfirmDeleteAllPhrases = () => {
    exportPhrasesDTOToFile()
      .then((result) => {
        addNotification(result);
        deleteAllPhrases()
          .then((result) => addNotification(result))
          .catch((result) => addNotification(result));
      })
      .catch((result) => addNotification(result));
    setIsConfirmDeleteAllPhrasesOpen(false);
  };

  const onCancelDeleteAllPhrases = () => {
    setIsConfirmDeleteAllPhrasesOpen(false);
  };

  const shownPhrases = useMemo(() => {
    if (!allPhrases.length) return [];

    if (searchString.length < SEARCH_MIN_LENGTH) {
      setShownPhrasesCounter(allPhrases.length);
      return allPhrases.slice((currentPage - 1) * PHRASES_PER_PAGE, currentPage * PHRASES_PER_PAGE);
    }

    const actualPhrases = allPhrases.filter((phrase) =>
      String(phrase.id) === searchString ||
      phrase.first.toLowerCase().includes(searchString) ||
      phrase.second.toLowerCase().includes(searchString)
    );

    setShownPhrasesCounter(actualPhrases.length);

    return actualPhrases.slice((currentPage - 1) * PHRASES_PER_PAGE, currentPage * PHRASES_PER_PAGE);
  }, [allPhrases, currentPage, searchString]);

  // Set shown phrases at the first load
  useEffect(() => {
    setShownPhrasesCounter(allPhrases.length)
  }, [allPhrases.length]);

  // Set actual user settings
  useEffect(() => {
    const thisMainUserData: UserSettings | undefined = allSettings?.find(
      (item) => item.userId === MAIN_USER_ID
    );
    setThisUserSettings(thisMainUserData);
  }, [allSettings]);

  return (
    <div className="admin">
      <div className="admin__sup-table">
        <InputText
          key="searchInput"
          className="admin__search"
          placeholder="Search (3+ characters)"
          name="search"
          onChange={(value) => setSearchString(value.toLowerCase())}
        />
        <div className="admin__to-right">
          {thereArePhrases && (
            <Pagination
              totalItems={shownPhrasesCounter}
              itemsPerPage={PHRASES_PER_PAGE}
              changePage={onPageChange}
            />
          )}
        </div>
      </div>

      <div className="admin__phrase-table">
        <PhrasesTable
          phrases={shownPhrases}
          onRowClick={onEditPhrase}
          noPhrasesMessage={
            searchString.length
              ? 'No phrases found'
              : <>
                There are no phrases here yet.
                <br />
                It's time <button type="button" className="link" onClick={() => startEditingPhrase({})}>
                  to add a few
                </button>.
              </>
          }
        />
      </div>

      <div className="admin__sub-table">
        Phrases counter: {allPhrases.length}
      </div>

      {canTrySyncToGist && (
        <ImportFromGist
          className="admin__btn  btn-circle"
          classNameLoading="btn-circle--loading"
          style={{ right: '2em', bottom: '18em' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
            <use xlinkHref="#download" />
          </svg>
        </ImportFromGist>
      )}

      {canTrySyncToGist && (
        <ExportToGist
          className="admin__btn  btn-circle"
          classNameLoading="btn-circle--loading"
          style={{ right: '2em', bottom: '14em' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
            <use xlinkHref="#upload" />
          </svg>
        </ExportToGist>
      )}

      {thereArePhrases && (
        <button
          className="admin__btn  btn-circle"
          style={{ right: '2em', bottom: '10em' }}
          onClick={onDeleteAllPhrases}
          title="Delete ALL phrases"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
            <use xlinkHref="#trash" />
          </svg>
        </button>
      )}

      <div className="admin__btn" style={{ right: '2em', bottom: '6em' }}>
        <DropButton
          className=""
          buttonContent={(
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
              <path d="m4 10-3 3 3 3h1v-2h12v-2H5v-2zM13 2v2H1v2h12v2h1l3-3-3-3Z"/>
            </svg>
          )}
          buttonClassName="btn-circle"
          direction="left-top"
          title="Import / Export phrases"
        >
          <ul className="menu">
            <li><ImportButton className="btn  btn--secondary  btn--sm" /></li>
            {thereArePhrases && (
              <li><ExportButton className="btn  btn--secondary  btn--sm" /></li>
            )}
          </ul>
        </DropButton>
      </div>

      <button
        className="admin__btn  btn-circle  btn-circle--accent"
        style={{ right: '2em', bottom: '2em' }}
        onClick={() => startEditingPhrase({})}
        title="Add phrase"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18">
          <use xlinkHref="#plus" />
        </svg>
      </button>

      {editPhraseContent}

      <Confirm
        isOpen={isConfirmDeleteAllPhrasesOpen}
        title="Are you sure you want to delete all phrases?"
        message={(
          <>
            <p>This action is irreversible.</p>
            <p>The backup copy will be saved to a file first.</p>
          </>
        )}
        confirmButtonText="Yes, delete all local phrases"
        onConfirm={onConfirmDeleteAllPhrases}
        onCancel={onCancelDeleteAllPhrases}
      />
    </div>
  );
}
