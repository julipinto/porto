import { For, Show } from "solid-js";
import { RefreshCw, Zap, Box } from "lucide-solid";
import { useVolumes } from "../hooks/use-volumes";
import { VolumeItemRow } from "./volume-item-row";
import { createDebouncedSignal } from "../../../utils/debounce";
import { SearchInput } from "../../../ui/search-input";
import { useUIStore } from "../../../stores/ui-store";
import { useI18n } from "../../../i18n";

export function VolumeList() {
  // 1. Busca
  const [inputValue, setInputValue, searchQuery] = createDebouncedSignal("", 300);
  const { setSelectedVolumeName } = useUIStore();
  const { t } = useI18n();
  const query = useVolumes(searchQuery);

  return (
    <div class="space-y-6 pb-12">
      {/* Header */}
      <div class="flex justify-between items-end border-b border-neutral-800 pb-4 gap-4">
        <div>
          <h2 class="text-2xl font-bold text-white tracking-tight">{t("volumes.list.title")}</h2>
          <p class="text-neutral-500 text-sm mt-1">
            {t("volumes.list.subtitle", { count: query.data?.length || 0 })}
          </p>
        </div>

        <div class="flex items-center gap-3 flex-1 justify-end">
          {/* 2. Input de Busca */}
          <SearchInput
            value={inputValue()}
            onInput={setInputValue}
            placeholder={t("volumes.list.searchPlaceholder")}
          />

          <div class="flex items-center gap-2 text-xs font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 text-neutral-400 whitespace-nowrap">
            <Show when={query.isFetching} fallback={<Zap class="w-3 h-3 text-emerald-500" />}>
              <RefreshCw class="w-3 h-3 animate-spin text-blue-500" />
            </Show>
            <span>{query.isFetching ? t("global.common.syncing") : t("global.common.online")}</span>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div class="border border-neutral-800 rounded-lg bg-neutral-900/40 overflow-hidden shadow-sm">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-neutral-900 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
              <th class="p-4 w-[35%]">{t("volumes.list.tableHeaders.nameDriver")}</th>
              <th class="p-4 w-[40%]">{t("volumes.list.tableHeaders.mountPoint")}</th>
              <th class="p-4 w-[15%]">{t("volumes.list.tableHeaders.createdAt")}</th>
              <th class="p-4 text-right w-[10%]">{t("volumes.list.tableHeaders.actions")}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-800/50 text-sm">
            <For each={query.data}>
              {(vol) => (
                <VolumeItemRow volume={vol} onInspect={() => setSelectedVolumeName(vol.Name)} />
              )}
            </For>

            <Show when={query.data?.length === 0}>
              <tr>
                <td colspan={4} class="p-12 text-center text-neutral-500">
                  <div class="flex flex-col items-center gap-2">
                    <Box class="w-8 h-8 opacity-20" />
                    <span class="italic">
                      {query.isLoading
                        ? t("volumes.list.empty.loading")
                        : t("volumes.list.empty.noVolumes")}
                    </span>
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
