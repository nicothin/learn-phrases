import { IDBTable } from '../../types';

interface CheckIDBExistenceParams {
  dbName: string;
  version: number;
  tables: IDBTable[];
}

export function checkIDBExistence(params: CheckIDBExistenceParams): Promise<void> {
  const { dbName, version, tables } = params;
  let db: IDBDatabase | null = null;

  return new Promise<void>((resolve, reject) => {
    const request = indexedDB.open(dbName, version);

    request.onblocked = (event) => {
      const eventTarget = event.target as IDBOpenDBRequest;
      db = eventTarget.result;
      db.close();
      reject(new Error('IDB: The database is out of date, please reload the page.'));
    };

    request.onupgradeneeded = (event) => {
      const eventTarget = event.target as IDBOpenDBRequest;
      db = eventTarget.result;

      if (!db) {
        reject(new Error('IDB: The database onUpgradeneeded event is failed.'));
      }

      tables.forEach((table: IDBTable) => {
        db?.createObjectStore(table.name, {
          keyPath: table.keyPath,
          autoIncrement: true,
        });
      });
    };

    request.onsuccess = (event) => {
      const eventTarget = event.target as IDBOpenDBRequest;
      db = eventTarget.result;

      const tablesNotFound: string[] = [];
      tables.forEach((table: IDBTable) => {
        if (!db?.objectStoreNames.contains(table.name)) {
          tablesNotFound.push(table.name);
        }
      });
      if (tablesNotFound.length > 0) {
        reject(new Error(`IDB: The following tables were not found in the database: ${tablesNotFound.join(', ')}`));
      }

      if (tablesNotFound.length > 0) {
        reject(new Error(`IDB: The following tables were not found in the database: ${tablesNotFound.join(', ')}`));
      }

      resolve();
    };

    request.onerror = (event) => {
      const eventTarget = event.target as IDBOpenDBRequest;
      const error = eventTarget.error?.message;
      reject(new Error(`IDB: Error on database open: ${error}`));
    };
  });
}
