import { FormEvent, useEffect, useRef, useState } from 'react';

import '../../assets/btn.css';
import '../../assets/title.css';
import './EditPhraseForm.css';

import { Phrase } from '../../types';
import { formatDate } from '../../utils';
import { STATUS } from '../../enums';
import { useMainContext, useNotificationContext } from '../../hooks';
import { InputText, InputTextHandle } from '../InputText/InputText';
import { Rating } from '../Rating/Rating';
import { Confirm } from '../Confirm/Confirm';

interface EditPhraseFormProps {
  phrase?: Partial<Phrase>;
  onCancel?: () => void;
}

export function EditPhraseForm(data: EditPhraseFormProps) {
  const { phrase, onCancel } = data;

  const { addPhrases, deletePhrases } = useMainContext();
  const { addNotification } = useNotificationContext();

  const [nowPhrase, setNowPhrase] = useState<Partial<Phrase>>({});
  const [isConfirmDeletePhraseOpen, setIsConfirmDeletePhraseOpen] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const inputRef = useRef<InputTextHandle>(null);

  const isEdit = !!phrase?.id;

  const onPhraseFieldChange = (name: string, value: string | number) => {
    setNowPhrase((prev) => ({ ...prev, [name]: value }));
  };

  const onPutPhrase = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid) {
      addNotification({
        text: 'Please, fill all fields correctly.',
        type: STATUS.ERROR,
      });
      return;
    }

    addPhrases([nowPhrase])
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result));

    if (typeof onCancel === 'function') onCancel();
  };

  const onConfirmDeleteThisPhrase = (phrase: Partial<Phrase>) => {
    if (!phrase?.id) return;

    deletePhrases([phrase.id])
      .then((result) => addNotification(result))
      .catch((result) => addNotification(result));

    setNowPhrase({});

    if (typeof onCancel === 'function') onCancel();
  };

  // Fill actual state of form
  useEffect(() => {
    if (phrase) setNowPhrase(phrase);
  }, [phrase]);

  // Check validity of form
  useEffect(() => {
    setIsValid(!!(nowPhrase.first && nowPhrase.second));
  }, [nowPhrase]);

  // Focus to first field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <>
      <form className="edit-phrase-form" onSubmit={onPutPhrase}>
        <div className="edit-phrase-form__title-wrap  title">
          <p className="title__text">
            {phrase?.createDate ? 'Edit' : 'Add'} phrase
            {phrase?.createDate ? ` (ID: ${phrase.id})` : ''}
          </p>
          {phrase?.createDate && (
            <p className="text-secondary  title__sub-text">Added {formatDate(phrase.createDate)}</p>
          )}
        </div>

        <InputText
          ref={inputRef}
          key={`${phrase?.id}-first`}
          className="edit-phrase-form__item-main"
          placeholder="Phrase in native language (required)"
          name="first"
          initialValue={phrase?.first}
          errorMessage="This is a required field."
          size="lg"
          onChange={(value) => onPhraseFieldChange('first', value)}
          checkValidity={isEdit}
          required
        />
        <InputText
          key={`${phrase?.id}-firstD`}
          className="edit-phrase-form__item"
          placeholder="Description"
          name="firstD"
          initialValue={phrase?.firstD}
          onChange={(value) => onPhraseFieldChange('firstD', value)}
        />
        <InputText
          key={`${phrase?.id}-second`}
          className="edit-phrase-form__item-main"
          placeholder="Phrase in a foreign language (required)"
          name="second"
          initialValue={phrase?.second}
          errorMessage="This is a required field."
          size="lg"
          onChange={(value) => onPhraseFieldChange('second', value)}
          checkValidity={isEdit}
          required
        />
        <InputText
          key={`${phrase?.id}-secondD`}
          className="edit-phrase-form__item"
          placeholder="Description"
          name="secondD"
          initialValue={phrase?.secondD}
          onChange={(value) => onPhraseFieldChange('secondD', value)}
        />

        <div className="edit-phrase-form__memo">
          <span className="edit-phrase-form__memo-label">Memorization level:</span>
          <Rating
            key={`${phrase?.id}-lvl`}
            className="edit-phrase-form__memo-rating"
            level={phrase?.knowledgeLvl}
            onChange={(value) => onPhraseFieldChange('knowledgeLvl', value)}
          />
        </div>

        <div className="edit-phrase-form__footer">
          {isEdit && (
            <button
              type="button"
              className="btn  btn--danger"
              onClick={() => setIsConfirmDeletePhraseOpen(true)}
            >
              Delete phrase
            </button>
          )}

          <div className="edit-phrase-form__footer-main-btns">
            {onCancel && (
              <button type="button" className="btn  btn--secondary" onClick={onCancel}>
                Cancel
              </button>
            )}

            <button type="submit" className="btn" disabled={!isValid}>
              {isEdit ? 'Save phrase' : 'Add phrase'}
            </button>
          </div>
        </div>
      </form>

      <Confirm
        isOpen={isConfirmDeletePhraseOpen}
        title="Are you sure?"
        confirmButtonText="Yes, delete this phrases"
        onConfirm={() => onConfirmDeleteThisPhrase(nowPhrase)}
        onCancel={() => setIsConfirmDeletePhraseOpen(false)}
      />
    </>
  );
}
