import { Component, createSignal, Show } from "solid-js";
import { Layers, Tag, Calendar, HardDrive, Trash2, LoaderCircle } from "lucide-solid";
import { ImageSummary } from "../types";
import { formatBytes, formatTimeAgo } from "../../../utils/format";
import { useImageActions } from "../hooks/use-image-actions";

interface Props {
  image: ImageSummary;
}

export const ImageItemRow: Component<Props> = (props) => {
  const { removeImage } = useImageActions(); // <--- Use o hook
  const [isDeleting, setIsDeleting] = createSignal(false);

  const repoTag = () => props.image.RepoTags?.[0] || "<none>:<none>";
  const name = () => repoTag().split(":")[0];
  const tag = () => repoTag().split(":")[1];
  const isDangling = () => name() === "<none>";
  const shortId = () => props.image.Id.split(":")[1]?.substring(0, 12);

  const handleDelete = async () => {
    if (isDeleting()) return;

    const confirmed = await confirm(`Tem certeza que deseja excluir a imagem ${shortId()}?`);
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await removeImage(props.image.Id);
    } catch (error) {
      alert(String(error));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <tr class="group hover:bg-neutral-800/40 transition-colors duration-150 border-b border-transparent hover:border-neutral-800">
      {/* Coluna 1: Nome e Tag */}
      <td class="p-4 align-top">
        <div class="flex items-start gap-3">
          <div class={`mt-1 ${isDangling() ? "text-neutral-600" : "text-blue-500"}`}>
            <Layers class="w-5 h-5" />
          </div>

          <div>
            <div
              class={`font-medium ${isDangling() ? "text-neutral-500 italic" : "text-neutral-200"}`}
            >
              {name()}
            </div>

            {!isDangling() && (
              <div class="flex items-center gap-1 mt-1 text-xs text-neutral-500 font-mono bg-neutral-950 px-1.5 py-0.5 rounded w-fit border border-neutral-800">
                <Tag class="w-3 h-3" />
                {tag()}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* Coluna 2: ID */}
      <td class="p-4 align-top font-mono text-xs text-neutral-600 pt-5">{shortId()}</td>

      {/* Coluna 3: Tamanho */}
      <td class="p-4 align-top pt-5">
        <div class="flex items-center gap-2 text-neutral-400">
          <HardDrive class="w-4 h-4 opacity-50" />
          {formatBytes(props.image.Size)}
        </div>
      </td>

      {/* Coluna 4: Data */}
      <td class="p-4 align-top pt-5">
        <div
          class="flex items-center gap-2 text-neutral-500"
          title={new Date(props.image.Created * 1000).toLocaleString()}
        >
          <Calendar class="w-4 h-4 opacity-50" />
          {formatTimeAgo(props.image.Created)}
        </div>
      </td>

      {/* Coluna 5: Ações */}
      <td class="p-4 text-right align-top pt-4">
        <button
          type="button"
          class="p-2 hover:bg-red-900/20 rounded-lg text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Excluir Imagem"
          onClick={handleDelete}
          disabled={isDeleting()}
        >
          <Show when={!isDeleting()} fallback={<LoaderCircle class="w-4 h-4 animate-spin" />}>
            <Trash2 class="w-4 h-4" />
          </Show>
        </button>
      </td>
    </tr>
  );
};
