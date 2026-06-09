import { useState, useCallback } from 'react';
import type { ExamplePhrase } from '../../types';
import { savePhrase, deletePhrase } from '../../services/store/mutations';
import { useUIStore } from '../../services/store/uiStore';
import { notification, NOTIFICATION_TYPE } from '../../services/notification';

interface FormErrors {
  text?: string;
  translation?: string;
}

interface UseExamplePhraseFormResult {
  formData: Partial<ExamplePhrase>;
  errors: FormErrors;
  isSubmitting: boolean;
  isDeleting: boolean;
  isValid: boolean;
  handleFieldChange: <K extends keyof ExamplePhrase>(field: K, value: ExamplePhrase[K]) => void;
  handleSave: () => Promise<void>;
  handleDelete: () => Promise<void>;
}

export function useExamplePhraseForm(initial: Partial<ExamplePhrase>): UseExamplePhraseFormResult {
  const [formData, setFormData] = useState<Partial<ExamplePhrase>>(() => initial);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isValid = !!formData.text?.trim() && !!formData.translation?.trim();

  const isEditing = 'id' in initial && !!initial.id;
  const initialId = ('id' in initial ? initial.id : undefined) as string | undefined;

  const handleFieldChange = useCallback(
    <K extends keyof ExamplePhrase>(field: K, value: ExamplePhrase[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (field === 'text' || field === 'translation') {
          const next = { ...prev };
          delete next[field as keyof FormErrors];
          return next;
        }
        return prev;
      });
    },
    [],
  );

  const handleSave = useCallback(async () => {
    const newErrors: FormErrors = {};

    if (!formData.text?.trim()) {
      newErrors.text = 'Required';
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
      const phrase: ExamplePhrase = {
        id: isEditing ? initialId! : crypto.randomUUID(),
        text: formData.text!.trim(),
        translation: formData.translation!.trim(),
        textDescription: formData.textDescription?.trim() || undefined,
        translationDescription: formData.translationDescription?.trim() || undefined,
        lastShownTimestamp: isEditing ? formData.lastShownTimestamp : undefined,
      };

      await savePhrase(phrase);
      notification.add({
        text: isEditing ? 'Phrase updated' : 'Phrase added',
        type: NOTIFICATION_TYPE.SUCCESS,
      });
      useUIStore.getState().setEditablePhrase(null);
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
      await deletePhrase(initialId);
      notification.add({
        text: 'Phrase deleted',
        type: NOTIFICATION_TYPE.SUCCESS,
      });
      useUIStore.getState().setEditablePhrase(null);
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