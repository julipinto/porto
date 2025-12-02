import { type Component, createSignal, Show } from "solid-js";
import { Database, Trash2, Loader2, FolderOpen, Clock } from "lucide-solid";
import type { Volume } from "../types";
import { useVolumeActions } from "../hooks/use-volume-actions";
import { formatTimeAgo } from "../../../utils/format";
import { Button } from "../../../ui/button";

interface Props {
  volume: Volume;
  onInspect: () => void;
}

export const VolumeItemRow: Component<Props> = (props) => {
  const { removeVolume } = useVolumeActions();
  const [isDeleting, setIsDeleting] = createSignal(false);

  // Data no formato ISO string -> Timestamp
  const createdTimestamp = () => {
    if (!props.volume.CreatedAt) return Date.now() / 1000;
    return new Date(props.volume.CreatedAt).getTime() / 1000;
  };

  const handleDelete = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isDeleting()) return;

    const confirmed = confirm(
      `Tem certeza que deseja remover o volume "${props.volume.Name}"?\nIsso apagará todos os dados permanentemente.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await removeVolume(props.volume.Name);
    } catch (error) {
      alert(`Erro: ${error}`);
      setIsDeleting(false); // Só reseta se der erro
    }
  };

  return (
    <tr class="group hover:bg-neutral-800/40 transition-colors duration-150 border-b border-transparent hover:border-neutral-800">
      {/* Nome e Driver */}
      <td class="p-4 align-top">
        <div class="flex items-start gap-3">
          <div class="mt-1 text-amber-500 shrink-0">
            <Database class="w-5 h-5" />
          </div>

          <div class="flex flex-col min-w-0">
            <Button
              variant="link"
              onClick={props.onInspect}
              class="font-medium text-neutral-200 truncate max-w-xs text-left hover:text-blue-400 hover:underline decoration-blue-500/50 decoration-2 underline-offset-2 transition-colors"
              title="Inspecionar Volume"
            >
              {props.volume.Name}
            </Button>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] uppercase tracking-wider text-neutral-500 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                {props.volume.Driver}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Mountpoint */}
      <td class="p-4 align-top text-xs font-mono text-neutral-500 pt-5">
        <div class="flex items-center gap-2 group/mount" title={props.volume.Mountpoint}>
          <FolderOpen class="w-4 h-4 opacity-30 group-hover/mount:opacity-100 transition-opacity" />
          <span class="truncate max-w-[250px] direction-rtl">{props.volume.Mountpoint}</span>
        </div>
      </td>

      {/* Data */}
      <td class="p-4 align-top pt-5">
        <div class="flex items-center gap-2 text-neutral-500">
          <Clock class="w-4 h-4 opacity-50" />
          <span class="text-sm">{formatTimeAgo(createdTimestamp())}</span>
        </div>
      </td>

      {/* Ações */}
      <td class="p-4 text-right align-top pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting()}
          title="Remover Volume"
          class="text-neutral-500 hover:text-red-400 hover:bg-red-900/20"
        >
          <Show when={!isDeleting()} fallback={<Loader2 class="w-4 h-4 animate-spin" />}>
            <Trash2 class="w-4 h-4" />
          </Show>
        </Button>
      </td>
    </tr>
  );
};
