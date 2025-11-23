import { Power, Activity } from "lucide-solid";
import { Show } from "solid-js";

interface Props {
  onTurnOn: () => void;
  isToggling: boolean;
}

export function DockerOffScreen(props: Props) {
  return (
    <div class="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-300">
      <div class="relative">
        <div class="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse"></div>
        <div class="bg-neutral-900 p-6 rounded-full border border-neutral-800 relative z-10 shadow-2xl">
          <Power class="w-16 h-16 text-red-500" />
        </div>
      </div>

      <div class="space-y-2">
        <h2 class="text-2xl font-bold text-white">Docker Engine Parado</h2>
        <p class="text-neutral-500 max-w-md mx-auto">
          O serviço do Docker não está rodando no seu Fedora.
          Inicie o motor para gerenciar seus containers.
        </p>
      </div>

      <button
        onClick={props.onTurnOn}
        disabled={props.isToggling}
        class="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Show when={props.isToggling} fallback={<Power class="w-5 h-5 mr-2" />}>
          <Activity class="w-5 h-5 mr-2 animate-spin" />
        </Show>
        {props.isToggling ? "Iniciando SystemD..." : "Iniciar Docker Engine"}
      </button>
    </div>
  );
}