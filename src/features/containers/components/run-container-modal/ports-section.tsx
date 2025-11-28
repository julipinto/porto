import type { Component } from "solid-js";
import { DynamicList } from "../../../../ui/dynamic-list/dynamic-list";
import type { SetStoreFunction } from "solid-js/store";
import type { RunConfig } from "../../hooks/use-run-container";

interface Props {
  ports: RunConfig["ports"];
  setForm: SetStoreFunction<RunConfig>;
  onAdd: () => void;
  onRemove: (i: number) => void;
}

interface PortMapping {
  host: string;
  container: string;
}

export const PortsSection: Component<Props> = (props) => {
  return (
    <DynamicList<PortMapping>
      label="Mapeamento de Portas"
      items={props.ports}
      onAdd={props.onAdd}
      onRemove={props.onRemove}
      emptyText="Nenhuma porta exposta."
      renderItem={(item: PortMapping, i: number) => (
        <>
          <input
            placeholder="Host (8080)"
            class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full"
            value={item.host}
            onInput={(e: Event & { currentTarget: HTMLInputElement }) =>
              props.setForm("ports", i, "host", e.currentTarget.value)
            }
          />
          <input
            placeholder="Container (80)"
            class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full"
            value={item.container}
            onInput={(e: Event & { currentTarget: HTMLInputElement }) =>
              props.setForm("ports", i, "container", e.currentTarget.value)
            }
          />
        </>
      )}
    />
  );
};
