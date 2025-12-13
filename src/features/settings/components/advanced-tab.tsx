import { type Component, createSignal, For, Show } from "solid-js";
import { Server, FolderOpen, Unplug, Check, Terminal, Database, Trash2 } from "lucide-solid";
import { useDockerContextActions } from "../hooks/use-docker-context-actions";
import { useDockerContexts } from "../hooks/use-docker-context";
import { Button } from "../../../ui/button";
import { PruneModal } from "./prune-modal";
import { useI18n } from "../../../i18n";
import ConnectionStatus from "./connection-status";

export const AdvancedTab: Component = () => {
  const { contexts } = useDockerContexts();
  const [showPrune, setShowPrune] = createSignal(false);
  const {
    browseSocketFile,
    applyContext,
    customPath,
    setCustomPath,
    isConnecting,
    activeConnection, // <--- Add this line here!
  } = useDockerContextActions();

  const { t } = useI18n();

  const handleConnectClick = () => {
    applyContext(customPath());
  };

  return (
    <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ConnectionStatus />

      {/* Seção 1: Contextos Detectados (Automático) */}
      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Server class="w-4 h-4 text-blue-500" />
          {t("settings.advanced.detectedContexts.title")}
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
                        {t("settings.advanced.detectedContexts.connected")}
                      </div>
                    </Show>

                    {/* Badge CLI Default */}
                    <Show when={ctx.Current && !isAppConnected()}>
                      <div
                        class="flex items-center gap-1 text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded border border-neutral-700"
                        title={t("settings.advanced.detectedContexts.cliDefaultTooltip")}
                      >
                        <Terminal class="w-3 h-3" />
                        {t("settings.advanced.detectedContexts.cliDefault")}
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
          {t("settings.advanced.manualConnection.title")}
        </h3>
        <p class="text-neutral-500 text-sm mb-4">
          {t("settings.advanced.manualConnection.description")}
        </p>

        <div class="flex gap-2">
          {/* Input de Texto */}
          <div class="relative flex-1">
            <input
              type="text"
              value={customPath()}
              onInput={(e) => setCustomPath(e.currentTarget.value)}
              class="w-full bg-black/40 border border-neutral-700 text-white text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono"
              placeholder={t("settings.advanced.manualConnection.placeholder")}
            />
          </div>

          {/* Botão Folder */}
          <Button
            variant="outline"
            size="icon"
            onClick={browseSocketFile}
            class="bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:text-white"
            title={t("settings.advanced.manualConnection.browseSocket")}
          >
            <FolderOpen class="w-5 h-5" />
          </Button>

          {/* Botão Conectar */}
          <Button
            onClick={handleConnectClick}
            disabled={isConnecting()}
            class="shadow-lg shadow-blue-900/20"
          >
            {t("settings.advanced.manualConnection.connect")}
          </Button>
        </div>
      </section>

      {/* NOVA SEÇÃO: Manutenção */}
      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Database class="w-4 h-4 text-amber-500" />
          {t("settings.advanced.maintenance.title")}
        </h3>

        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-neutral-200 font-medium">
              {t("settings.advanced.maintenance.prune")}
            </p>
            <p class="text-xs text-neutral-500 mt-1 max-w-md">
              {t("settings.advanced.maintenance.pruneDescription")}
            </p>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowPrune(true)}
            class="border-red-900/30 hover:bg-red-900/10 text-red-400 hover:text-red-300 hover:border-red-900/50"
          >
            <Trash2 class="w-4 h-4 mr-2" />
            {t("settings.advanced.maintenance.cleanSystem")}
          </Button>
        </div>
      </section>

      {/* Modal de Prune */}
      <PruneModal isOpen={showPrune()} onClose={() => setShowPrune(false)} />
    </div>
  );
};
