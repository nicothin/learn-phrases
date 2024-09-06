interface DeleteRecordsProps {
  dbName: string;
  version: number;
  tableName: string;
  keys: Array<IDBValidKey>;
}

export function deleteRecords(params: DeleteRecordsProps): Promise<void> {
  const { dbName, version = 1, tableName, keys } = params;
  let db: IDBDatabase | null = null;

  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onsuccess = (event) => {
      const openIDBRequestEventTarget = event.target as IDBOpenDBRequest;
      db = openIDBRequestEventTarget.result;

      const transaction = db.transaction(tableName, 'readwrite');
      const objectStore = transaction.objectStore(tableName);
      const deleteErrors: string[] = [];

      keys.forEach((key) => {
        const deleteRequest = objectStore.delete(key);

        deleteRequest.onerror = (event) => {
          const deleteRequestEventTarget = event.target as IDBRequest;
          const error = deleteRequestEventTarget.error?.message ??
            `IDB: Error deleting object: ${JSON.stringify(key)}`;
          deleteErrors.push(error);
        };
      });

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = (event) => {
        const transactionEventTarget = event.target as IDBTransaction;
        const error = transactionEventTarget.error?.message;
        reject(new Error(`IDB transaction failed: ${error}\n${deleteErrors.join('\n')}`));
      };
    };

    request.onerror = (event) => {
      const eventTarget = event.target as IDBOpenDBRequest;
      const error = eventTarget.error?.message;
      reject(new Error(`IDB: Error on objects delete: ${error}`));
    };
  });
}
