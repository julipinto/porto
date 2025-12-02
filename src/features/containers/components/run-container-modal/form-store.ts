import { createStore } from "solid-js/store";
import type { RunConfig } from "../../hooks/use-run-container";

const initialState: RunConfig = {
  image: "",
  name: "",
  ports: [],
  env: [],
  mounts: [],
  networkId: "",
};

type ArrayKeys = {
  [P in keyof RunConfig]: RunConfig[P] extends unknown[] ? P : never;
}[keyof RunConfig];
type ElementOf<K extends ArrayKeys> = RunConfig[K] extends (infer U)[] ? U : never;

export function createRunForm(initialImage = "") {
  const [form, setForm] = createStore<RunConfig>({
    ...initialState,
    image: initialImage,
  });

  const reset = () => setForm({ ...initialState });

  // Helpers genéricos para adicionar/remover itens das listas
  const addItem = <K extends ArrayKeys>(key: K, item: ElementOf<K>) => {
    setForm(key, (prev: RunConfig[K]) => [...(prev as unknown[]), item] as unknown as RunConfig[K]);
  };

  const removeItem = <K extends ArrayKeys>(key: K, index: number) => {
    setForm(
      key,
      (prev: RunConfig[K]) =>
        (prev as unknown[]).filter((_, i: number) => i !== index) as unknown as RunConfig[K],
    );
  };

  return { form, setForm, reset, addItem, removeItem };
}
