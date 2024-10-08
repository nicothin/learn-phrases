interface GetAllRecordsParams {
  dbName: string;
  version: number;
  tableName: string;
  sortedBy?: string;
}

export function getAllRecords(params: GetAllRecordsParams): Promise<unknown> {
  const { dbName, version, tableName, sortedBy } = params;
  let db: IDBDatabase | null = null;

  return new Promise<unknown>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onsuccess = (event) => {
      const openIDBRequestEventTarget = event.target as IDBOpenDBRequest;
      db = openIDBRequestEventTarget.result;

      const transaction = db.transaction(tableName, 'readonly');
      const objectStore = transaction.objectStore(tableName);

      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = () => {
        const allRecords = getAllRequest.result;
        if (sortedBy) {
          allRecords.sort((a, b) => {
            const valueA = a[sortedBy];
            const valueB = b[sortedBy];
            if (typeof valueA === 'number' && typeof valueB === 'number') {
              return valueB - valueA;
            } else if (!valueA && !valueB) {
              return 0; // equal
            } else {
              return valueA.localeCompare(valueB);
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
