import type { Component } from "solid-js";
import { FileText, Activity, Info, TerminalIcon } from "lucide-solid";

// 2. Componentes da Feature
import { DetailsHeader } from "./details-header";
import { InspectView } from "./inspect";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../ui/tabs";
import { useUIStore } from "../../../../stores/ui-store";
import { LogsTerminal } from "./logs/logs-terminal";
import { StatsView } from "./stats";
import { TerminalView } from "./terminal-view";

export const ContainerDetails: Component = () => {
  const { selectedContainerId, setSelectedContainerId } = useUIStore();

  const containerId = () => selectedContainerId() || "";

  return (
    <div class="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header (Navegação e Status) */}
      <DetailsHeader containerId={containerId()} onBack={() => setSelectedContainerId(null)} />

      {/* 3. Implementação do UI Kit Tabs */}
      <Tabs defaultValue="logs" class="flex-1 flex flex-col min-h-0">
        {/* Barra de Navegação */}
        <TabsList>
          <TabsTrigger value="inspect" class="flex items-center gap-2">
            <Info class="w-4 h-4" /> Inspect
          </TabsTrigger>

          <TabsTrigger value="logs" class="flex items-center gap-2">
            <FileText class="w-4 h-4" /> Logs
          </TabsTrigger>

          <TabsTrigger value="stats" class="flex items-center gap-2">
            <Activity class="w-4 h-4" /> Stats
          </TabsTrigger>

          <TabsTrigger value="terminal" class="flex items-center gap-2">
            <TerminalIcon class="w-4 h-4" /> Terminal
          </TabsTrigger>
        </TabsList>

        <div class="flex-1 bg-neutral-900/30 rounded-xl border border-neutral-800 overflow-hidden relative shadow-inner">
          <TabsContent value="logs" class="h-full">
            <LogsTerminal containerId={containerId()} />
          </TabsContent>

          <TabsContent value="inspect" class="h-full">
            <InspectView containerId={containerId()} />
          </TabsContent>

          <TabsContent value="stats" class="h-full">
            <StatsView containerId={containerId()} />
          </TabsContent>

          <TabsContent value="terminal" class="h-full">
            <TerminalView containerId={containerId()} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};
