import { createSignal, For, Show } from "solid-js";
import { RefreshCw, Zap, Box, Download } from "lucide-solid";
import { useImages } from "../hooks/use-images";
import { ImageItemRow } from "./image-item-row";
import { createDebouncedSignal } from "../../../utils/debounce";
import { SearchInput } from "../../../ui/search-input";
import { PullImageModal } from "./pull-modal";
import { Button } from "../../../ui/button";
import { RunContainerModal } from "../../containers/components/run-container-modal";
import { useI18n } from "../../../i18n";

export function ImageList() {
  // 1. Configura o estado da busca com debounce
  const [isPullModalOpen, setIsPullModalOpen] = createSignal(false);
  const [inputValue, setInputValue, searchQuery] = createDebouncedSignal("", 300);
  const [imageToRun, setImageToRun] = createSignal<string | null>(null);
  const { t } = useI18n();
  // 2. Passa o sinal de busca para o hook
  const query = useImages(searchQuery);

  return (
    <>
      <PullImageModal isOpen={isPullModalOpen()} onClose={() => setIsPullModalOpen(false)} />

      <Show when={imageToRun()}>
        <RunContainerModal
          isOpen={true}
          onClose={() => setImageToRun(null)}
          initialImage={imageToRun() || undefined}
        />
      </Show>
      <div class="space-y-6 pb-12">
        {/* Header */}
        <div class="flex justify-between items-end border-b border-neutral-800 pb-4 gap-4">
          <div>
            <h2 class="text-2xl font-bold text-white tracking-tight">{t("images.list.title")}</h2>
            <p class="text-neutral-500 text-sm mt-1">
              {t("images.list.subtitle", { count: query.data?.length || 0 })}
            </p>
          </div>

          <div class="flex items-center gap-3 flex-1 justify-end">
            {/* Barra de Busca */}
            <SearchInput
              value={inputValue()}
              onInput={setInputValue}
              placeholder={t("images.list.searchPlaceholder")}
            />

            <Button onClick={() => setIsPullModalOpen(true)} class="shadow-lg shadow-blue-900/20">
              <Download class="w-4 h-4" />
              <span class="hidden sm:inline">{t("images.list.pullImage")}</span>
            </Button>

            {/* Status Pill */}
            <div class="flex items-center gap-2 text-xs font-mono bg-neutral-900 px-3 py-1.5 rounded border border-neutral-800 text-neutral-400 whitespace-nowrap">
              <Show when={query.isFetching} fallback={<Zap class="w-3 h-3 text-emerald-500" />}>
                <RefreshCw class="w-3 h-3 animate-spin text-blue-500" />
              </Show>
              <span>
                {query.isFetching ? t("global.common.syncing") : t("global.common.online")}
              </span>
            </div>
          </div>
        </div>

        {/* Tabela */}
        <div class="border border-neutral-800 rounded-lg bg-neutral-900/40 overflow-hidden shadow-sm">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-neutral-900 border-b border-neutral-800 text-xs uppercase tracking-wider text-neutral-500 font-semibold">
                <th class="p-4 w-[35%]">{t("images.list.tableHeaders.tagRepo")}</th>
                <th class="p-4 w-[15%]">{t("images.list.tableHeaders.id")}</th>
                <th class="p-4 w-[15%]">{t("images.list.tableHeaders.size")}</th>
                <th class="p-4 w-[20%]">{t("images.list.tableHeaders.createdAt")}</th>
                <th class="p-4 text-right w-[15%]">{t("images.list.tableHeaders.actions")}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-800/50 text-sm">
              <For each={query.data}>
                {(img) => (
                  <ImageItemRow
                    image={img}
                    onRun={() => {
                      const firstTag = img.RepoTags?.[0];
                      const isDangling = !firstTag || firstTag === "<none>:<none>";

                      const imageReference = isDangling
                        ? img.Id.replace("sha256:", "").substring(0, 12)
                        : firstTag;

                      setImageToRun(imageReference);
                    }}
                  />
                )}
              </For>

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
