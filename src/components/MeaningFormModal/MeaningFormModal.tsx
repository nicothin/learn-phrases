import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  Modal,
  Button,
  InputText,
  RadioButtons,
  Rating,
  DatePicker,
  Confirm,
  MultiSelect,
  type InputTextHandle,
} from '@shared/components';
import { useUIStore } from '../../services/store/uiStore';
import { useStore } from '../../services/store';
import { useMeaningForm } from './useMeaningForm';
import { POS_LABELS } from '../../constants';
import type { Meaning, PartOfSpeech } from '../../types';

import './MeaningFormModal.css';

const POS_OPTIONS = (Object.keys(POS_LABELS) as PartOfSpeech[]).map((value) => ({
  value,
  label: POS_LABELS[value],
}));

const CEFR_OPTIONS = [
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
  { value: 'C1', label: 'C1' },
  { value: 'C2', label: 'C2' },
];

export function MeaningFormModal() {
  const lemmaRef = useRef<InputTextHandle>(null);
  const editableMeaning = useUIStore((s) => s.editableMeaning);
  const setEditableMeaning = useUIStore((s) => s.setEditableMeaning);
  const setEditablePhrase = useUIStore((s) => s.setEditablePhrase);
  const phrases = useStore((s) => s.phrases);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEditing = !!editableMeaning?.id;

  const phraseOptions = useMemo(
    () =>
      Object.values(phrases).map((p) => ({
        value: p.id,
        label: p.text,
        description: p.translation,
      })),
    [phrases],
  );

  // Auto-focus the first field when modal opens
  useEffect(() => {
    if (editableMeaning) {
      lemmaRef.current?.focus();
    }
  }, [editableMeaning]);

  const {
    formData,
    errors,
    isSubmitting,
    isDeleting,
    isValid,
    handleFieldChange,
    handleSave,
    handleDelete,
  } = useMeaningForm(editableMeaning ?? {});

  const handleClose = useCallback(() => {
    setEditableMeaning(null);
  }, [setEditableMeaning]);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    handleDelete();
  };

  const handleTagClick = useCallback((phraseId: string) => {
    const phrase = phrases[phraseId];
    if (phrase) {
      setEditablePhrase(phrase);
    }
  }, [phrases, setEditablePhrase]);

  const actions = useMemo(
    () => (
      <>
        {isEditing && (
          <Button variant="danger" className="modal__actions-right-item" onClick={handleDeleteClick} disabled={isDeleting}>
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
    [isEditing, handleDeleteClick, isDeleting, handleClose, handleSave, isSubmitting, isValid]
  );

  return (
    <>
      <Modal isOpen onClose={handleClose} actions={actions} title={isEditing ? 'Edit Meaning' : 'Add Meaning'}>

        <div className="meaning-form-modal__fields">
          <InputText
            ref={lemmaRef}
            name="lemma"
            size="lg"
            value={formData.lemma ?? ''}
            onChange={(value) => handleFieldChange('lemma', value)}
            errorMessage={errors.lemma}
            placeholder="Meaning"
            required
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
            name="description"
            value={formData.description ?? ''}
            onChange={(value) => handleFieldChange('description', value)}
            placeholder="Description (optional)"
          />

          <RadioButtons
            name="pos"
            value={formData.pos ?? 'noun'}
            options={POS_OPTIONS}
            onChange={(value) => handleFieldChange('pos', value as Meaning['pos'])}
            cellWidth="100px"
          />

          <RadioButtons
            name="cefrLevel"
            value={formData.cefrLevel ?? 'A1'}
            options={CEFR_OPTIONS}
            onChange={(value) => handleFieldChange('cefrLevel', value as Meaning['cefrLevel'])}
            cellWidth="45px"
          />

          <div className="meaning-form-modal__row">
            <Rating
              label="Knowledge level"
              minLevel={1}
              maxLevel={8}
              level={formData.knowledgeLvl ?? 1}
              onChange={(value) => handleFieldChange('knowledgeLvl', value as Meaning['knowledgeLvl'])}
            />

            <DatePicker
              name="showAfterTimestamp"
              label="Show after"
              value={formData.showAfterTimestamp}
              onChange={(value) => handleFieldChange('showAfterTimestamp', value as number)}
              placeholder="Date"
            />
          </div>

          <MultiSelect
            name="exampleIds"
            label="Connected phrases"
            options={phraseOptions}
            value={formData.exampleIds ?? []}
            onChange={(value) => handleFieldChange('exampleIds', value)}
            onTagClick={handleTagClick}
            placeholder="Select phrases"
            initialInputValue={isEditing ? (editableMeaning?.lemma ?? '') : ''}
            searchThreshold={3}
            debounceMs={200}
            searchHint="min 3 characters"
            autoComplete="off"
          />

        </div>

      </Modal>

      <Confirm
        isOpen={showDeleteConfirm}
        title="Delete this meaning?"
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
