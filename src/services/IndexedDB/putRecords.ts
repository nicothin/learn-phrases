import { IDB_TABLES } from '../../constants';

interface PutRecordsParams {
  dbName: string;
  version: number;
  tableName: string;
  values: unknown[];
}

export function putRecords(params: PutRecordsParams): Promise<unknown[]> {
  const { dbName, version = 1, tableName, values } = params;
  let db: IDBDatabase | null = null;

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onupgradeneeded = (event) => {
      const eventTarget = event.target as IDBOpenDBRequest;
      db = eventTarget.result;

      if (!db.objectStoreNames.contains(tableName)) {
        const keyPath = IDB_TABLES.find((table) => table.name === tableName)?.keyPath ?? 'id';
        db.createObjectStore(tableName, { keyPath, autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      const openIDBRequestEventTarget = event.target as IDBOpenDBRequest;
      db = openIDBRequestEventTarget.result;

      const transaction = db.transaction(tableName, 'readwrite');
      const objectStore = transaction.objectStore(tableName);
      const insertedValues: unknown[] = [];
      const errors: string[] = [];

      values.forEach((value) => {
        const putRequest = objectStore.put(value);

        putRequest.onsuccess = (event) => {
          const putRequestEventTarget = event.target as IDBRequest;
          insertedValues.push(putRequestEventTarget.result);
        };

        putRequest.onerror = (event) => {
          const putRequestEventTarget = event.target as IDBRequest;
          const error =
            putRequestEventTarget.error?.message ?? `IDB: Error putting object: ${JSON.stringify(value)}`;
          errors.push(error);
        };
      });

      transaction.oncomplete = () => {
        resolve(insertedValues);
      };

      transaction.onerror = (event) => {
        const transactionEventTarget = event.target as IDBTransaction;
        const error = transactionEventTarget.error?.message;
        reject(new Error(`IDB transaction failed: ${error}\n${errors.join('\n')}`));
      };
    };

    request.onerror = (event) => {
      const eventTarget = event.target as IDBOpenDBRequest;
      const error = eventTarget.error?.message;
      reject(new Error(`IDB: Error on objects put: ${error}`));
    };
  });
}
