import type { Component } from "solid-js";
import { ArrowLeft } from "lucide-solid";

interface Props {
  containerId: string;
  onBack: () => void;
}

export const DetailsHeader: Component<Props> = (props) => {
  return (
    <div class="flex items-center justify-between border-b border-neutral-800 pb-4 mb-4">
      <div class="flex items-center gap-4">
        <button
          type="button"
          onClick={props.onBack}
          class="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors"
          title="Voltar para a lista"
        >
          <ArrowLeft class="w-5 h-5" />
        </button>

        <div>
          <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-3">
            {/* Placeholder para o nome, futuramente virá do hook */}
            Detalhes do Container
            <span class="text-xs font-mono font-normal text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              {props.containerId.substring(0, 12)}
            </span>
          </h2>
          <p class="text-xs text-neutral-500 mt-1">Visualizando logs e status em tempo real</p>
        </div>
      </div>

      {/* Espaço para botões de ação (Start/Stop/Restart) específicos dessa tela */}
      <div class="flex gap-2">{/* ... */}</div>
    </div>
  );
};
