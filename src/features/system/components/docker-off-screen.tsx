import { Power, Activity, Settings, AlertTriangle, Globe, ServerCrash } from "lucide-solid";
import { Show } from "solid-js";
import { useUIStore } from "../../../stores/ui-store";
import { useDockerContextActions } from "../../settings/hooks/use-docker-context-actions";
import { Button } from "../../../ui/button";
import { useI18n } from "../../../i18n";

interface Props {
  onTurnOn: () => void;
  pendingAction: "start" | "stop" | null;
}

export function DockerOffScreen(props: Props) {
  const { setActiveView } = useUIStore();
  const { activeConnection, connectionType } = useDockerContextActions();
  const { t } = useI18n();

  const isLoading = () => props.pendingAction === "start";
  const canTryAutoStart = () => connectionType() === "local";

  return (
    <div class="flex flex-col items-center justify-center h-full w-full p-8 animate-in fade-in zoom-in duration-500 relative overflow-hidden">
      {/* Background Glow (Efeito de Luz Vermelha no fundo) */}
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Card Principal */}
      <div class="relative z-10 flex flex-col items-center max-w-md w-full bg-[#0d1117]/80 backdrop-blur-xl border border-neutral-800 rounded-2xl p-8 shadow-2xl">
        {/* Ícone de Erro */}
        <div class="mb-6 relative">
          <div class="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
          <div class="relative bg-[#161b22] p-4 rounded-xl border border-neutral-800 shadow-lg">
            <ServerCrash class="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Título e Subtítulo */}
        <h2 class="text-xl font-bold text-white tracking-tight mb-2">
          {t("system.dockerOff.title")}
        </h2>

        <p class="text-neutral-400 text-sm text-center mb-6 leading-relaxed">
          {t("system.dockerOff.description")}
          <Show when={connectionType() === "remote"}>
            <br />
            <span class="text-amber-500/90 mt-1 block">{t("system.dockerOff.remoteWarning")}</span>
          </Show>
        </p>

        {/* Detalhes Técnicos (Discretos) */}
        <div class="w-full bg-black/30 rounded-lg border border-neutral-800/50 p-3 mb-8 flex items-center gap-3 overflow-hidden">
          <div class="p-1.5 bg-neutral-800 rounded shrink-0 text-neutral-400">
            <Show
              when={connectionType() === "remote"}
              fallback={<AlertTriangle class="w-3.5 h-3.5" />}
            >
              <Globe class="w-3.5 h-3.5" />
            </Show>
          </div>
          <div class="flex flex-col min-w-0 text-left">
            <span class="text-[10px] font-bold uppercase text-neutral-500 tracking-wider">
              {connectionType() === "remote"
                ? t("system.dockerOff.endpointRemote")
                : t("system.dockerOff.socketLocal")}
            </span>
            <code class="text-xs text-neutral-300 font-mono truncate" title={activeConnection()}>
              {activeConnection()}
            </code>
          </div>
        </div>

        {/* Ações (Botões) */}
        <div class="flex flex-col gap-3 w-full">
          {/* Botão Principal (Start) */}
          {/* Botão Iniciar */}
          <Show when={canTryAutoStart()}>
            <Button
              onClick={props.onTurnOn}
              disabled={props.pendingAction !== null}
              class="w-full shadow-lg shadow-blue-900/20"
            >
              <Show when={isLoading()} fallback={<Power class="w-4 h-4" />}>
                <Activity class="w-4 h-4 animate-spin" />
              </Show>
              {isLoading()
                ? t("system.dockerOff.tryingToStart")
                : t("system.dockerOff.startService")}
            </Button>
          </Show>

          {/* Botão Settings */}
          <Button
            variant="outline"
            onClick={() => setActiveView("settings")}
            class="w-full bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
          >
            <Settings class="w-4 h-4" />
            {t("system.dockerOff.manageConnections")}
          </Button>
        </div>
      </div>
    </div>
  );
}
