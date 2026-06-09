import { useState, useCallback } from 'react';
import type { Meaning } from '../../types';
import { saveMeaning, deleteMeaning } from '../../services/store/mutations';
import { useUIStore } from '../../services/store/uiStore';
import { notification, NOTIFICATION_TYPE } from '../../services/notification';

const DEFAULTS: Partial<Meaning> = {
  pos: 'noun',
  cefrLevel: 'A1',
  knowledgeLvl: 1,
  exampleIds: [],
};

interface FormErrors {
  lemma?: string;
  translation?: string;
}

interface UseMeaningFormResult {
  formData: Partial<Meaning>;
  errors: FormErrors;
  isSubmitting: boolean;
  isDeleting: boolean;
  isValid: boolean;
  handleFieldChange: <K extends keyof Meaning>(field: K, value: Meaning[K]) => void;
  handleSave: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function useMeaningForm(initial: Partial<Meaning>): UseMeaningFormResult {
  const [formData, setFormData] = useState<Partial<Meaning>>(() => ({
    ...DEFAULTS,
    ...initial,
  }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isValid = !!formData.lemma?.trim() && !!formData.translation?.trim();

  const isEditing = 'id' in initial && !!initial.id;
  const initialId = ('id' in initial ? initial.id : undefined) as string | undefined;

  const handleFieldChange = useCallback(<K extends keyof Meaning>(field: K, value: Meaning[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (field === 'lemma' || field === 'translation') {
        const next = { ...prev };
        delete next[field as keyof FormErrors];
        return next;
      }
      return prev;
    });
  }, []);

  const handleSave = useCallback(async () => {
    const newErrors: FormErrors = {};

    if (!formData.lemma?.trim()) {
      newErrors.lemma = 'Required';
    }

    if (!formData.translation?.trim()) {
      newErrors.translation = 'Required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const meaning: Meaning = {
        id: isEditing ? initialId! : crypto.randomUUID(),
        lemma: formData.lemma!.trim(),
        pos: formData.pos ?? DEFAULTS.pos!,
        translation: formData.translation!.trim(),
        description: formData.description?.trim() || undefined,
        cefrLevel: formData.cefrLevel ?? DEFAULTS.cefrLevel!,
        exampleIds: formData.exampleIds ?? DEFAULTS.exampleIds!,
        knowledgeLvl: formData.knowledgeLvl ?? DEFAULTS.knowledgeLvl!,
        showAfterTimestamp: formData.showAfterTimestamp ?? Date.now(),
      };

      await saveMeaning(meaning);
      notification.add({
        text: isEditing ? 'Meaning updated' : 'Meaning added',
        type: NOTIFICATION_TYPE.SUCCESS,
      });
      useUIStore.getState().setEditableMeaning(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      notification.add({
        text: 'Save error',
        type: NOTIFICATION_TYPE.ERROR,
        description: message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isEditing, initialId]);

  const handleDelete = useCallback(async () => {
    if (!isEditing || !initialId) return;

    setIsDeleting(true);

    try {
      await deleteMeaning(initialId);
      notification.add({
        text: 'Meaning deleted',
        type: NOTIFICATION_TYPE.SUCCESS,
      });
      useUIStore.getState().setEditableMeaning(null);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      notification.add({
        text: 'Delete error',
        type: NOTIFICATION_TYPE.ERROR,
        description: message,
      });
    } finally {
      setIsDeleting(false);
    }
  }, [isEditing, initialId]);

  return {
    formData,
    errors,
    isSubmitting,
    isDeleting,
    isValid,
    handleFieldChange,
    handleSave,
    handleDelete,
  };
}