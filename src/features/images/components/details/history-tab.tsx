import { type Component, For } from "solid-js";
import { formatBytes } from "../../../../utils/format";
import type { HistoryResponseItem } from "../../hooks/use-image-details";

interface Props {
  history: HistoryResponseItem[];
}

export const HistoryTab: Component<Props> = (props) => {
  return (
    <div class="text-xs font-mono">
      <div class="flex gap-4 p-3 bg-[#0d1117] border-b border-neutral-800 text-neutral-500 font-bold uppercase tracking-wider sticky top-0 z-10">
        <div class="w-24">ID</div>
        <div class="w-20 text-right">Tamanho</div>
        <div class="flex-1">Comando / Criação</div>
      </div>

      <For each={props.history}>
        {(layer) => (
          <div class="flex gap-4 p-3 border-b border-neutral-800 last:border-0 hover:bg-white/[0.02] transition-colors group">
            <div class="w-24 text-blue-400/80 shrink-0 truncate select-all" title={layer.Id}>
              {layer.Id.replace("sha256:", "").substring(0, 12) || "<base>"}
            </div>
            <div class="w-20 text-right text-neutral-400 shrink-0">{formatBytes(layer.Size)}</div>
            <div class="flex-1 text-neutral-400 group-hover:text-neutral-200 break-all font-sans leading-relaxed">
              {layer.CreatedBy.replace("/bin/sh -c #(nop)", "").trim() || "Layer Base"}
            </div>
          </div>
        )}
      </For>
    </div>
  );
};
