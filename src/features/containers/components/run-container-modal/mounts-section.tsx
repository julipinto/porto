import type { Component } from "solid-js";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { DynamicList } from "../../../../ui/dynamic-list/dynamic-list";
import type { SetStoreFunction } from "solid-js/store";
import type { RunConfig } from "../../hooks/use-run-container";
import { MappingRow } from "./mapping-row";
import { useI18n } from "../../../../i18n";

interface Props {
  mounts: RunConfig["mounts"];
  setForm: SetStoreFunction<RunConfig>;
  onAdd: () => void;
  onRemove: (i: number) => void;
}

export const MountsSection: Component<Props> = (props) => {
  const { t } = useI18n();
  const handleBrowse = async (index: number) => {
    try {
      const selected = await openDialog({ directory: true, multiple: false });
      if (selected && typeof selected === "string") {
        props.setForm("mounts", index, "hostPath", selected);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <DynamicList
      label={t("containers.runModal.sections.volumes")}
      items={props.mounts}
      onAdd={props.onAdd}
      onRemove={props.onRemove}
      emptyText={t("containers.runModal.sections.noMounts")}
      renderItem={(item, i) => (
        <MappingRow
          type="volume"
          hostValue={item.hostPath}
          onHostInput={(val) => props.setForm("mounts", i, "hostPath", val)}
          containerValue={item.containerPath}
          onContainerInput={(val) => props.setForm("mounts", i, "containerPath", val)}
          onBrowse={() => handleBrowse(i)}
        />
      )}
    />
  );
};
