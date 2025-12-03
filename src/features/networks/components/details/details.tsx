import { type Component, Show, createSignal } from "solid-js";
import { Info, Box, FileJson, Loader2 } from "lucide-solid";
import toast from "solid-toast";

import { useNetworkDetails } from "../../hooks/use-network-details";
import { useNetworkActions } from "../../hooks/use-network-actions";

import { NetworkHeader } from "./network-header";
import { GeneralTab } from "./general-tab";
import { useUIStore } from "../../../../stores/ui-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../ui/tabs/tabs";
import { ContainersTab } from "./container-tab";
import { Button } from "../../../../ui/button";

export const NetworkDetailsPage: Component = () => {
  const { selectedNetworkId, setSelectedNetworkId } = useUIStore();
  const { removeNetwork } = useNetworkActions();
  const [isDeleting, setIsDeleting] = createSignal(false);

  const query = useNetworkDetails(selectedNetworkId);
  const data = () => query.data;

  const handleDelete = async () => {
    if (!data()) return;
    if (!confirm(`Deletar rede ${data()?.Name}?`)) return;

    setIsDeleting(true);
    try {
      const net = data();
      if (!net) return;
      removeNetwork(net.Id);
      toast.success("Rede removida.");
      setSelectedNetworkId(null);
    } catch (e) {
      toast.error(String(e));
      setIsDeleting(false);
    }
  };

  return (
    <div class="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* 1. ESTADO DE CARREGAMENTO */}
      <Show when={query.isLoading}>
        <div class="p-12 flex justify-center items-center gap-3 text-neutral-500">
          <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
          Carregando detalhes da rede...
        </div>
      </Show>

      {/* 2. ESTADO DE ERRO (O que faltava!) */}
      <Show when={query.isError}>
        <div class="p-12 flex flex-col items-center gap-4 text-center">
          <div class="text-red-500 font-bold">Erro ao carregar rede</div>
          <code class="bg-red-950/30 text-red-400 px-4 py-2 rounded border border-red-900/50 font-mono text-sm break-all max-w-2xl">
            {String(query.error)}
          </code>
          <Button variant="outline" onClick={() => setSelectedNetworkId(null)}>
            Voltar para a Lista
          </Button>
        </div>
      </Show>

      {/* 3. ESTADO DE SUCESSO (Só mostra se carregou, não deu erro E tem dados) */}
      <Show when={!query.isLoading && !query.isError && data()}>
        {/* Use o operador de coalescência nula (??) para garantir um valor padrão */}
        <NetworkHeader
          name={data()?.Name ?? "Sem Nome"}
          id={data()?.Id ?? ""}
          onBack={() => setSelectedNetworkId(null)}
          onDelete={handleDelete}
          isDeleting={isDeleting()}
        />

        <Tabs defaultValue="overview" class="flex-1 flex flex-col min-h-0">
          <TabsList>
            <TabsTrigger value="overview" class="flex items-center gap-2">
              <Info class="w-4 h-4" /> Visão Geral
            </TabsTrigger>
            <TabsTrigger value="containers" class="flex items-center gap-2">
              <Box class="w-4 h-4" /> Containers
            </TabsTrigger>
            <TabsTrigger value="inspect" class="flex items-center gap-2">
              <FileJson class="w-4 h-4" /> JSON
            </TabsTrigger>
          </TabsList>

          <div class="flex-1 bg-neutral-900/30 rounded-xl border border-neutral-800 overflow-hidden relative shadow-inner">
            <TabsContent value="overview" class="h-full overflow-y-auto custom-scrollbar">
              {data() && <GeneralTab network={data()} />}
            </TabsContent>

            <TabsContent value="containers" class="h-full overflow-y-auto custom-scrollbar p-6">
              <ContainersTab containers={data()?.Containers || {}} />
            </TabsContent>

            <TabsContent
              value="inspect"
              class="h-full overflow-y-auto custom-scrollbar bg-[#0d1117] p-0"
            >
              <pre class="p-4 text-xs font-mono text-neutral-400 whitespace-pre-wrap break-all select-text">
                {JSON.stringify(data(), null, 2)}
              </pre>
            </TabsContent>
          </div>
        </Tabs>
      </Show>
    </div>
  );
};
