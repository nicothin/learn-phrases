interface DeleteRecordsProps {
  dbName: string;
  version: number;
  tableName: string;
}

export function deleteAllRecords(params: DeleteRecordsProps): Promise<void> {
  const { dbName, version = 1, tableName } = params;
  let db: IDBDatabase | null = null;

  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onsuccess = (event) => {
      const openIDBRequestEventTarget = event.target as IDBOpenDBRequest;
      db = openIDBRequestEventTarget.result;

      const transaction = db.transaction(tableName, 'readwrite');
      const objectStore = transaction.objectStore(tableName);

      objectStore.clear();

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event) => {
        const transactionEventTarget = event.target as IDBTransaction;
        const error = transactionEventTarget.error?.message;
        reject(new Error(`IDB transaction failed: ${error}`));
      };
    };

    request.onerror = (event) => {
      const eventTarget = event.target as IDBOpenDBRequest;
      const error = eventTarget.error?.message;
      reject(new Error(`IDB: Cleanup error: ${error}`));
    };
  });
}
