import { HardDrive, Box, Play, Square, LoaderCircle, EllipsisVertical, Trash2 } from "lucide-solid";
import { createSignal, Show } from "solid-js";
import type { ContainerSummary } from "../types";
import { useContainerActions } from "../hooks/use-container-actions";

interface Props {
  container: ContainerSummary;
  isNested?: boolean;
}

export function ContainerItemRow(props: Props) {
  const { startContainer, stopContainer, removeContainer } = useContainerActions();

  // Estado mais granular: 'start' | 'stop' | 'delete' | null
  const [actionState, setActionState] = createSignal<string | null>(null);

  const isRunning = () => props.container.State === "running";
  const shortId = () => props.container.Id.substring(0, 12);
  const imageName = () => props.container.Image.split(":")[0];
  const imageTag = () => props.container.Image.split(":")[1] || "latest";

  // Handler para Start/Stop
  const handleToggle = async () => {
    if (actionState()) return;

    const action = isRunning() ? "stop" : "start";
    setActionState(action);

    try {
      if (action === "stop") await stopContainer(props.container.Id);
      else await startContainer(props.container.Id);
    } catch (error) {
      console.error(error);
    } finally {
      setActionState(null);
    }
  };

  // Handler para Delete
  const handleDelete = async () => {
    if (actionState()) return;

    const confirmed = confirm(
      `Tem certeza que deseja remover o container ${props.container.Names[0] || shortId()}?`,
    );
    if (!confirmed) return;

    setActionState("delete");
    try {
      await removeContainer(props.container.Id);
    } catch (error) {
      alert(`Erro: ${error}`);
      setActionState(null); // Só reseta se der erro, se der sucesso o item some da lista
    }
  };

  return (
    <tr class="group hover:bg-neutral-800/40 transition-colors duration-150 border-b border-transparent hover:border-neutral-800">
      {/* Coluna 1: Identificação */}
      <td class="p-4 align-top">
        <div class={`flex items-start gap-3 ${props.isNested ? "pl-10" : ""}`}>
          <div class={`mt-1 ${props.isNested ? "text-neutral-600" : "text-neutral-400"}`}>
            {props.isNested ? (
              <div class="w-1.5 h-1.5 rounded-full bg-neutral-700 mt-1.5" />
            ) : (
              <Box class="w-4 h-4" />
            )}
          </div>
          <div>
            <div class="font-medium text-neutral-200 group-hover:text-blue-400 transition-colors">
              {props.container.Names[0]?.replace("/", "") || "Sem Nome"}
            </div>
            <div class="text-[10px] text-neutral-600 font-mono mt-1 uppercase bg-neutral-950 inline-block px-1.5 py-0.5 rounded border border-neutral-800">
              {shortId()}
            </div>
          </div>
        </div>
      </td>

      {/* Coluna 2: Imagem */}
      <td class="p-4 align-top">
        <div class="flex items-start gap-2 text-neutral-400 max-w-[200px]">
          <HardDrive class="w-4 h-4 mt-0.5 shrink-0 opacity-50" />
          <span class="truncate" title={props.container.Image}>
            {imageName()}
            <span class="text-neutral-600">:{imageTag()}</span>
          </span>
        </div>
      </td>

      {/* Coluna 3: Status */}
      <td class="p-4 align-top">
        <div
          class={`inline-flex items-center gap-2 px-2.5 py-1 rounded-md text-xs font-medium border ${
            isRunning()
              ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20"
              : "bg-neutral-800 text-neutral-500 border-neutral-700"
          }`}
        >
          <div
            class={`w-1.5 h-1.5 rounded-full ${
              isRunning()
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                : "bg-neutral-600"
            }`}
          />
          <span class="uppercase tracking-wide">{props.container.State}</span>
        </div>
      </td>

      {/* Coluna 4: Ações */}
      <td class="p-4 text-right align-top">
        <div class="flex items-center justify-end gap-2">
          {/* START / STOP */}
          <button
            type="button"
            onClick={handleToggle}
            disabled={!!actionState()}
            title={isRunning() ? "Parar Container" : "Iniciar Container"}
            class={`
              p-2 rounded-lg transition-all border border-transparent
              disabled:opacity-50 disabled:cursor-not-allowed
              ${
                isRunning()
                  ? "text-neutral-400 hover:text-amber-400 hover:bg-amber-500/10"
                  : "text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10"
              }
            `}
          >
            <Show
              when={actionState() !== "start" && actionState() !== "stop"}
              fallback={<LoaderCircle class="w-4 h-4 animate-spin" />}
            >
              <Show when={isRunning()} fallback={<Play class="w-4 h-4 fill-current" />}>
                <Square class="w-4 h-4 fill-current" />
              </Show>
            </Show>
          </button>

          {/* DELETE BUTTON */}
          <button
            type="button"
            onClick={handleDelete}
            disabled={!!actionState()}
            title="Remover Container"
            class="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
          >
            <Show
              when={actionState() !== "delete"}
              fallback={<LoaderCircle class="w-4 h-4 animate-spin" />}
            >
              <Trash2 class="w-4 h-4" />
            </Show>
          </button>

          <button
            type="button"
            class="p-2 hover:bg-neutral-800 rounded text-neutral-600 hover:text-white transition-colors"
          >
            <EllipsisVertical class="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
