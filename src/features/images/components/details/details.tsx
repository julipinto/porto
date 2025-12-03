import { type Component, Show } from "solid-js";
import { Layers, Info, FileJson, Loader2 } from "lucide-solid";
import toast from "solid-toast";

import { useImageDetails } from "../../hooks/use-image-details";
import { useImageActions } from "../../hooks/use-image-actions";

// Imports Locais
import { ImageHeader } from "./image-header";
import { GeneralTab } from "./general-tab";
import { HistoryTab } from "./history-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../ui/tabs/tabs";
import { useUIStore } from "../../../../stores/ui-store";

export const ImageDetailsPage: Component = () => {
  const { selectedImageId, setSelectedImageId, navigateToRun } = useUIStore();
  const { removeImage } = useImageActions();

  const queries = useImageDetails(selectedImageId);
  const info = () => queries.inspect.data;
  const history = () => queries.history.data;

  const shortId = () => selectedImageId()?.replace("sha256:", "").substring(0, 12);
  const tags = () => info()?.RepoTags || [];
  const mainTag = () => tags()[0] || shortId();

  const handleDelete = async () => {
    if (!confirm(`Deletar imagem ${mainTag()}?`)) return;
    const id = selectedImageId();
    if (!id) {
      toast.error("Nenhuma imagem selecionada.");
      return;
    }
    try {
      await removeImage(id);
      toast.success("Imagem removida.");
      setSelectedImageId(null);
    } catch (e) {
      toast.error(String(e));
    }
  };

  return (
    <div class="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      <ImageHeader
        mainTag={mainTag()}
        tags={tags()}
        onBack={() => setSelectedImageId(null)}
        onRun={() => navigateToRun(mainTag())}
        onDelete={handleDelete}
      />

      <div class="flex-1 overflow-hidden flex flex-col min-h-0">
        <Show when={queries.inspect.isLoading}>
          <div class="p-12 flex justify-center text-neutral-500 gap-3">
            <Loader2 class="w-8 h-8 animate-spin text-blue-500" /> Carregando detalhes...
          </div>
        </Show>

        <Show when={info()}>
          <Tabs defaultValue="overview" class="flex-1 flex flex-col min-h-0">
            <TabsList>
              <TabsTrigger value="overview" class="flex items-center gap-2">
                <Info class="w-4 h-4" /> Visão Geral
              </TabsTrigger>
              <TabsTrigger value="history" class="flex items-center gap-2">
                <Layers class="w-4 h-4" /> Histórico
              </TabsTrigger>
              <TabsTrigger value="inspect" class="flex items-center gap-2">
                <FileJson class="w-4 h-4" /> JSON
              </TabsTrigger>
            </TabsList>

            <div class="flex-1 bg-neutral-900/30 rounded-xl border border-neutral-800 overflow-hidden relative shadow-inner">
              <TabsContent value="overview" class="h-full overflow-y-auto custom-scrollbar">
                <GeneralTab info={info()} />
              </TabsContent>

              <TabsContent value="history" class="h-full overflow-y-auto custom-scrollbar p-0">
                <HistoryTab history={history() || []} />
              </TabsContent>

              <TabsContent
                value="inspect"
                class="h-full overflow-y-auto custom-scrollbar bg-[#0d1117] p-0"
              >
                <pre class="p-4 text-xs font-mono text-neutral-400 whitespace-pre-wrap break-all select-text">
                  {JSON.stringify(info(), null, 2)}
                </pre>
              </TabsContent>
            </div>
          </Tabs>
        </Show>
      </div>
    </div>
  );
};
