# DB — IndexedDB persistence layer

Opens a single IndexedDB database (`lp4`, version 1) with three object stores: `meanings`, `phrases`, `settings`. Provides low-level CRUD utilities and typed repositories for each entity.

## Usage

```ts
import { openDB, getDB, getAll, get, put, remove } from './connection';
import { getAllPhrases, savePhrase, deletePhrase } from './phraseRepo';
import { getAllMeanings, saveMeaning, deleteMeaning } from './meaningRepo';
import { getSettings, saveSettings } from './settingsRepo';
```

### Low-level

```ts
const db = await getDB();
const meanings = await getAll<Meaning>('meanings');
const meaning = await get<Meaning>('meanings', id);
await put('meanings', meaning);
await remove('meanings', id);
```

### Repositories

```ts
await savePhrase(phrase);
await deletePhrase(phraseId);
const phrases = await getAllPhrases();

await saveMeaning(meaning);
await deleteMeaning(meaningId);
const meanings = await getAllMeanings();

const settings = await getSettings();
await saveSettings({ theme: 'dark', ... });
```

## API

| Function | Returns | Description |
|---|---|---|
| `openDB()` | `Promise<IDBDatabase>` | Create/open connection |
| `getDB()` | `Promise<IDBDatabase>` | Lazy singleton connection |
| `getAll<T>(storeName)` | `Promise<T[]>` | Read all records |
| `get<T>(storeName, id)` | `Promise<T \| undefined>` | Read one record by id |
| `put<T>(storeName, value)` | `Promise<void>` | Insert or update |
| `remove(storeName, id)` | `Promise<void>` | Delete by id |
| `getAllPhrases()` | `Promise<ExamplePhrase[]>` | All phrases |
| `savePhrase(phrase)` | `Promise<void>` | Persist a phrase |
| `deletePhrase(id)` | `Promise<void>` | Delete a phrase |
| `getAllMeanings()` | `Promise<Meaning[]>` | All meanings |
| `saveMeaning(meaning)` | `Promise<void>` | Persist a meaning |
| `deleteMeaning(id)` | `Promise<void>` | Delete a meaning |
| `getSettings()` | `Promise<SettingsRecord \| undefined>` | User settings |
| `saveSettings(settings)` | `Promise<void>` | Persist settings |
