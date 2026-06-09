import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  Button,
  InputText,
  DatePicker,
  Confirm,
  type InputTextHandle,
} from '@shared/components';
import { useUIStore } from '../../services/store/uiStore';
import { useExamplePhraseForm } from './useExamplePhraseForm';

import './ExamplePhraseFormModal.css';

export function ExamplePhraseFormModal() {
  const textRef = useRef<InputTextHandle>(null);
  const editablePhrase = useUIStore((s) => s.editablePhrase);
  const setEditablePhrase = useUIStore((s) => s.setEditablePhrase);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (editablePhrase) {
      textRef.current?.focus();
    }
  }, [editablePhrase]);

  const {
    formData,
    errors,
    isSubmitting,
    isDeleting,
    isValid,
    handleFieldChange,
    handleSave,
    handleDelete,
  } = useExamplePhraseForm(editablePhrase ?? {});

  const isEditing = !!editablePhrase?.id;

  const handleClose = useCallback(() => {
    setEditablePhrase(null);
  }, [setEditablePhrase]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    handleDelete();
  };

  const actions = useMemo(
    () => (
      <>
        {isEditing && (
          <Button className="example-phrase-form-modal__delete-btn" variant="danger" onClick={handleDeleteClick} disabled={isDeleting}>
            Delete
          </Button>
        )}
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSubmitting || !isValid}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </>
    ),
    [isEditing, handleDeleteClick, isDeleting, handleClose, handleSave, isSubmitting, isValid],
  );

  return (
    <>
      <Modal isOpen onClose={handleClose} actions={actions} title={isEditing ? 'Edit Phrase' : 'Add Phrase'}>
        <div className="example-phrase-form-modal__fields">
          <InputText
            ref={textRef}
            name="text"
            size="lg"
            value={formData.text ?? ''}
            onChange={(value) => handleFieldChange('text', value)}
            errorMessage={errors.text}
            placeholder="Phrase text"
            required
          />

          <InputText
            name="textDescription"
            value={formData.textDescription ?? ''}
            onChange={(value) => handleFieldChange('textDescription', value)}
            placeholder="Text description (optional)"
          />

          <InputText
            name="translation"
            size="lg"
            value={formData.translation ?? ''}
            onChange={(value) => handleFieldChange('translation', value)}
            errorMessage={errors.translation}
            placeholder="Translation"
            required
          />

          <InputText
            name="translationDescription"
            value={formData.translationDescription ?? ''}
            onChange={(value) => handleFieldChange('translationDescription', value)}
            placeholder="Translation description (optional)"
          />

          {isEditing && (
            <DatePicker
              name="lastShownTimestamp"
              label="Last shown"
              value={formData.lastShownTimestamp}
              onChange={(value) => handleFieldChange('lastShownTimestamp', value as number)}
              placeholder="Date"
            />
          )}
        </div>
      </Modal>

      <Confirm
        isOpen={showDeleteConfirm}
        title="Delete this phrase?"
        message={`Are you sure?`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
