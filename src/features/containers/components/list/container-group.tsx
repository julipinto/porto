import { createSignal, For, Show } from "solid-js";
import { ChevronRight, ChevronDown, Layers } from "lucide-solid";
import type { ContainerSummary } from "../../types";
import { ContainerItemRow } from "./container-item-row";

interface Props {
  name: string;
  containers: ContainerSummary[];
  defaultOpen?: boolean;
}

export function ContainerGroup(props: Props) {
  // Estado local de UI: O grupo sabe se está aberto ou fechado
  const [isOpen, setIsOpen] = createSignal(props.defaultOpen || false);

  const toggle = () => setIsOpen(!isOpen());

  // Computados simples
  const runningCount = () => props.containers.filter((c) => c.State === "running").length;

  return (
    <>
      {/* 1. O Cabeçalho do Grupo (Clicável) */}
      <tr
        class="bg-neutral-800/20 hover:bg-neutral-800/50 cursor-pointer transition-colors select-none group"
        onClick={toggle}
      >
        <td class="p-3 pl-2" colspan={4}>
          <div class="flex items-center gap-3">
            <div class="text-neutral-600 group-hover:text-neutral-400 transition-colors">
              <Show when={isOpen()} fallback={<ChevronRight class="w-5 h-5" />}>
                <ChevronDown class="w-5 h-5" />
              </Show>
            </div>

            <Layers class="w-5 h-5 text-blue-500/80" />

            <span class="font-bold text-neutral-200 text-sm tracking-tight">{props.name}</span>

            <span class="text-[10px] font-bold text-neutral-500 font-mono bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded ml-2">
              {runningCount()}/{props.containers.length}
            </span>
          </div>
        </td>
      </tr>

      {/* 2. Os Filhos (Renderizados condicionalmente) */}
      <Show when={isOpen()}>
        <For each={props.containers}>
          {(container) => <ContainerItemRow container={container} isNested={true} />}
        </For>
      </Show>
    </>
  );
}
