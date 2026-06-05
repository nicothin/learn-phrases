import { useState, useCallback, useRef } from 'react';
import { Modal, Button } from '@shared/components';
import { useUIStore } from '../../services/store/uiStore';
import { parseImportText } from './importParser';
import { saveMeaning, savePhrase } from '../../services/store/mutations';
import { notification, NOTIFICATION_TYPE } from '../../services/notification';
import type { Meaning, ExamplePhrase } from '../../types';

import './ImportModal.css';

function buildErrorText(errors: { blockIndex: number; error: string; rawText: string }[]): string {
  return errors
    .map((e) => `# Block ${e.blockIndex + 1}: ${e.error}\n${e.rawText}`)
    .join('\n\n');
}

export function ImportModal() {
  const setImportModalOpen = useUIStore((s) => s.setImportModalOpen);
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleClose = useCallback(() => {
    setImportModalOpen(false);
  }, [setImportModalOpen]);

  const handleImport = useCallback(async () => {
    const { meanings, errors } = parseImportText(text);

    if (errors.length > 0) {
      const importedCount = meanings.length;

      if (importedCount > 0) {
        setIsSubmitting(true);
        try {
          for (const m of meanings) {
            const phraseIds: string[] = [];

            for (const ex of m.examples) {
              const phrase: ExamplePhrase = {
                id: crypto.randomUUID(),
                text: ex.text,
                translation: ex.translation,
              };
              await savePhrase(phrase);
              phraseIds.push(phrase.id);
            }

            const meaning: Meaning = {
              id: crypto.randomUUID(),
              lemma: m.lemma,
              translation: m.translation,
              pos: m.pos,
              cefrLevel: m.cefrLevel,
              exampleIds: phraseIds,
              knowledgeLvl: 1,
              showAfterTimestamp: Date.now(),
            };
            await saveMeaning(meaning);
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          notification.add({
            text: 'Save error',
            type: NOTIFICATION_TYPE.ERROR,
            description: message,
          });
          setIsSubmitting(false);
          return;
        }
        setIsSubmitting(false);
      }

      setText(buildErrorText(errors));

      notification.add({
        text: `${importedCount} meaning(s) imported. ${errors.length} block(s) with errors shown above.`,
        type: NOTIFICATION_TYPE.SUCCESS,
      });

      if (textareaRef.current) {
        textareaRef.current.focus();
      }

      return;
    }

    setIsSubmitting(true);

    try {
      for (const m of meanings) {
        const phraseIds: string[] = [];

        for (const ex of m.examples) {
          const phrase: ExamplePhrase = {
            id: crypto.randomUUID(),
            text: ex.text,
            translation: ex.translation,
          };
          await savePhrase(phrase);
          phraseIds.push(phrase.id);
        }

        const meaning: Meaning = {
          id: crypto.randomUUID(),
          lemma: m.lemma,
          translation: m.translation,
          pos: m.pos,
          cefrLevel: m.cefrLevel,
          exampleIds: phraseIds,
          knowledgeLvl: 1,
          showAfterTimestamp: Date.now(),
        };
        await saveMeaning(meaning);
      }

      notification.add({
        text: `${meanings.length} meaning(s) imported successfully.`,
        type: NOTIFICATION_TYPE.SUCCESS,
      });

      setImportModalOpen(false);
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
  }, [text, setImportModalOpen]);

  const actions = (
    <>
      <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
        Close
      </Button>
      <Button onClick={handleImport} disabled={isSubmitting}>
        {isSubmitting ? 'Importing...' : 'Import'}
      </Button>
    </>
  );

  return (
    <Modal isOpen onClose={handleClose} className="import-modal" actions={actions} title="Add Meanings">
      <textarea
        ref={textareaRef}
        className="import-modal__textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`lemma\ntranslation\npos|cefrLevel\nexample phrase --- translation\n\nlemma\ntranslation\npos|cefrLevel\nexample phrase --- translation`}
        rows={15}
      />
    </Modal>
  );
}
