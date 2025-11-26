import { createSignal, For, Show } from "solid-js";
import { ChevronRight, ChevronDown, Layers, Play, Square, Loader2 } from "lucide-solid";
import type { ContainerSummary } from "../../types";
import { ContainerItemRow } from "./container-item-row";
import { useContainerActions } from "../../hooks/use-container-actions";

interface Props {
  name: string;
  containers: ContainerSummary[];
  defaultOpen?: boolean;
}

export function ContainerGroup(props: Props) {
  const { toggleGroup } = useContainerActions();

  const [isOpen, setIsOpen] = createSignal(props.defaultOpen || false);
  const [isActionLoading, setIsActionLoading] = createSignal<"start" | "stop" | null>(null);

  const toggle = () => setIsOpen(!isOpen());

  const runningCount = () => props.containers.filter((c) => c.State === "running").length;
  const totalCount = () => props.containers.length;

  const isAllRunning = () => runningCount() === totalCount();

  const handleToggleClick = async (e: MouseEvent) => {
    e.stopPropagation();
    if (isActionLoading()) return;

    const action = isAllRunning() ? "stop" : "start";

    setIsActionLoading(action);

    try {
      await toggleGroup(props.name, action);
    } catch (error) {
      console.error(error);
    } finally {
      setIsActionLoading(null);
    }
  };

  return (
    <>
      {/* Cabeçalho do Grupo */}
      <tr
        class="bg-neutral-800/20 hover:bg-neutral-800/50 cursor-pointer transition-colors select-none group border-b border-transparent hover:border-neutral-800"
        onClick={toggle}
      >
        <td class="p-3 pl-2" colspan={5}>
          <div class="flex items-center justify-between pr-4">
            {/* Lado Esquerdo: Nome e Ícone */}
            <div class="flex items-center gap-3">
              <div class="text-neutral-600 group-hover:text-neutral-400 transition-colors">
                <Show when={isOpen()} fallback={<ChevronRight class="w-5 h-5" />}>
                  <ChevronDown class="w-5 h-5" />
                </Show>
              </div>

              {/* Ícone da Stack: Azul se tiver algo rodando, Cinza se tudo parado */}
              <Layers
                class={`w-5 h-5 ${runningCount() > 0 ? "text-blue-500" : "text-neutral-600"}`}
              />

              <div class="flex flex-col">
                <span class="font-bold text-neutral-200 text-sm tracking-tight">{props.name}</span>
                <span class="text-[10px] text-neutral-500 font-mono">Stack</span>
              </div>

              <span
                class={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ml-2 border ${
                  isAllRunning()
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                    : "bg-neutral-900 text-neutral-500 border-neutral-800"
                }`}
              >
                {runningCount()}/{totalCount()}
              </span>
            </div>

            <div class="flex items-center gap-1">
              <button
                type="button"
                onClick={handleToggleClick}
                disabled={!!isActionLoading()}
                title={isAllRunning() ? "Parar Stack Inteira" : "Iniciar Stack Inteira"}
                class={`
                        p-2 rounded-lg transition-all border border-transparent
                        ${
                          isAllRunning()
                            ? "text-neutral-500 hover:text-red-400 hover:bg-red-500/10"
                            : "text-neutral-500 hover:text-emerald-400 hover:bg-emerald-500/10"
                        }
                    `}
              >
                <Show when={!isActionLoading()} fallback={<Loader2 class="w-4 h-4 animate-spin" />}>
                  <Show when={isAllRunning()} fallback={<Play class="w-4 h-4 fill-current" />}>
                    <Square class="w-4 h-4 fill-current" />
                  </Show>
                </Show>
              </button>
            </div>
          </div>
        </td>
      </tr>

      <Show when={isOpen()}>
        <For each={props.containers}>
          {(container) => (
            <ContainerItemRow
              container={container}
              isNested={true}
              parentAction={isActionLoading()}
            />
          )}
        </For>
      </Show>
    </>
  );
}
