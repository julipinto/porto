import { createMemo, For, Show } from "solid-js";
import { RefreshCw, Zap } from "lucide-solid";
import { useContainers } from "../hooks/useContainers";
import { groupContainersByStack } from "../utils/grouping";
import { ContainerGroup } from "./ContainerGroup";
import { ContainerItemRow } from "./ContainerItemRow";

export function ContainerList() {
  const containers = useContainers();

  // Usa nossa utilidade pura dentro de um Memo para performance
  const data = createMemo(() => 
    groupContainersByStack(containers.data || [])
  );

  return (
    <div class="space-y-6 pb-12">
      {/* --- HEADER DA FEATURE --- */}
      <div class="flex justify-between items-end border-b border-neutral-800 pb-4">
        <div>
           <h2 class="text-2xl font-bold text-white tracking-tight">Containers</h2>
           <p class="text-neutral-500 text-sm mt-1">
             {data().sortedGroupNames.length} Stacks • {data().standalone.length} Standalone
           </p>
        </div>
        
        <div class="flex items-center gap-2 text-xs font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800">
           <Show when={containers.isFetching} fallback={<Zap class="w-3.5 h-3.5 text-emerald-500" />}>
              <RefreshCw class="w-3.5 h-3.5 animate-spin text-blue-500" />
           </Show>
           <span class={containers.isFetching ? "text-blue-400" : "text-emerald-400"}>
             {containers.isFetching ? "SYNCING" : "CONNECTED"}
           </span>
        </div>
      </div>

      {/* --- TABELA PRINCIPAL --- */}
      <div class="border border-neutral-800 rounded-lg bg-neutral-900/40 overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse"> 
          <thead>
            <tr class="bg-neutral-900 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              <th class="p-4 w-[40%]">Nome / ID</th>
              <th class="p-4 w-[25%]">Imagem</th>
              <th class="p-4">Status</th>
              <th class="p-4 text-right">Ações</th>
            </tr>
          </thead>
          
          <tbody class="divide-y divide-neutral-800/50 text-sm">
            {/* 1. Renderiza os Grupos */}
            <For each={data().sortedGroupNames}>
              {(groupName) => (
                <ContainerGroup 
                  name={groupName} 
                  containers={data().groups[groupName]} 
                />
              )}
            </For>

            {/* 3. Renderiza os Soltos */}
            <For 
              each={data().standalone}
              fallback={
                // Só mostra fallback se NÃO tiver grupos E NÃO tiver soltos
                <Show when={data().sortedGroupNames.length === 0}>
                   <tr><td colspan={4} class="p-8 text-center text-neutral-500">Nenhum container encontrado.</td></tr>
                </Show>
              }
            >
              {(container) => <ContainerItemRow container={container} isNested={false} />}
            </For>
          </tbody>
        </table>
      </div>
    </div>
  );
}