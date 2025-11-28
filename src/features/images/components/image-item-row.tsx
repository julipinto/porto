import { type Component, createSignal, Show, For } from "solid-js";
import { Package, Trash2, Loader2, Calendar, HardDrive } from "lucide-solid";
import type { ImageSummary } from "../types";
import { useImageActions } from "../hooks/use-image-actions";
import { formatBytes, formatTimeAgo } from "../../../utils/format";

interface Props {
  image: ImageSummary;
}

export const ImageItemRow: Component<Props> = (props) => {
  const { removeImage } = useImageActions();
  const [isDeleting, setIsDeleting] = createSignal(false);

  // Formata o ID curto (ex: sha256:12345... -> 1234567890ab)
  const shortId = () => props.image.Id.replace("sha256:", "").substring(0, 12);

  // Pega a tag principal (ou <none> se for uma imagem intermediária)
  const mainTag = () => {
    if (props.image.RepoTags && props.image.RepoTags.length > 0) {
      return props.image.RepoTags[0];
    }
    return "<none>";
  };

  const handleDelete = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isDeleting()) return;

    const confirmed = await confirm(
      `Tem certeza que deseja remover a imagem "${mainTag()}"?\nIsso não pode ser desfeito.`,
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await removeImage(props.image.Id);
    } catch (error) {
      alert(`Erro: ${error}`);
      setIsDeleting(false);
    }
  };

  return (
    <tr class="group hover:bg-neutral-800/40 transition-colors duration-150 border-b border-transparent hover:border-neutral-800">
      {/* Tag e Repositório */}
      <td class="p-4 align-top">
        <div class="flex items-start gap-3">
          <div class="mt-1 text-blue-500 shrink-0">
            <Package class="w-5 h-5" />
          </div>
          <div class="flex flex-col min-w-0">
            <div class="font-medium text-neutral-200 truncate max-w-xs" title={mainTag()}>
              {mainTag()}
            </div>
            {/* Mostra outras tags se houver */}
            <Show when={props.image.RepoTags && props.image.RepoTags.length > 1}>
              <div class="flex flex-wrap gap-1 mt-1">
                <For each={props.image.RepoTags.slice(1)}>
                  {(tag) => (
                    <span
                      class="text-[10px] text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800 truncate max-w-[150px]"
                      title={tag}
                    >
                      {tag}
                    </span>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </td>

      {/* ID */}
      <td class="p-4 align-top text-xs font-mono text-neutral-500 pt-5">
        <span title={props.image.Id}>{shortId()}</span>
      </td>

      {/* Tamanho */}
      <td class="p-4 align-top pt-5">
        <div class="flex items-center gap-2 text-neutral-500">
          <HardDrive class="w-4 h-4 opacity-50" />
          <span class="text-sm">{formatBytes(props.image.Size)}</span>
        </div>
      </td>

      {/* Criado em */}
      <td class="p-4 align-top pt-5">
        <div class="flex items-center gap-2 text-neutral-500">
          <Calendar class="w-4 h-4 opacity-50" />
          <span class="text-sm">{formatTimeAgo(props.image.Created)}</span>
        </div>
      </td>

      {/* Ações */}
      <td class="p-4 text-right align-top pt-4">
        <button
          type="button"
          class="p-2 hover:bg-red-900/20 rounded-lg text-neutral-500 hover:text-red-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Remover Imagem"
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
