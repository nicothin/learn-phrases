# File Service

Exports application data (meanings, phrases, settings) from the zustand store to a downloadable JSON file.

## Usage

```ts
import { exportDB, getExportJson } from './exportFile';

// Downloads learn-phrases_<timestamp>.json
exportDB();

// Get JSON string without triggering download
const json = getExportJson();
```

## API

| Function | Returns | Description |
|---|---|---|
| `exportDB()` | `void` | Serialises current store state and triggers a browser download |
| `getExportJson()` | `string` | Returns `ExportData` as a JSON string (no download) |
