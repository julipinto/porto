import type { Component } from "solid-js";
import { DynamicList } from "../../../../ui/dynamic-list/dynamic-list";
import type { SetStoreFunction } from "solid-js/store";
import type { RunConfig } from "../../hooks/use-run-container";

interface Props {
  env: RunConfig["env"];
  setForm: SetStoreFunction<RunConfig>;
  onAdd: () => void;
  onRemove: (i: number) => void;
}

export const EnvSection: Component<Props> = (props) => {
  interface EnvVar {
    key: string;
    value: string;
  }

  return (
    <DynamicList<EnvVar>
      label="Variáveis de Ambiente"
      items={props.env as EnvVar[]}
      onAdd={props.onAdd}
      onRemove={props.onRemove}
      emptyText="Nenhuma variável definida."
      renderItem={(item: EnvVar, i: number) => (
        <>
          <input
            placeholder="KEY"
            class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full font-mono text-xs"
            value={item.key}
            onInput={(e: Event & { currentTarget: HTMLInputElement }) =>
              props.setForm("env", i, "key", e.currentTarget.value)
            }
          />
          <input
            placeholder="VALUE"
            class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full"
            value={item.value}
            onInput={(e: Event & { currentTarget: HTMLInputElement }) =>
              props.setForm("env", i, "value", e.currentTarget.value)
            }
          />
        </>
      )}
    />
  );
};
