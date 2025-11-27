import { Store } from "@tauri-apps/plugin-store";

let storeInstance: Store | null = null;

async function getStore() {
  if (!storeInstance) {
    storeInstance = await Store.load("settings.json");
  }
  return storeInstance;
}

export async function saveSetting(key: string, value: unknown) {
  const store = await getStore();

  await store.set(key, value);
  await store.save();
}

export async function getSetting<T>(key: string): Promise<T | null | undefined> {
  const store = await getStore();
  return await store.get<T>(key);
}
