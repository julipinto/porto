import { createMemo, createSignal, For, Show } from "solid-js";
import { RefreshCw, Zap, Power, Box, Play } from "lucide-solid";

import { useContainers } from "../../hooks/use-containers";
import { useDockerSystem } from "../../../system/hooks/use-docker-system";
import { groupContainersByStack } from "../../utils/grouping";
import { ContainerGroup } from "./container-group";
import { ContainerItemRow } from "./container-item-row";
import { createDebouncedSignal } from "../../../../utils/debounce";
import { SearchInput } from "../../../../ui/search-input";
import { RunContainerModal } from "../run-container-modal";
import { Button } from "../../../../ui/button";

export function ContainerList() {
  const [isRunModalOpen, setIsRunModalOpen] = createSignal(false);
  const [inputValue, setInputValue, searchQuery] = createDebouncedSignal("", 300);

  const query = useContainers(searchQuery);

  const { toggleDockerService, isToggling, pendingAction } = useDockerSystem();

  const data = createMemo(() => groupContainersByStack(query.data || []));

  return (
    <>
      <RunContainerModal isOpen={isRunModalOpen()} onClose={() => setIsRunModalOpen(false)} />
      <div class="space-y-6 pb-12">
        {/* Header */}
        <div class="flex justify-between items-end border-b border-neutral-800 pb-4">
          <div>
            <h2 class="text-2xl font-bold text-white tracking-tight">Containers</h2>
            <p class="text-neutral-500 text-sm mt-1">
              {data().sortedGroupNames.length} Stacks • {data().standalone.length} Standalone
            </p>
          </div>

          <div class="flex items-center gap-3 flex-1 justify-end">
            <SearchInput
              value={inputValue()}
              onInput={setInputValue}
              placeholder="Buscar containers..."
            />

            <Button
              onClick={() => setIsRunModalOpen(true)}
              size="sm" // Pequeno para caber no header
              class="gap-2"
            >
              <Play class="w-3.5 h-3.5 fill-current" />
              <span class="hidden sm:inline">Run</span>
            </Button>

            {/* Botão STOP (Destructive - Agora tem fundo vermelho suave) */}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toggleDockerService("stop")}
              disabled={isToggling()}
              class="gap-2"
            >
              <Power class="w-3.5 h-3.5" />
              {pendingAction() === "stop" ? "Stopping..." : "Stop Engine"}
            </Button>

            <div class="flex items-center gap-2 text-xs font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 text-neutral-400">
              <Show when={query.isFetching} fallback={<Zap class="w-3 h-3 text-emerald-500" />}>
                <RefreshCw class="w-3 h-3 animate-spin text-blue-500" />
              </Show>
              <span class={query.isFetching ? "text-blue-400" : "text-emerald-400"}>
                {query.isFetching ? "SYNCING" : "ONLINE"}
              </span>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div class="border border-neutral-800 rounded-lg bg-neutral-900/40 overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-neutral-900 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                <th class="p-4 w-[40%]">Nome / ID</th>
                <th class="p-4 w-[25%]">Imagem</th>
                <th class="p-4 w-[20%]">Portas</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800/50 text-sm">
              <For each={data().sortedGroupNames}>
                {(groupName) => (
                  <ContainerGroup name={groupName} containers={data().groups[groupName]} />
                )}
              </For>
              <For each={data().standalone}>
                {(container) => <ContainerItemRow container={container} />}
              </For>

              <Show when={data().sortedGroupNames.length === 0 && data().standalone.length === 0}>
                <tr>
                  <td colspan={5} class="p-12 text-center text-neutral-500">
                    <div class="flex flex-col items-center gap-2">
                      <Show when={query.isFetching} fallback={<Box class="w-8 h-8 opacity-20" />}>
                        <RefreshCw class="w-8 h-8 opacity-50 animate-spin" />
                      </Show>
                      <span class="italic">
                        {query.isFetching
                          ? "Carregando containers..."
                          : "Nenhum container rodando no momento."}
                      </span>
                    </div>
                  </td>
                </tr>
              </Show>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
