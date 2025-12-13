import { createSignal, onMount, Show } from "solid-js";
import { invoke } from "@tauri-apps/api/core";

interface ActiveConfig {
  uri: string;
  variant: string;
}

export default function ConnectionStatus() {
  // Signal inicializado como null
  const [config, setConfig] = createSignal<ActiveConfig | null>(null);

  const fetchConfig = async () => {
    try {
      const active = await invoke<ActiveConfig>("get_active_config");
      setConfig(active);
    } catch (e) {
      console.error("Erro ao buscar config", e);
    }
  };

  onMount(() => {
    fetchConfig();
  });

  return (
    <Show when={config()}>
      {(active) => (
        <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 mb-6 transition-all">
          <div class="flex items-center gap-3">
            {/* Ícone de Pulso */}
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>

            <div class="flex flex-col">
              <span class="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Conectado Atualmente
              </span>
              <span class="text-sm text-gray-200 font-medium font-mono">
                {/* Acessamos as propriedades do objeto active() */}
                {active().variant} <span class="text-gray-500">em</span> {active().uri}
              </span>
            </div>
          </div>
        </div>
      )}
    </Show>
  );
}
