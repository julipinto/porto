import { createSignal, For, Show } from "solid-js";
import { RefreshCw, Zap, Box, Download } from "lucide-solid";
import { useImages } from "../hooks/use-images";
import { ImageItemRow } from "./image-item-row";
import { createDebouncedSignal } from "../../../utils/debounce";
import { SearchInput } from "../../../ui/search-input";
import { PullImageModal } from "./pull-modal";

export function ImageList() {
  // 1. Configura o estado da busca com debounce
  const [isPullModalOpen, setIsPullModalOpen] = createSignal(false);
  const [inputValue, setInputValue, searchQuery] = createDebouncedSignal("", 300);
  // 2. Passa o sinal de busca para o hook
  const query = useImages(searchQuery);

  return (
    <>
      <PullImageModal isOpen={isPullModalOpen()} onClose={() => setIsPullModalOpen(false)} />
      <div class="space-y-6 pb-12">
        {/* Header */}
        <div class="flex justify-between items-end border-b border-neutral-800 pb-4 gap-4">
          <div>
            <h2 class="text-2xl font-bold text-white tracking-tight">Imagens Locais</h2>
            <p class="text-neutral-500 text-sm mt-1">
              {query.data?.length || 0} imagens armazenadas
            </p>
          </div>

          <div class="flex items-center gap-3 flex-1 justify-end">
            {/* Barra de Busca */}
            <SearchInput
              value={inputValue()}
              onInput={setInputValue}
              placeholder="Buscar imagem por tag ou ID..."
            />

            <button
              type="button"
              onClick={() => setIsPullModalOpen(true)}
              class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-900/20"
            >
              <Download class="w-4 h-4" />
              <span class="hidden sm:inline">Pull Image</span>
            </button>

            {/* Status Pill */}
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
                <th class="p-4 w-[35%]">Tag / Repositório</th>
                <th class="p-4 w-[15%]">ID</th>
                <th class="p-4 w-[15%]">Tamanho</th>
                <th class="p-4 w-[20%]">Criado em</th>
                <th class="p-4 text-right w-[15%]">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800/50 text-sm">
              <For each={query.data}>{(img) => <ImageItemRow image={img} />}</For>

              {/* Estado Vazio / Buscando */}
              <Show when={query.data?.length === 0}>
                <tr>
                  <td colspan={5} class="p-12 text-center text-neutral-500">
                    <div class="flex flex-col items-center gap-2">
                      <Box class="w-8 h-8 opacity-20" />
                      <span class="italic">
                        {query.isLoading ? "Buscando..." : "Nenhuma imagem encontrada."}
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
