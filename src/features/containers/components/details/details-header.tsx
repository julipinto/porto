import { type Component, Show } from "solid-js";
import { ArrowLeft, Box } from "lucide-solid";
import { useContainerInspect } from "../../hooks/use-container-inspect";

interface Props {
  containerId: string;
  onBack: () => void;
}

export const DetailsHeader: Component<Props> = (props) => {
  const query = useContainerInspect(props.containerId);

  const name = () => query.data?.Name?.replace("/", "") || "Carregando...";
  const status = () => query.data?.State?.Status || "unknown";
  const isRunning = () => query.data?.State?.Running === true;

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
          <div class="flex items-center gap-3">
            {/* Ícone do Container */}
            <div
              class={`p-1.5 rounded-md ${isRunning() ? "bg-blue-500/10 text-blue-400" : "bg-neutral-800 text-neutral-500"}`}
            >
              <Box class="w-5 h-5" />
            </div>

            <h2 class="text-xl font-bold text-white tracking-tight">{name()}</h2>

            {/* Badge de ID */}
            <span class="text-xs font-mono font-normal text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              {props.containerId.substring(0, 12)}
            </span>

            {/* Badge de Status (NOVO) */}
            <Show when={query.data}>
              <div
                class={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  isRunning()
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-neutral-800 text-neutral-400 border-neutral-700"
                }`}
              >
                <div
                  class={`w-1.5 h-1.5 rounded-full ${
                    isRunning() ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
                  }`}
                />
                {status()}
              </div>
            </Show>
          </div>

          <p class="text-xs text-neutral-500 mt-1 pl-12">Visualizando detalhes e métricas</p>
        </div>
      </div>
    </div>
  );
};
