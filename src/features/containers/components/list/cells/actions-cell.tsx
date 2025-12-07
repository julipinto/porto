import { Play, Square, LoaderCircle, Trash2, EllipsisVertical } from "lucide-solid";
import { createSignal, Show } from "solid-js";
import type { ContainerSummary } from "../../../types";
import { useContainerActions } from "../../../hooks/use-container-actions";
import { Button } from "../../../../../ui/button";
import { useI18n } from "../../../../../i18n";

interface Props {
  container: ContainerSummary;
  parentAction?: "start" | "stop" | null;
}

export function ActionsCell(props: Props) {
  const { startContainer, stopContainer, removeContainer } = useContainerActions();
  const { t } = useI18n();
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

    const confirmed = confirm(t("containers.actions.confirmDelete", { name: containerName }));
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
      {/* Botão Start/Stop */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleToggle}
        disabled={isLoading()}
        title={isRunning ? t("containers.actions.stop") : t("containers.actions.start")}
        class={
          isRunning
            ? "text-neutral-400 hover:text-amber-400 hover:bg-amber-500/10"
            : "text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10"
        }
      >
        <Show when={!isLoading()} fallback={<LoaderCircle class="w-4 h-4 animate-spin" />}>
          <Show when={isRunning} fallback={<Play class="w-4 h-4 fill-current" />}>
            <Square class="w-4 h-4 fill-current" />
          </Show>
        </Show>
      </Button>

      {/* Botão Deletar */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        disabled={isLoading()}
        title={t("containers.actions.remove")}
        class="text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
      >
        <Show
          when={localAction() !== "delete"}
          fallback={<LoaderCircle class="w-4 h-4 animate-spin" />}
        >
          <Trash2 class="w-4 h-4" />
        </Show>
      </Button>

      {/* Botão Menu */}
      {/* Soon: bring quick actions here */}
      {/* <Button
        variant="ghost"
        size="icon"
        class="text-neutral-600 hover:text-white hover:bg-neutral-800"
      >
        <EllipsisVertical class="w-4 h-4" />
      </Button> */}
    </div>
  );
}
