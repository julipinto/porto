import { type Component, For, Show } from "solid-js";
import { Server, FolderOpen, Unplug, Check, Terminal } from "lucide-solid";
import { useDockerContextActions } from "../hooks/use-docker-context-actions";
import { useDockerContexts } from "../hooks/use-docker-context";
import { Button } from "../../../ui/button";

export const AdvancedTab: Component = () => {
  const { contexts } = useDockerContexts();
  const { activeConnection, browseSocketFile, applyContext, customPath, setCustomPath } =
    useDockerContextActions();

  const handleConnectClick = () => {
    applyContext(customPath());
  };

  return (
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Seção 1: Contextos Detectados (Automático) */}
      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Server class="w-4 h-4 text-blue-500" />
          Contextos Detectados
        </h3>

        <div class="space-y-2">
          <For each={contexts()}>
            {(ctx) => {
              const endpoint = ctx.DockerEndpoint || "";
              const isAppConnected = () => endpoint.trim() === activeConnection().trim();

              return (
                <button
                  type="button"
                  onClick={() => applyContext(endpoint)}
                  class={`
                    w-full flex items-center justify-between p-3 border rounded-lg transition-all text-left group relative
                    ${
                      isAppConnected()
                        ? "bg-blue-500/10 border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                        : "bg-black/20 border-neutral-800 hover:bg-white/5 hover:border-neutral-700"
                    }
                  `}
                >
                  <div class="flex items-center gap-3">
                    <div
                      class={`
                        w-2.5 h-2.5 rounded-full transition-colors
                        ${isAppConnected() ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" : "bg-neutral-700 group-hover:bg-neutral-600"}
                      `}
                    />

                    <div>
                      <div
                        class={`text-sm font-medium ${isAppConnected() ? "text-white" : "text-neutral-300"}`}
                      >
                        {ctx.Name}
                      </div>
                      <div class="text-[10px] text-neutral-500 font-mono opacity-70">
                        {endpoint}
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-2">
                    {/* Badge Conectado */}
                    <Show when={isAppConnected()}>
                      <div class="flex items-center gap-1 text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded shadow-sm">
                        <Check class="w-3 h-3" />
                        CONECTADO
                      </div>
                    </Show>

                    {/* Badge CLI Default */}
                    <Show when={ctx.Current && !isAppConnected()}>
                      <div
                        class="flex items-center gap-1 text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700"
                        title="Este é o contexto padrão do seu terminal"
                      >
                        <Terminal class="w-3 h-3" />
                        CLI Default
                      </div>
                    </Show>
                  </div>
                </button>
              );
            }}
          </For>
        </div>
      </section>

      {/* Seção 2: Conexão Manual (Socket Picker) */}
      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Unplug class="w-4 h-4 text-amber-500" />
          Conexão Manual
        </h3>
        <p class="text-neutral-500 text-sm mb-4">
          Selecione o arquivo de socket (Unix) ou digite o endereço TCP para conectar a um host
          remoto.
        </p>

        <div class="flex gap-2">
          {/* Input de Texto */}
          <div class="relative flex-1">
            <input
              type="text"
              value={customPath()}
              onInput={(e) => setCustomPath(e.currentTarget.value)}
              class="w-full bg-black/40 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
              placeholder="unix:///var/run/docker.sock"
            />
          </div>

          {/* Botão Folder */}
          <Button
            variant="outline"
            size="icon"
            onClick={browseSocketFile}
            class="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            title="Procurar arquivo .sock"
          >
            <FolderOpen class="w-5 h-5" />
          </Button>

          {/* Botão Conectar */}
          <Button
            variant="default"
            onClick={handleConnectClick}
            class="shadow-lg shadow-blue-900/20"
          >
            Conectar
          </Button>
        </div>
      </section>
    </div>
  );
};
