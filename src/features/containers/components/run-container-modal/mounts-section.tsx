import type { Component } from "solid-js";
import { FolderOpen } from "lucide-solid";
import { open as openDialog } from "@tauri-apps/plugin-dialog";
import { DynamicList } from "../../../../ui/dynamic-list/dynamic-list";
import type { SetStoreFunction } from "solid-js/store";
import type { RunConfig } from "../../hooks/use-run-container";
import { Button } from "../../../../ui/button";

interface Props {
  mounts: RunConfig["mounts"];
  setForm: SetStoreFunction<RunConfig>;
  onAdd: () => void;
  onRemove: (i: number) => void;
}

export const MountsSection: Component<Props> = (props) => {
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
      label="Volumes (Bind Mounts)"
      items={props.mounts}
      onAdd={props.onAdd}
      onRemove={props.onRemove}
      emptyText="Nenhum volume montado."
      renderItem={(item, i) => (
        <div class="col-span-2 grid grid-cols-2 gap-2">
          <div class="relative flex items-center">
            <input
              placeholder="Host (/home/...)"
              class="bg-black/20 border border-neutral-700 rounded-l px-2 py-1 text-sm text-white w-full pr-8"
              value={item.hostPath}
              onInput={(e) => props.setForm("mounts", i, "hostPath", e.currentTarget.value)}
            />
            <Button
              variant="ghost"
              size="icon" // Quadrado perfeito
              class="h-7 w-7 text-neutral-400" // Um pouco menor que o input
              onClick={() => handleBrowse(i)}
              title="Selecionar Pasta"
            >
              <FolderOpen class="w-4 h-4" />
            </Button>
          </div>
          <input
            placeholder="No Container (/data)"
            class="bg-black/20 border border-neutral-700 rounded px-2 py-1 text-sm text-white w-full"
            value={item.containerPath}
            onInput={(e) => props.setForm("mounts", i, "containerPath", e.currentTarget.value)}
          />
        </div>
      )}
    />
  );
};
