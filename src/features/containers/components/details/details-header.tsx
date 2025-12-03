import { type Component, createSignal, Show } from "solid-js";
import { ArrowLeft, Hash, Loader2, Play, Square } from "lucide-solid";
import { useContainerInspect } from "../../hooks/use-container-inspect";
import { Button } from "../../../../ui/button";
import { useContainerActions } from "../../hooks/use-container-actions";
import { useI18n } from "../../../../i18n";

interface Props {
  containerId: string;
  onBack: () => void;
}

export const DetailsHeader: Component<Props> = (props) => {
  const { startContainer, stopContainer } = useContainerActions();
  const { t } = useI18n();

  const query = useContainerInspect(props.containerId);
  const [actionState, setActionState] = createSignal<"start" | "stop" | "delete" | null>(null);

  const name = () => query.data?.Name?.replace("/", "") || t("containers.details.loading");
  const status = () => query.data?.State?.Status || "unknown";
  const isRunning = () => query.data?.State?.Running === true;

  // Handler para Start/Stop
  const handleToggle = async () => {
    if (actionState()) return;

    const action = isRunning() ? "stop" : "start";
    setActionState(action);

    try {
      if (action === "stop") await stopContainer(props.containerId);
      else await startContainer(props.containerId);
      // O React Query vai atualizar o status automaticamente via socket/refetch
    } catch (error) {
      console.error(error);
    } finally {
      setActionState(null);
    }
  };

  return (
    <div class="flex items-center justify-between border-b border-neutral-800 pb-5 mb-6">
      <div class="flex items-center gap-4">
        {/* Botão Voltar */}
        <Button
          variant="ghost"
          size="icon"
          onClick={props.onBack}
          title={t("containers.details.back")}
        >
          <ArrowLeft class="w-5 h-5" />
        </Button>

        {/* Informações */}
        <div class="flex flex-col">
          {/* Linha Superior: Título e Tipo */}
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-white tracking-tight">{name()}</h2>
            <span class="text-[10px] font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 uppercase tracking-wider">
              {t("containers.details.container")}
            </span>
          </div>

          {/* Linha Inferior: Metadados (Status e ID) */}
          <div class="flex items-center gap-3 mt-1.5">
            {/* Status Badge Clean */}
            <Show when={query.data}>
              <div class="flex items-center gap-1.5">
                <div
                  class={`w-1.5 h-1.5 rounded-full ${
                    isRunning()
                      ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]"
                      : "bg-neutral-600"
                  }`}
                />
                <span
                  class={`text-xs font-medium capitalize ${isRunning() ? "text-emerald-400" : "text-neutral-500"}`}
                >
                  {status()}
                </span>
              </div>
            </Show>

            {/* Divisor Vertical */}
            <div class="w-[1px] h-3 bg-neutral-800" />

            {/* ID */}
            <div
              class="flex items-center gap-1.5 text-xs text-neutral-500 font-mono"
              title="Container ID"
            >
              <Hash class="w-3 h-3 opacity-50" />
              <span class="select-all">{props.containerId.substring(0, 12)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- AÇÕES RÁPIDAS --- */}
      <div class="flex gap-2">
        {/* Botão Start/Stop */}
        <Button
          variant="outline" // Outline para não brigar com o conteúdo
          onClick={handleToggle}
          disabled={!!actionState()}
          class={`gap-2 min-w-[100px] ${
            isRunning()
              ? "hover:text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10"
              : "hover:text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/10"
          }`}
        >
          <Show
            when={actionState() !== "start" && actionState() !== "stop"}
            fallback={<Loader2 class="w-4 h-4 animate-spin" />}
          >
            <Show when={isRunning()} fallback={<Play class="w-4 h-4 fill-current" />}>
              <Square class="w-4 h-4 fill-current" />
            </Show>
          </Show>
          {isRunning() ? t("containers.details.stop") : t("containers.details.start")}
        </Button>
      </div>
    </div>
  );
};
