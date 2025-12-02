import { For, Show } from "solid-js";
import { RefreshCw, Zap, Network as NetworkIcon } from "lucide-solid";
import { useNetworks } from "../hooks/use-networks";
import { NetworkItemRow } from "./network-item-row";
import { createDebouncedSignal } from "../../../utils/debounce";
import { SearchInput } from "../../../ui/search-input";

export function NetworkList() {
  const [inputValue, setInputValue, searchQuery] = createDebouncedSignal("", 300);
  const query = useNetworks(searchQuery);

  return (
    <div class="space-y-6 pb-12">
      {/* Header */}
      <div class="flex justify-between items-end border-b border-neutral-800 pb-4 gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Redes</h2>
          <p class="text-neutral-500 text-sm mt-1">{query.data?.length || 0} redes configuradas</p>
        </div>

        <div class="flex items-center gap-3 flex-1 justify-end">
          <SearchInput value={inputValue()} onInput={setInputValue} placeholder="Buscar rede..." />

          <div class="flex items-center gap-2 text-xs font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 text-neutral-400 whitespace-nowrap">
            <Show when={query.isFetching} fallback={<Zap class="w-3 h-3 text-emerald-500" />}>
              <RefreshCw class="w-3 h-3 animate-spin text-blue-500" />
            </Show>
            <span>{query.isFetching ? "SYNCING" : "ONLINE"}</span>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div class="border border-neutral-800 rounded-lg bg-neutral-900/40 overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-neutral-900 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              <th class="p-4 w-[35%]">Nome / ID</th>
              <th class="p-4 w-[20%]">Driver</th>
              <th class="p-4 w-[25%]">Subnet</th>
              <th class="p-4 w-[15%]">Criado em</th>
              <th class="p-4 text-right w-[5%]"></th>
            </tr>
          </thead>
          <tbody class="text-sm">
            <For each={query.data}>{(net) => <NetworkItemRow network={net} />}</For>

            <Show when={query.data?.length === 0}>
              <tr>
                <td colspan={5} class="p-12 text-center text-neutral-500">
                  <div class="flex flex-col items-center gap-2">
                    <NetworkIcon class="w-8 h-8 opacity-20" />
                    <span class="italic">Nenhuma rede encontrada.</span>
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
