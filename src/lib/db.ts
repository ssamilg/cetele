import type { PersistStorage, StorageValue } from "zustand/middleware"
import { get, set, del } from "idb-keyval"

export function createIdbStorage<T>(): PersistStorage<T> {
  return {
    getItem: async (name: string): Promise<StorageValue<T> | null> =>
      (await get<StorageValue<T>>(name)) ?? null,
    setItem: async (name: string, value: StorageValue<T>): Promise<void> => {
      await set(name, value)
    },
    removeItem: async (name: string): Promise<void> => {
      await del(name)
    },
  }
}
