import { type Component, Show, For } from "solid-js";
import { ArrowLeft, Database, HardDrive, Link, Box, Trash2, Loader2 } from "lucide-solid";

import { createSignal } from "solid-js";
import toast from "solid-toast";
import { useUIStore } from "../../../stores/ui-store";
import { useVolumeActions } from "../hooks/use-volume-actions";
import { useVolumeDetails } from "../hooks/use-volume-details";
import { Button } from "../../../ui/button";
import { formatTimeAgo } from "../../../utils/format";

export const VolumeDetailsPage: Component = () => {
  const { selectedVolumeName, setSelectedVolumeName } = useUIStore();
  const { removeVolume } = useVolumeActions();
  const [isDeleting, setIsDeleting] = createSignal(false);

  // O nome vem da store global agora
  const volumeName = () => selectedVolumeName();

  const query = useVolumeDetails(volumeName);
  const data = () => query.data;

  const handleDelete = async () => {
    const name = volumeName();

    if (!name) return;

    const confirmed = confirm(`Tem certeza que deseja remover o volume "${name}"?`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await removeVolume(name);
      toast.success("Volume removido.");
      setSelectedVolumeName(null);
    } catch (e) {
      toast.error(String(e));
      setIsDeleting(false);
    }
  };

  return (
    <div class="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* --- HEADER DA PÁGINA --- */}
      <div class="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
        <div class="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSelectedVolumeName(null)}
            title="Voltar"
          >
            <ArrowLeft class="w-5 h-5" />
          </Button>

          <div>
            <h2 class="text-xl font-bold text-white tracking-tight flex items-center gap-3">
              {volumeName()}
              <span class="text-xs font-mono font-normal text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                VOLUME
              </span>
            </h2>
          </div>
        </div>

        <Button variant="destructive" onClick={handleDelete} disabled={isDeleting()} class="gap-2">
          <Show when={isDeleting()} fallback={<Trash2 class="w-4 h-4" />}>
            <Loader2 class="w-4 h-4 animate-spin" />
          </Show>
          Deletar Volume
        </Button>
      </div>

      {/* --- CONTEÚDO (Scrollável) --- */}
      <div class="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-8">
        <Show when={query.isLoading}>
          <div class="p-12 text-center text-neutral-500 flex flex-col items-center gap-3">
            <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
            Carregando detalhes...
          </div>
        </Show>

        <Show when={data()}>
          {/* Card Principal */}
          <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Database class="w-4 h-4" /> Informações Gerais
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoBox label="Driver" value={data()?.base.Driver} />
              <InfoBox
                label="Criado em"
                value={formatTimeAgo(new Date(data()?.base.CreatedAt || "").getTime() / 1000)}
                sub={new Date(data()?.base.CreatedAt || "").toLocaleString()}
              />
              <div class="md:col-span-2">
                <div class="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <HardDrive class="w-3 h-3" /> Mountpoint (Local no Disco)
                </div>
                <code class="block w-full bg-black/30 border border-neutral-800 p-3 rounded-lg text-sm font-mono text-neutral-300 select-text break-all">
                  {data()?.base.Mountpoint}
                </code>
              </div>
            </div>
          </section>

          {/* Lista de Containers */}
          <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
            <h3 class="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Link class="w-4 h-4" /> Utilizado por ({data()?.used_by.length})
            </h3>

            <div class="border border-neutral-800 rounded-lg overflow-hidden">
              <For
                each={data()?.used_by}
                fallback={
                  <div class="p-8 text-center text-neutral-600 italic bg-neutral-900/30">
                    Este volume não está conectado a nenhum container no momento.
                  </div>
                }
              >
                {(container) => (
                  <div class="flex items-center justify-between p-4 bg-neutral-900/20 border-b border-neutral-800 last:border-0">
                    <div class="flex items-center gap-3">
                      <div class="p-2 bg-neutral-800 rounded-lg">
                        <Box class="w-4 h-4 text-neutral-400" />
                      </div>
                      <div class="flex flex-col">
                        <span class="text-sm font-medium text-neutral-200">
                          {container.Names[0]?.replace("/", "")}
                        </span>
                        <span class="text-[10px] text-neutral-500 font-mono">
                          {container.Id.substring(0, 12)}
                        </span>
                      </div>
                    </div>
                    <div
                      class={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        container.State === "running"
                          ? "text-emerald-400 bg-emerald-500/10"
                          : "text-neutral-500 bg-neutral-800"
                      }`}
                    >
                      {container.State}
                    </div>
                  </div>
                )}
              </For>
            </div>
          </section>
        </Show>
      </div>
    </div>
  );
};

const InfoBox = (props: { label: string; value?: string; sub?: string }) => (
  <div class="bg-neutral-900/30 p-3 rounded-lg border border-neutral-800/50">
    <div class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">
      {props.label}
    </div>
    <div class="text-sm font-medium text-white truncate" title={props.value}>
      {props.value || "-"}
    </div>
    <Show when={props.sub}>
      <div class="text-[10px] text-neutral-600 mt-0.5">{props.sub}</div>
    </Show>
  </div>
);
