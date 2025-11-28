import { type Component, For, Show } from "solid-js";
import { CheckCircle, Loader2 } from "lucide-solid";
import type { LayerState } from "./types";
import { ProgressItem } from "./progress-item";

interface Props {
  layers: Record<string, LayerState>;
  isPulling: boolean;
  statusMessage: string;
}

export const ProgressList: Component<Props> = (props) => {
  // Só mostra se estiver baixando ou tiver dados
  const showList = () => props.isPulling || Object.keys(props.layers).length > 0;

  return (
    <Show when={showList()}>
      <div class="bg-[#0d1117] border border-neutral-800 rounded-xl p-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-300">
        {/* Status Geral Sticky */}
        <div class="text-sm text-blue-400 font-medium flex items-center gap-2 sticky top-0 bg-[#0d1117] pb-2 border-b border-neutral-800/50 z-10">
          <Show when={props.isPulling} fallback={<CheckCircle class="w-4 h-4 text-emerald-500" />}>
            <Loader2 class="w-4 h-4 animate-spin" />
          </Show>
          {props.statusMessage || "Preparando..."}
        </div>

        {/* Lista de Camadas */}
        <div class="space-y-2">
          <For each={Object.entries(props.layers)}>
            {([id, layer]) => <ProgressItem id={id} layer={layer} />}
          </For>
        </div>
      </div>
    </Show>
  );
};
