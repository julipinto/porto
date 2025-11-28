import type { Component } from "solid-js";
import type { LayerState } from "./types";

interface Props {
  id: string;
  layer: LayerState;
}

export const ProgressItem: Component<Props> = (props) => {
  return (
    <div class="flex items-center gap-3 text-xs">
      <span class="font-mono text-neutral-500 w-16 shrink-0">{props.id.substring(0, 12)}:</span>

      <div class="flex-1 flex flex-col gap-1">
        <div class="flex justify-between text-neutral-300">
          <span>{props.layer.status}</span>
          <span class="text-neutral-500">{props.layer.percentage.toFixed(0)}%</span>
        </div>

        {/* Barra de Progresso */}
        <div class="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div
            class="h-full bg-blue-500 transition-all duration-300 ease-out"
            style={{ width: `${props.layer.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};
