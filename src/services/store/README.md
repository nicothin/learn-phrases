# Store

In-memory кэш всех сущностей, гидратируется из IDB при старте приложения.

## Чтение

```tsx
import { useStore } from '../../services/store';

// Все смыслы
const meanings = useStore(s => s.meanings);

// Конкретный смысл
const meaning = useStore(s => s.getMeaningById(id));

// Фразы конкретного смысла
const meaning = useStore(s => s.getMeaningById(meaningId));
const phrases = meaning?.exampleIds.map(id => useStore.getState().getPhraseById(id)).filter(Boolean);

// Флаг гидрации
const isHydrated = useStore(s => s.isHydrated);
```

## Мутации

Мутации пишут в IDB и синхронно обновляют store.

```ts
import { saveMeaning, deleteMeaning, savePhrase, deletePhrase } from '../../services/store/mutations';
```

### Создание смысла с фразой-примером

```ts
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
```

### Удаление смысла

```ts
await deleteMeaning(meaningId);
```

## Гидрация

Вызывается в корне приложения через `useHydrate()`. Пока данные не загружены — `isHydrated === false`.

```tsx
import { useHydrate } from '../../hooks/useHydrate';

function App() {
  const isHydrated = useHydrate();
  if (!isHydrated) return <Spinner />;
  // ...
}
```
