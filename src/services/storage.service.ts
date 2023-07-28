import { IndexedDBWrapper } from "@access/storage.access";
import { StateStorage } from "zustand/middleware";
const DB_NAME = "playerDb";
const TABLE_NAME = "playerStore";

const indexedDBWrapper = new IndexedDBWrapper(DB_NAME, TABLE_NAME);

export const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    return indexedDBWrapper.getItem(name);
  },

  setItem: async (name: string, value: string,): Promise<void> => {
    indexedDBWrapper.setItem(name, value);
  },

  removeItem: async (name: string): Promise<void> => {
    indexedDBWrapper.removeItem(name);
  },
};
