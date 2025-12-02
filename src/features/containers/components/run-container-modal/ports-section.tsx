import type { Component } from "solid-js";
import type { SetStoreFunction } from "solid-js/store";
import type { RunConfig } from "../../hooks/use-run-container";
import { MappingRow } from "./mapping-row"; // <--- Importe
import { DynamicList } from "../../../../ui/dynamic-list";

interface Props {
  ports: RunConfig["ports"];
  setForm: SetStoreFunction<RunConfig>;
  onAdd: () => void;
  onRemove: (i: number) => void;
}

export const PortsSection: Component<Props> = (props) => {
  return (
    <DynamicList
      label="Mapeamento de Portas"
      items={props.ports}
      onAdd={props.onAdd}
      onRemove={props.onRemove}
      emptyText="Nenhuma porta exposta."
      renderItem={(item, i) => (
        <MappingRow
          type="port"
          hostValue={item.host}
          onHostInput={(val) => props.setForm("ports", i, "host", val)}
          containerValue={item.container}
          onContainerInput={(val) => props.setForm("ports", i, "container", val)}
        />
      )}
    />
  );
};
