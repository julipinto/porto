import { For, Show, type Component } from "solid-js";
import { ExternalLink, ChevronDown } from "lucide-solid";
import { openUrl } from "@tauri-apps/plugin-opener";
import type { ContainerSummary, PortInfo } from "../../../types";
import { Popover, PopoverContent, PopoverTrigger } from "../../../../../ui/popover";

const MAX_VISIBLE_PORTS = 1;
const PortButton: Component<{ port: PortInfo; onClick: () => void }> = (props) => (
  <button
    type="button"
    onClick={props.onClick}
    class="group/link flex items-center gap-1.5 text-xs font-mono bg-neutral-900 hover:bg-blue-900/30 border border-neutral-800 hover:border-blue-800 px-2 py-1 rounded transition-colors text-neutral-400 hover:text-blue-300 w-full max-w-[140px]"
    title={`Abrir localhost:${props.port.PublicPort}`}
  >
    <span class="truncate">
      {props.port.PublicPort}:{props.port.PrivatePort}
    </span>
    <ExternalLink class="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity shrink-0 ml-auto" />
  </button>
);

export function PortsCell(props: { container: ContainerSummary }) {
  const getAllPorts = () => {
    if (!props.container.Ports) return [];
    const published = props.container.Ports.filter((p) => p.PublicPort);
    const unique = published.filter(
      (p, index, self) => index === self.findIndex((t) => t.PublicPort === p.PublicPort),
    );
    return unique.sort((a, b) => (a.PublicPort || 0) - (b.PublicPort || 0));
  };

  const handleOpenPort = async (port?: number) => {
    if (port === undefined) return;
    try {
      await openUrl(`http://localhost:${port}`);
    } catch (e) {
      console.error(e);
    }
  };

  const allPorts = getAllPorts();
  const visiblePorts = allPorts.slice(0, MAX_VISIBLE_PORTS);
  const hiddenPorts = allPorts.slice(MAX_VISIBLE_PORTS);

  return (
    <div class="flex flex-col gap-1.5 items-start">
      {/* Portas Visíveis */}
      <For
        each={visiblePorts}
        fallback={
          hiddenPorts.length === 0 ? <span class="text-neutral-600 text-xs italic">-</span> : null
        }
      >
        {(port) => <PortButton port={port} onClick={() => handleOpenPort(port.PublicPort ?? 0)} />}
      </For>

      {/* Portas Ocultas (USANDO O NOVO COMPONENTE) */}
      <Show when={hiddenPorts.length > 0}>
        <Popover>
          {/* O Botão que abre */}
          <PopoverTrigger>
            <button
              type="button"
              class="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded transition-colors border bg-neutral-900 text-neutral-500 border-neutral-800 hover:bg-neutral-800 hover:text-neutral-400"
            >
              <span>+{hiddenPorts.length} portas</span>
              <ChevronDown class="w-3 h-3" />
            </button>
          </PopoverTrigger>

          <PopoverContent class="p-2 bg-[#1a1d24] border border-neutral-700 rounded-lg shadow-2xl flex flex-col gap-1.5 min-w-[160px] max-h-[300px] overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-100">
            <For each={hiddenPorts}>
              {(port) => (
                <PortButton port={port} onClick={() => handleOpenPort(port.PublicPort ?? 0)} />
              )}
            </For>
          </PopoverContent>
        </Popover>
      </Show>
    </div>
  );
}
