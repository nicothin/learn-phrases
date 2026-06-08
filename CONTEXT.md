# Learn Phrases

Application for learning English words using spaced repetition. Users add words with translations and systematically review them.

## Language

**Meaning**:
An individual sense/translation of a word. One word can have multiple meanings (e.g. "run" → "бежать" and "run" → "управлять").
_Avoid_: Definition, Sense

**Meaning identity**:
Two Meanings are the same when both `lemma` and `pos` match. `translation` is not part of identity — it may contain multiple comma-separated variants and varies across imports.

**Example**:
A phrase illustrating the usage of a specific meaning in context.

**Lemma**:
Canonical base form of a word (nominative case for nouns, infinitive for verbs, etc.). Stored in the `lemma` field.

**Interval**:
Time period between reviews. Expressed in days. Each knowledge level (1–8) has its own interval.

**Level, knowledgeLvl**:
A number from 1 to 8 indicating how well the user knows a given word meaning. The higher the level, the less frequent the review.

**Review**:
The moment a word meaning is shown to the user. Controlled by the algorithm via the `showAfterTimestamp` field — the meaning is shown only when the current time >= this timestamp.

**CEFR Level**:
Language proficiency level per the Common European Framework of Reference: A1, A2, B1, B2, C1, C2. Assigned to each Meaning.

**Session**:
A set of 42 LearningItems (meaning + phrase) assembled by the selection algorithm for one learning cycle. Page refresh = new session.

## Tag

Reusable tag/badge component (`src/shared/components/Tag/`). Renders an inline pill. Props:

- `onClick` — tag becomes a `<button>` (text renders as `<button className="tag__text">`)
- `onClose` — shows a close button (`<button className="tag__close">`, absolutely positioned, overlays right padding)
- `disabled` — disables all buttons, dims tag

Used to display metadata like CEFR level, POS labels, or filters. Import from `@shared/components`.

## Relationships

- A meaning has 0+ examples.
- An example can be used for multiple meanings.
- An example may potentially exist without belonging to any meaning.

## Persistence

IndexedDB (IDB) is the single source of truth. Versioned. On app startup, the DB version is checked and a migration runs if needed.

**Tables:**
- `meanings` (keyPath: `id`) — word meanings
- `phrases` (keyPath: `id`) — example phrases
- `settings` (keyPath: `id`) — user settings, single record with fixed key `user_settings`

**Zustand store** (`useStore`) — in-memory cache, hydrated from IDB on startup (`useHydrate`). Stores:
- `meanings`, `phrases` — `Record<string, T>`, O(1) access by id
- `settings` — `UserSettings` object (defaults applied on first launch)
- `updateSettings(partial)` — writes to IDB and synchronously updates the store
- `getMeaningById(id)` / `getPhraseById(id)` — selectors for entity access

Mutations for meanings/phrases: `saveMeaning` / `deleteMeaning` / `savePhrase` / `deletePhrase` write to IDB and synchronously update the store.

**Repositories** (`src/services/db/*Repo.ts`) — abstraction layer over IDB. Each repository handles one table: `meaningRepo`, `phraseRepo`, `settingsRepo`. The store uses repositories instead of accessing `connection` directly.
