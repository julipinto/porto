import { type Component, createEffect, For, Show } from "solid-js";
import { Loader2, Terminal } from "lucide-solid";
import { useContainerLogs } from "../../../hooks/use-container-logs";

interface Props {
  containerId: string;
}

export const LogsTerminal: Component<Props> = (props) => {
  const { logs, isConnected } = useContainerLogs(props.containerId);
  let bottomRef: HTMLDivElement | undefined;

  // Auto-scroll: Sempre que o tamanho dos logs mudar, rola para baixo
  createEffect(() => {
    // Acessar logs().length cria a dependência reativa
    if (logs().length && bottomRef) {
      bottomRef.scrollIntoView({ behavior: "smooth" });
    }
  });

  return (
    <div class="flex flex-col h-full bg-[#0d1117] text-xs font-mono">
      <div class="flex-none flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/50 select-none">
        <div class="flex items-center gap-2 text-neutral-400">
          <Terminal class="w-3.5 h-3.5" />
          <span class="font-semibold">output</span>
        </div>

        <div class="flex items-center gap-2">
          <Show
            when={isConnected()}
            fallback={
              <span class="text-red-500 text-[10px] uppercase font-bold">Desconectado</span>
            }
          >
            <span class="flex items-center gap-1.5 text-emerald-500 text-[10px] uppercase font-bold">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Stream
            </span>
          </Show>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
        <Show
          when={logs().length > 0}
          fallback={
            <div class="h-full flex flex-col items-center justify-center text-neutral-600 gap-3">
              <Loader2 class="w-6 h-6 animate-spin opacity-50" />
              <p>Aguardando logs do container...</p>
            </div>
          }
        >
          <div class="space-y-0.5">
            <For each={logs()}>
              {(line) => (
                // innerHTML é necessário porque convertemos ANSI para tags <span> com cores
                <div
                  class="whitespace-pre-wrap break-all leading-relaxed text-neutral-300 font-mono"
                  innerHTML={line}
                />
              )}
            </For>

            {/* Elemento invisível para ancorar o scroll no final */}
            <div ref={bottomRef} class="h-1" />
          </div>
        </Show>
      </div>
    </div>
  );
};
