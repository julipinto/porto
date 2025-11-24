import { For, Show } from "solid-js";
import { RefreshCw, Zap, Box } from "lucide-solid";
import { useVolumes } from "../hooks/use-volumes";
import { VolumeItemRow } from "./volume-item-row";

export function VolumeList() {
  const query = useVolumes();

  return (
    <div class="space-y-6 pb-12">
      {/* Header */}
      <div class="flex justify-between items-end border-b border-neutral-800 pb-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Volumes</h2>
          <p class="text-neutral-500 text-sm mt-1">
            {query.data?.length || 0} volumes persistentes
          </p>
        </div>

        <div class="flex items-center gap-2 text-xs font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 text-neutral-400">
          <Show when={query.isFetching} fallback={<Zap class="w-3 h-3 text-emerald-500" />}>
            <RefreshCw class="w-3 h-3 animate-spin text-blue-500" />
          </Show>
          <span>{query.isFetching ? "SYNCING" : "ONLINE"}</span>
        </div>
      </div>

      {/* Tabela */}
      <div class="border border-neutral-800 rounded-lg bg-neutral-900/40 overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-neutral-900 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              <th class="p-4 w-[40%]">Nome / Driver</th>
              <th class="p-4 w-[35%]">Ponto de Montagem</th>
              <th class="p-4 w-[15%]">Criado em</th>
              <th class="p-4 text-right w-[10%]">Ações</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800/50 text-sm">
            <For each={query.data}>{(vol) => <VolumeItemRow volume={vol} />}</For>

            <Show when={query.data?.length === 0}>
              <tr>
                <td colspan={4} class="p-12 text-center text-neutral-500">
                  <div class="flex flex-col items-center gap-2">
                    <Box class="w-8 h-8 opacity-20" />
                    <span class="italic">Nenhum volume encontrado.</span>
                  </div>
                </td>
              </tr>
            </Show>
          </tbody>
        </table>
      </div>
    </div>
  );
}
