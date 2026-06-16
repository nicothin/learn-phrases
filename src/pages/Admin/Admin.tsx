import { useState, useRef } from 'react';
import { useStore } from '../../services/store';
import { useUIStore } from '../../services/store/uiStore';
import { deletePhrase, saveMeaning, savePhrase } from '../../services/store/mutations';
import { MeaningCard } from '../../components/MeaningCard/MeaningCard';
import { ExamplePhraseCard } from '../../components/ExamplePhraseCard/ExamplePhraseCard';
import { AddEntityButton } from './components/AddEntityButton';
import { Button, InputText, Icon, Pagination, Confirm } from '@shared/components';
import { exportDB } from '../../services/fileService';
import { validateJson } from '../../services/jsonValidation';
import { notification, NOTIFICATION_TYPE } from '../../services/notification';
import type { ExamplePhrase } from '../../types';
import type { ExportData } from '../../types';
import { findExistingMeaning } from '../../components/ImportModal/importParser';
import type { ImportConflict } from '../../components/ImportModal/importParser';
import { formatTimestamp } from '../../services/fileService/helpers/formatTimestamp';

import './Admin.css';

const MODE_MEANINGS = 'meanings';
const MODE_PHRASES = 'phrases';
const PAGE_SIZE = 49;

const GRID_TEMPLATE_MEANINGS = 'repeat(auto-fill, minmax(240px, 1fr))';
const GRID_TEMPLATE_PHRASES = 'repeat(auto-fill, minmax(360px, 1fr))';

type Mode = typeof MODE_MEANINGS | typeof MODE_PHRASES;

const downloadBackup = () => {
  const { meanings, phrases } = useStore.getState();

  const data: ExportData = {
    meta: { version: 'backup' },
    meanings: Object.values(meanings),
    phrases: Object.values(phrases),
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const filename = `learn-phrases_${formatTimestamp(new Date())}_backup_before_import.json`;

  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();

  URL.revokeObjectURL(url);
};

export function Admin() {
  const meanings = useStore((s) => s.meanings);
  const phrases = useStore((s) => s.phrases);
  const setEditableMeaning = useUIStore((s) => s.setEditableMeaning);
  const setEditablePhrase = useUIStore((s) => s.setEditablePhrase);
  const setImportModalOpen = useUIStore((s) => s.setImportModalOpen);

  const [mode, setMode] = useState<Mode>(MODE_MEANINGS);
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [orphanConfirmOpen, setOrphanConfirmOpen] = useState(false);
  const [orphanPhrases, setOrphanPhrases] = useState<ExamplePhrase[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (mode === MODE_PHRASES) {
      setEditablePhrase({});
    } else {
      setImportModalOpen(true);
    }
  };

  const handleImportFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = validateJson(text);

      if (!result.data) {
        for (const log of result.log) {
          notification.add({
            text: log.message,
            type: NOTIFICATION_TYPE.ERROR,
            description: log.details,
          });
        }
        return;
      }

      await downloadBackup();

      const storeMeanings = useStore.getState().meanings;
      const conflicts: ImportConflict[] = [];

      for (const incoming of result.data.meanings) {
        const existing = findExistingMeaning({ meanings: storeMeanings, lemma: incoming.lemma, pos: incoming.pos });

        if (existing) {
          conflicts.push({
            existing,
            incoming: {
              lemma: incoming.lemma,
              translation: incoming.translation,
              pos: incoming.pos,
              cefrLevel: incoming.cefrLevel,
              examples: [],
            },
          });
        }

        await saveMeaning(incoming);
      }

      for (const phrase of result.data.phrases) {
        await savePhrase(phrase);
      }

      const { meanings, phrases } = result.data;

      if (result.log.length > 0) {
        notification.add({
          text: `Imported ${meanings.length} meaning(s) and ${phrases.length} phrase(s) with ${result.log.length} error(s).`,
          type: NOTIFICATION_TYPE.SUCCESS,
        });
        for (const log of result.log) {
          notification.add({
            text: log.message,
            type: NOTIFICATION_TYPE.ERROR,
            description: log.details,
          });
        }
      } else {
        notification.add({
          text: `Imported ${meanings.length} meaning(s) and ${phrases.length} phrase(s).`,
          type: NOTIFICATION_TYPE.SUCCESS,
        });
      }

      if (conflicts.length > 0) {
        console.warn('Import conflicts:', conflicts);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      notification.add({
        text: 'File read error',
        type: NOTIFICATION_TYPE.ERROR,
        description: message,
      });
    }

    e.target.value = '';
  };

  const handleToggle = () => {
    setMode((prev) => (prev === MODE_MEANINGS ? MODE_PHRASES : MODE_MEANINGS));
    setFilter('');
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setCurrentPage(1);
  };

  const handleOrphanCleanup = () => {
    const allMeaningPhraseIds = new Set(
      Object.values(meanings).flatMap((m) => m.exampleIds),
    );

    const orphaned = Object.values(phrases).filter(
      (p) => !allMeaningPhraseIds.has(p.id),
    );

    setOrphanPhrases(orphaned);
    setOrphanConfirmOpen(true);
  };

  const handleOrphanDeleteConfirm = async () => {
    await Promise.all(orphanPhrases.map((p) => deletePhrase(p.id)));
    setOrphanConfirmOpen(false);
    setOrphanPhrases([]);
  };

  const filteredMeanings = mode === MODE_MEANINGS
    ? Object.values(meanings).filter((m) =>
        filter.length >= 3
          ? m.lemma.toLowerCase().includes(filter.toLowerCase()) ||
            m.translation.toLowerCase().includes(filter.toLowerCase())
          : true,
      )
    : [];

  const filteredPhrases = mode === MODE_PHRASES
    ? Object.values(phrases).filter((p) =>
        filter.length >= 3
          ? p.text.toLowerCase().includes(filter.toLowerCase()) ||
            p.translation.toLowerCase().includes(filter.toLowerCase())
          : true,
      )
    : [];

  const paginatedMeanings = filteredMeanings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const paginatedPhrases = filteredPhrases.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const totalCount = mode === MODE_PHRASES
    ? Object.keys(phrases).length
    : Object.keys(meanings).length;

  const totalPages = Math.max(
    1,
    Math.ceil(
      (mode === MODE_PHRASES ? filteredPhrases : filteredMeanings).length / PAGE_SIZE,
    ),
  );

  return (
    <div className="admin">
      <div className="admin__header">
        <Button variant="secondary" onClick={handleToggle}>
          {mode === MODE_PHRASES ? 'Show meanings' : 'Show phrases'}
        </Button>
        <InputText
          className="admin__filter"
          name="filter"
          placeholder={mode === MODE_PHRASES ? 'Search phrases…' : 'Search meanings…'}
          value={filter}
          onChange={handleFilterChange}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      <div className="admin__actions">
        {mode === MODE_PHRASES && (
          <Button circle variant="secondary" onClick={handleOrphanCleanup} aria-label="Delete orphan phrases" title="Delete orphan phrases">
            <Icon name="trash" />
          </Button>
        )}
        <Button circle variant="secondary" onClick={exportDB} aria-label="Export DB" title="Export All">
          <Icon name="export" />
        </Button>
        <Button circle variant="secondary" onClick={handleImportFile} aria-label="Import from file" title="Import from file">
          <Icon name="import" />
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileSelected}
        />
        <AddEntityButton
          onClick={handleAdd}
          label={mode === MODE_MEANINGS ? 'Add meaning' : 'Add phrase'}
        />
      </div>

      {mode === MODE_PHRASES ? (
        <div className="admin__grid" style={{ gridTemplateColumns: GRID_TEMPLATE_PHRASES }}>
          {paginatedPhrases.map((phrase) => (
            <ExamplePhraseCard
              key={phrase.id}
              phrase={phrase}
              onClick={() => setEditablePhrase(phrase)}
            />
          ))}
        </div>
      ) : (
        <div className="admin__grid" style={{ gridTemplateColumns: GRID_TEMPLATE_MEANINGS }}>
          {paginatedMeanings.map((meaning) => (
            <MeaningCard
              key={meaning.id}
              meaning={meaning}
              onClick={() => setEditableMeaning(meaning)}
            />
          ))}
        </div>
      )}

      <div className="admin__footer">
        Items: {totalCount}
      </div>

      <Confirm
        isOpen={orphanConfirmOpen}
        title="Delete orphan phrases?"
        message={
          orphanPhrases.length > 0 ? (
            <ul>
              {orphanPhrases.map((p) => (
                <li key={p.id}>{p.text} — {p.translation}</li>
              ))}
            </ul>
          ) : (
            'No orphan phrases found.'
          )
        }
        confirmText={orphanPhrases.length > 0 ? 'Delete' : 'Close'}
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleOrphanDeleteConfirm}
        onCancel={() => {
          setOrphanConfirmOpen(false);
          setOrphanPhrases([]);
        }}
      />
    </div>
  );
}
