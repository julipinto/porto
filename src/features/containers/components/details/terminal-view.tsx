import { type Component, onMount, Show } from "solid-js";
import { Terminal, PowerOff, Loader2 } from "lucide-solid";
import { useTerminal } from "../../hooks/use-terminal";
import { useContainerInspect } from "../../hooks/use-container-inspect";
import "@xterm/xterm/css/xterm.css";

interface Props {
  containerId: string;
}

const TerminalConsole: Component<{ id: string }> = (props) => {
  let terminalRef: HTMLDivElement | undefined;

  onMount(() => {
    if (terminalRef) {
      useTerminal(props.id, terminalRef);
    }
  });

  return (
    <div class="flex flex-col h-full bg-[#0d1117]">
      {/* Header do Terminal */}
      <div class="flex-none flex items-center justify-between px-4 py-2 border-b border-neutral-800 bg-neutral-900/50 select-none">
        <div class="flex items-center gap-2 text-neutral-400">
          <Terminal class="w-3.5 h-3.5" />
          <span class="font-semibold text-xs font-mono">/bin/sh</span>
        </div>
        <span class="flex items-center gap-1.5 text-emerald-500 text-[10px] uppercase font-bold">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Connected
        </span>
      </div>

      {/* Área Xterm */}
      <div class="flex-1 overflow-hidden p-1 relative">
        <div ref={terminalRef} class="h-full w-full" />
      </div>
    </div>
  );
};

const TerminalOffline: Component = () => (
  <div class="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4 bg-[#0d1117]">
    <div class="p-4 bg-neutral-900 rounded-full border border-neutral-800">
      <PowerOff class="w-8 h-8 opacity-50" />
    </div>
    <div class="text-center">
      <h3 class="text-lg font-medium text-neutral-300">Terminal Indisponível</h3>
      <p class="text-sm max-w-xs mt-1">
        O container precisa estar rodando para aceitar conexões de shell.
      </p>
    </div>
  </div>
);

// --- COMPONENTE PRINCIPAL: O Gerente ---
export const TerminalView: Component<Props> = (props) => {
  const inspect = useContainerInspect(props.containerId);
  const isRunning = () => inspect.data?.State?.Running === true;

  return (
    <div class="h-full w-full">
      <Show
        when={!inspect.isLoading}
        fallback={
          <div class="h-full flex items-center justify-center text-neutral-500 gap-2">
            <Loader2 class="w-5 h-5 animate-spin" /> Verificando status...
          </div>
        }
      >
        <Show
          when={isRunning()}
          fallback={<TerminalOffline />} // Se parado, mostra aviso
        >
          <TerminalConsole id={props.containerId} />
        </Show>
      </Show>
    </div>
  );
};
