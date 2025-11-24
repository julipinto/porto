import { Component, createSignal, Show } from "solid-js";
import { Database, Trash2, Loader2, FolderOpen, Clock } from "lucide-solid";
import { Volume } from "../types";
import { useVolumeActions } from "../hooks/use-volume-actions";
import { formatTimeAgo } from "../../../utils/format";

interface Props {
  volume: Volume;
}

export const VolumeItemRow: Component<Props> = (props) => {
  const { removeVolume } = useVolumeActions();
  const [isDeleting, setIsDeleting] = createSignal(false);

  // Tratamento de data (String ISO -> Timestamp Unix)
  const createdTimestamp = () => {
    if (!props.volume.CreatedAt) return Date.now() / 1000;
    return new Date(props.volume.CreatedAt).getTime() / 1000;
  };

  const handleDelete = async () => {
    if (isDeleting()) return;
    const confirmed = confirm(
      `Tem certeza que deseja remover o volume "${props.volume.Name}"?\nIsso apagará todos os dados contidos nele.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await removeVolume(props.volume.Name);
    } catch (error) {
      alert(String(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr class="group hover:bg-neutral-800/40 transition-colors duration-150 border-b border-transparent hover:border-neutral-800">
      {/* Coluna 1: Nome e Driver */}
      <td class="p-4 align-top">
        <div class="flex items-start gap-3">
          <div class="mt-1 text-amber-500">
            <Database class="w-5 h-5" />
          </div>

          <div class="max-w-xs overflow-hidden">
            <div class="font-medium text-neutral-200 truncate" title={props.volume.Name}>
              {props.volume.Name}
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-xs text-neutral-500 font-mono bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                {props.volume.Driver}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Coluna 2: Mountpoint (Onde fica no disco) */}
      <td class="p-4 align-top text-xs font-mono text-neutral-500 pt-5">
        <div class="flex items-center gap-2" title={props.volume.Mountpoint}>
          <FolderOpen class="w-4 h-4 opacity-50" />
          <span class="truncate max-w-[200px] direction-rtl">{props.volume.Mountpoint}</span>
        </div>
      </td>

      {/* Coluna 3: Data */}
      <td class="p-4 align-top pt-5">
        <div class="flex items-center gap-2 text-neutral-500">
          <Clock class="w-4 h-4 opacity-50" />
          <span class="text-sm">{formatTimeAgo(createdTimestamp())}</span>
        </div>
      </td>

      {/* Coluna 4: Ações */}
      <td class="p-4 text-right align-top pt-4">
        <button
          type="button"
          class="p-2 hover:bg-red-900/20 rounded-lg text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50"
          title="Remover Volume"
          onClick={handleDelete}
          disabled={isDeleting()}
        >
          <Show when={!isDeleting()} fallback={<Loader2 class="w-4 h-4 animate-spin" />}>
            <Trash2 class="w-4 h-4" />
          </Show>
        </button>
      </td>
    </tr>
  );
};
