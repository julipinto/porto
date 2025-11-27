import { Power, Activity, Settings, AlertTriangle, Globe } from "lucide-solid";
import { Show } from "solid-js";
import { useUIStore } from "../../../stores/ui-store";
import { useDockerContextActions } from "../../settings/hooks/use-docker-context-actions";

interface Props {
  onTurnOn: () => void;
  pendingAction: "start" | "stop" | null;
}

export function DockerOffScreen(props: Props) {
  const { setActiveView } = useUIStore();

  const { activeConnection, connectionType } = useDockerContextActions();
  const isLoading = () => props.pendingAction === "start";
  const canTryAutoStart = () => connectionType() === "local";

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

        {/* Badge de Tipo de Conexão */}
        <div class="flex justify-center mb-2">
          <span class="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 flex items-center gap-1">
            <Show when={connectionType() === "remote"} fallback="Ambiente Local">
              <Globe class="w-3 h-3" /> Ambiente Remoto
            </Show>
          </span>
        </div>

        <div class="text-neutral-500 text-sm font-mono bg-black/30 p-2 rounded border border-neutral-800 break-all">
          {activeConnection()}
        </div>
        <p class="text-neutral-400 leading-relaxed text-sm">
          Não foi possível conectar ao Docker Engine.
          <Show when={connectionType() === "remote"}>
            <br />
            <span class="text-amber-500/80">Verifique sua VPN ou conexão de rede.</span>
          </Show>
        </p>
      </div>

      {/* Ações */}
      <div class="flex flex-col gap-3 w-full max-w-xs">
        {/* Botão de Iniciar (Condicional Limpa) */}
        <Show when={canTryAutoStart()}>
          <button
            type="button"
            onClick={props.onTurnOn}
            disabled={props.pendingAction !== null}
            class="group relative inline-flex items-center justify-center px-6 py-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-900/20"
          >
            <Show when={isLoading()} fallback={<Power class="w-5 h-5 mr-2" />}>
              <Activity class="w-5 h-5 mr-2 animate-spin" />
            </Show>
            {isLoading() ? "Tentando iniciar..." : "Iniciar Serviço Local"}
          </button>
        </Show>

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
