export class IndexedDBWrapper {
    private dbName: string;
    private storeName: string;
    private db: IDBDatabase | null = null;
  
    constructor(dbName: string, storeName: string) {
      this.dbName = dbName;
      this.storeName = storeName;
    }
  
    private async getDatabase(): Promise<IDBDatabase> {
      if (this.db) {
        return this.db;
      }
  
      return new Promise<IDBDatabase>((resolve, reject) => {
        const request = indexedDB.open(this.dbName, 1);
  
        request.onerror = (event:any) => {
          reject(event.target.error);
        };
  
        request.onsuccess = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          resolve(this.db);
        };
  
        request.onupgradeneeded = (event) => {
          this.db = (event.target as IDBOpenDBRequest).result;
          this.db.createObjectStore(this.storeName, { keyPath: 'name' });
        };
      });
    }
  
    public async getItem(name: string): Promise<string | null> {
      try {
        const db = await this.getDatabase();
        const transaction = db.transaction([this.storeName], 'readonly');
        const store = transaction.objectStore(this.storeName);
        const request = store.get(name);
  
        return new Promise<string | null>((resolve, reject) => {
          request.onsuccess = () => {
            resolve(request.result ? request.result.value : null);
          };
  
          request.onerror = () => {
            reject(request.error);
          };
        });
      } catch (error) {
        console.error('Error reading data from IndexedDB:', error);
        return null;
      }
    }
  
    public async setItem(name: string, value: string): Promise<void> {
      try {
        const db = await this.getDatabase();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.put({ name, value });
  
        transaction.oncomplete = () => {
          console.log('Data successfully stored in IndexedDB.');
        };
  
        transaction.onerror = (event: any) => {
          console.error('Error storing data in IndexedDB:', event.target.error);
        };
      } catch (error) {
        console.error('Error opening database for storing data:', error);
      }
    }
  
    public async removeItem(name: string): Promise<void> {
      try {
        const db = await this.getDatabase();
        const transaction = db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        store.delete(name);
  
        transaction.oncomplete = () => {
          console.log('Data successfully removed from IndexedDB.');
        };
  
        transaction.onerror = (event: any) => {
          console.error('Error removing data from IndexedDB:', event.target.error);
        };
      } catch (error) {
        console.error('Error opening database for removing data:', error);
      }
    }
  }
