# Store

Three zustand stores providing global state: entity cache, learning session, and UI.

---

## `useStore` — entity cache

In-memory cache of all meanings, phrases, and settings, hydrated from IndexedDB on app startup.

### Reading

```tsx
import { useStore } from '../../services/store';

const meanings = useStore(s => s.meanings);
const meaning = useStore(s => s.getMeaningById(id));
const phrases = meaning?.exampleIds.map(id => useStore.getState().getPhraseById(id)).filter(Boolean);
const isHydrated = useStore(s => s.isHydrated);
```

### Mutations

Write to IDB and synchronously update the store.

```ts
import { saveMeaning, deleteMeaning, savePhrase, deletePhrase } from '../../services/store/mutations';

const phrase: ExamplePhrase = {
  id: crypto.randomUUID(),
  text: 'I love this',
  translation: 'Я люблю это',
  lastShownTimestamp: 0,
};

const meaning: Meaning = {
  id: crypto.randomUUID(),
  lemma: 'love',
  pos: 'verb',
  translation: 'любить',
  cefrLevel: 'A1',
  exampleIds: [phrase.id],
  knowledgeLvl: 1,
  showAfterTimestamp: Date.now(),
};

await savePhrase(phrase);
await saveMeaning(meaning);
await deleteMeaning(meaningId);
```

### Hydration

Called at the app root via `useHydrate()`. While loading — `isHydrated === false`.

```tsx
import { useHydrate } from '../../hooks/useHydrate';

function App() {
  const isHydrated = useHydrate();
  if (!isHydrated) return <Spinner />;
  // ...
}
```

---

## `useSessionStore` — learning session

```ts
import { useSessionStore } from '../../services/store/sessionStore';
```

| Method | Description |
|---|---|
| `generate()` | Build a new shuffled session from current store state |
| `refresh()` | Rebuild and shuffle the session |
| `markEvaluated(meaningId, result)` | Mark a meaning as `'correct'` / `'incorrect'` |
| `updatePhraseInSession(phrase)` | Sync updated phrase into session items |
| `updateMeaningInSession(meaning)` | Sync updated meaning into session items |
| `removeByMeaningId(meaningId)` | Remove items for a deleted meaning |
| `removeByPhraseId(phraseId)` | Remove items with the deleted phrase |
| `clear()` | Reset the session |

```tsx
const sessionId = useSessionStore(s => s.sessionId);
const items = useSessionStore(s => s.items);
const evaluatedMap = useSessionStore(s => s.evaluatedMap);

useSessionStore.getState().generate();
```

---

## `useUIStore` — UI state

```ts
import { useUIStore } from '../../services/store';
```

```tsx
const editableMeaning = useUIStore(s => s.editableMeaning);
const setEditableMeaning = useUIStore(s => s.setEditableMeaning);
const importModalOpen = useUIStore(s => s.importModalOpen);
const setImportModalOpen = useUIStore(s => s.setImportModalOpen);
```
