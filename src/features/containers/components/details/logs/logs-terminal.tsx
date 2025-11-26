import { type Component, createEffect, For, Show } from "solid-js";
import { Loader2, Terminal, PowerOff } from "lucide-solid";
import { useContainerLogs } from "../../../hooks/use-container-logs";
import { useContainerInspect } from "../../../hooks/use-container-inspect";

interface Props {
  containerId: string;
}

export const LogsTerminal: Component<Props> = (props) => {
  const { logs, isConnected } = useContainerLogs(props.containerId);
  // 2. Buscamos o status
  const inspect = useContainerInspect(props.containerId);

  let bottomRef: HTMLDivElement | undefined;

  createEffect(() => {
    if (logs().length && bottomRef) {
      bottomRef.scrollIntoView({ behavior: "smooth" });
    }
  });

  // Helper para saber se está rodando
  const isRunning = () => inspect.data?.State?.Running === true;

  return (
    <div class="flex flex-col h-full bg-[#0d1117] text-xs font-mono">
      {/* Header Fixo */}
      <div class="flex-none flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/50 select-none">
        <div class="flex items-center gap-2 text-neutral-400">
          <Terminal class="w-3.5 h-3.5" />
          <span class="font-semibold">output</span>
        </div>

        <div class="flex items-center gap-2">
          <Show
            when={isConnected()}
            fallback={
              <span class="text-amber-500 text-[10px] font-bold animate-pulse">Conectando...</span>
            }
          >
            <Show
              when={isRunning()}
              fallback={
                <span class="flex items-center gap-1.5 text-neutral-500 text-[10px] font-bold uppercase">
                  <PowerOff class="w-3 h-3" />
                  Histórico (Finalizado)
                </span>
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
          </Show>
        </div>
      </div>

      {/* Área de Logs */}
      <div class="flex-1 overflow-y-auto p-4 custom-scrollbar relative">
        <Show
          when={logs().length > 0}
          fallback={
            <div class="h-full flex flex-col items-center justify-center text-neutral-600 gap-3">
              <Show when={isRunning()} fallback={<PowerOff class="w-6 h-6 opacity-20" />}>
                <Loader2 class="w-6 h-6 animate-spin opacity-50" />
              </Show>
              <p>
                {isRunning()
                  ? "Aguardando logs do container..."
                  : "Nenhum log encontrado para este container."}
              </p>
            </div>
          }
        >
          <div class="space-y-0.5">
            <For each={logs()}>
              {(line) => (
                <div
                  class="whitespace-pre-wrap break-all leading-relaxed text-neutral-300 font-mono"
                  innerHTML={line}
                />
              )}
            </For>

            {/* Indicador visual de fim de log se estiver parado */}
            <Show when={!isRunning()}>
              <div class="py-4 text-center">
                <span class="text-[10px] text-neutral-600 uppercase tracking-widest border-t border-neutral-800 pt-2 px-4">
                  Fim da transmissão
                </span>
              </div>
            </Show>

            <div ref={bottomRef} class="h-1" />
          </div>
        </Show>
      </div>
    </div>
  );
};
