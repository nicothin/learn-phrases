import type { ExportData, Log } from '../../types';

export interface JsonValidationResult {
  data: ExportData | null;
  log: Log[];
}
