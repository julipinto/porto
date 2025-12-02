import type { Component } from "solid-js";
import { Cpu, CircuitBoard } from "lucide-solid"; // CircuitBoard como ícone de RAM
import { useHostStats } from "../../features/system/hooks/use-host-stats";
import { formatBytes } from "../../utils/format";

export const Footer: Component = () => {
  const stats = useHostStats();

  return (
    <footer class="h-8 bg-[#0a0a0a] border-t border-neutral-800 flex items-center justify-between px-4 text-[10px] font-mono select-none text-neutral-500">
      {/* Lado Esquerdo: Status */}
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1.5" title="Uso de CPU deste aplicativo">
          <Cpu class="w-3 h-3 text-blue-500" />
          <span>
            App CPU: <span class="text-neutral-300">{stats().cpu_usage.toFixed(1)}%</span>
          </span>
        </div>

        <div
          class="flex items-center gap-1.5"
          title="Uso de RAM deste aplicativo / Total do Sistema"
        >
          <CircuitBoard class="w-3 h-3 text-purple-500" />
          <span>
            App RAM: <span class="text-neutral-300">{formatBytes(stats().memory_used)}</span>{" "}
            <span class="opacity-30">/ {formatBytes(stats().memory_total)}</span>
          </span>
        </div>
      </div>

      {/* Lado Direito: Créditos ou Versão */}
      <div class="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
        <span>Docker Manager v0.1.0</span>
        <div class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </footer>
  );
};
