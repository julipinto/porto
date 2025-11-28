import { Play, Square, LoaderCircle, Trash2, EllipsisVertical } from "lucide-solid";
import { createSignal, Show } from "solid-js";
import type { ContainerSummary } from "../../../types";
import { useContainerActions } from "../../../hooks/use-container-actions";

interface Props {
  container: ContainerSummary;
  parentAction?: "start" | "stop" | null;
}

export function ActionsCell(props: Props) {
  const { startContainer, stopContainer, removeContainer } = useContainerActions();
  const [localAction, setLocalAction] = createSignal<string | null>(null);

  const isRunning = props.container.State === "running";
  const containerName =
    props.container.Names[0]?.replace("/", "") || props.container.Id.substring(0, 12);

  const isLoading = () => {
    if (localAction()) return true;
    if (props.parentAction === "start" && !isRunning) return true;
    if (props.parentAction === "stop" && isRunning) return true;
    return false;
  };

  const handleToggle = async (e: MouseEvent) => {
    e.stopPropagation(); // Importante parar propagação aqui também
    if (isLoading()) return;

    const action = isRunning ? "stop" : "start";
    setLocalAction(action);
    try {
      if (action === "stop") await stopContainer(props.container.Id);
      else await startContainer(props.container.Id);
    } catch (e) {
      console.error(e);
    } finally {
      setLocalAction(null);
    }
  };

  const handleDelete = async (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLoading()) return;

    const confirmed = confirm(`Tem certeza que deseja remover o container "${containerName}"?`);
    if (!confirmed) return;

    setLocalAction("delete");
    try {
      await removeContainer(props.container.Id);
    } catch (e) {
      alert(e);
      setLocalAction(null);
    }
  };

  return (
    <div class="flex items-center justify-end gap-2">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={isLoading()}
        class={`
          p-2 rounded-lg transition-all border border-transparent disabled:opacity-50
          ${isRunning ? "text-neutral-400 hover:text-amber-400 hover:bg-amber-500/10" : "text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10"}
        `}
        title={isRunning ? "Parar" : "Iniciar"}
      >
        <Show when={!isLoading()} fallback={<LoaderCircle class="w-4 h-4 animate-spin" />}>
          <Show when={isRunning} fallback={<Play class="w-4 h-4 fill-current" />}>
            <Square class="w-4 h-4 fill-current" />
          </Show>
        </Show>
      </button>

      {/* Delete Button */}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isLoading()}
        class="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
        title="Remover"
      >
        <Show
          when={localAction() !== "delete"}
          fallback={<LoaderCircle class="w-4 h-4 animate-spin" />}
        >
          <Trash2 class="w-4 h-4" />
        </Show>
      </button>

      {/* Menu Button */}
      <button
        type="button"
        class="p-2 hover:bg-neutral-800 rounded text-neutral-600 hover:text-white transition-colors"
      >
        <EllipsisVertical class="w-4 h-4" />
      </button>
    </div>
  );
}
