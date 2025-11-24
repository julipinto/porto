import { createEffect, createSignal, type Signal } from "solid-js";

export function createPersistentSignal<T>(key: string, initialValue: T): Signal<T> {
  const storedValue = localStorage.getItem(key);

  let startValue = initialValue;

  if (storedValue) {
    try {
      // Tenta fazer o parse do JSON salvo
      startValue = JSON.parse(storedValue);
    } catch (_e) {
      console.warn(`Erro ao ler chave '${key}' do storage, usando valor inicial.`);
    }
  }

  const [value, setValue] = createSignal<T>(startValue);

  createEffect(() => {
    const current = value();
    localStorage.setItem(key, JSON.stringify(current));
  });

  return [value, setValue];
}
