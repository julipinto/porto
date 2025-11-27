import { Power, Activity, Settings, AlertTriangle } from "lucide-solid";
import { Show } from "solid-js";
import { useUIStore } from "../../../stores/ui-store";
import { useDockerContextActions } from "../../settings/hooks/use-docker-context-actions";

interface Props {
  onTurnOn: () => void;
  pendingAction: "start" | "stop" | null;
}

export function DockerOffScreen(props: Props) {
  const { setActiveView } = useUIStore();
  const { activeConnection } = useDockerContextActions();

  const isLoading = () => props.pendingAction === "start";

  const isLocalDefault = () => activeConnection().includes("/var/run/docker.sock");

  return (
    <div class="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in zoom-in duration-300 p-8">
      {/* Visual de Erro */}
      <div class="relative group">
        <div class="absolute inset-0 bg-red-500/10 blur-2xl rounded-full group-hover:bg-red-500/20 transition-all duration-500"></div>
        <div class="bg-[#161b22] p-8 rounded-full border border-red-900/30 relative z-10 shadow-2xl">
          <AlertTriangle class="w-16 h-16 text-red-500" />
        </div>
      </div>

      <div class="space-y-2 max-w-md">
        <h2 class="text-2xl font-bold text-white tracking-tight">Conexão Indisponível</h2>
        <div class="text-neutral-500 text-sm font-mono bg-black/30 p-2 rounded border border-neutral-800 break-all">
          {activeConnection()}
        </div>
        <p class="text-neutral-400 leading-relaxed">
          Não foi possível conectar ao Docker Engine neste contexto.
        </p>
      </div>

      {/* Ações */}
      <div class="flex flex-col gap-3 w-full max-w-xs">
        {/* 1. Botão de Iniciar Serviço (Só aparece se for local padrão) */}
        <Show when={isLocalDefault()}>
          <button
            type="button"
            onClick={props.onTurnOn}
            disabled={props.pendingAction !== null}
            class="group relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50"
          >
            <Show when={isLoading()} fallback={<Power class="w-5 h-5 mr-2" />}>
              <Activity class="w-5 h-5 mr-2 animate-spin" />
            </Show>
            {isLoading() ? "Iniciando..." : "Iniciar Serviço Local"}
          </button>
        </Show>

        {/* 2. Botão de Configurações (Sempre visível como alternativa) */}
        <button
          type="button"
          onClick={() => setActiveView("settings")}
          class="inline-flex items-center justify-center px-6 py-3 font-medium text-neutral-300 transition-all duration-200 bg-neutral-800 rounded-lg hover:bg-neutral-700 border border-neutral-700"
        >
          <Settings class="w-4 h-4 mr-2" />
          Gerenciar Conexões
        </button>
      </div>
    </div>
  );
}
