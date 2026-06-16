# JSON Validation

Parses and validates a JSON file imported by the user. Sanitises each record (trims strings, assigns defaults, generates missing UUIDs), filters invalid references, and returns validated `ExportData` together with an error log.

## Usage

```ts
import { validateJson } from './validateJson';

const result = validateJson(fileContent);

if (result.data) {
  // result.data.meanings, result.data.phrases are safe to use
} else {
  // result.log contains parsing errors
}

// Log items have { type: 'error' | 'warn', text: string }
for (const entry of result.log) {
  console[entry.type === 'error' ? 'error' : 'warn'](entry.text);
}
```

## API

### `validateJson(text: string): JsonValidationResult`

| Field | Type | Description |
|---|---|---|
| `data` | `ExportData \| null` | Validated + sanitised data, or `null` if JSON is unparseable |
| `log` | `Log[]` | Array of `{ type, text }` entries — warnings about fixed fields, errors for skipped items |
