interface GetAllRecordsParams {
  dbName: string;
  version: number;
  tableName: string;
  sortedBy?: string;
}

export function getAllRecords<T>(params: GetAllRecordsParams): Promise<T[]> {
  const { dbName, version, tableName, sortedBy } = params;
  let db: IDBDatabase | null = null;

  return new Promise<T[]>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onsuccess = (event) => {
      const openIDBRequestEventTarget = event.target as IDBOpenDBRequest;
      db = openIDBRequestEventTarget.result;

      const transaction = db.transaction(tableName, 'readonly');
      const objectStore = transaction.objectStore(tableName);

      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = () => {
        const allRecords = getAllRequest.result as T[];

        if (sortedBy) {
          allRecords.sort((a, b) => {
            const recordA = a as Record<string, unknown>;
            const recordB = b as Record<string, unknown>;

            const valueA = recordA[sortedBy];
            const valueB = recordB[sortedBy];

            if (typeof valueA === 'number' && typeof valueB === 'number') {
              return valueB - valueA;
            } else if (!valueA && !valueB) {
              return 0;
            } else if (typeof valueA === 'string' && typeof valueB === 'string') {
              return valueA.localeCompare(valueB);
            } else {
              return 0;
            }
          });
        }

        resolve(allRecords);
      };

      getAllRequest.onerror = (event) => {
        const getAllRequestEventTarget = event.target as IDBRequest;
        const error = getAllRequestEventTarget.error?.message;
        reject(new Error(`IDB: Error: ${error}`));
      };
    };

    request.onerror = (event) => {
      const eventTarget = event.target as IDBOpenDBRequest;
      const error = eventTarget.error?.message;
      reject(new Error(`IDB: Error getting all objects: ${error}`));
    };
  });
}
