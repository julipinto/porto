import { type Component, createSignal, Match, Switch } from "solid-js";

// Componentes
import { DetailsHeader } from "./details-header";
import { DetailsTabs, type TabOption } from "./details-tabs";
import { useUIStore } from "../../../../stores/ui-store";
import { LogsTerminal } from "./logs/logs-terminal";
import { InspectView } from "./inspect";
import { StatsView } from "./stats";

export const ContainerDetails: Component = () => {
  const { selectedContainerId, setSelectedContainerId } = useUIStore();

  const [activeTab, setActiveTab] = createSignal<TabOption>("logs");

  const containerId = () => selectedContainerId() || "";

  return (
    <div class="flex flex-col h-full animate-in fade-in duration-300">
      {/* 1. Header */}
      <DetailsHeader containerId={containerId()} onBack={() => setSelectedContainerId(null)} />

      {/* 2. Navegação */}
      <DetailsTabs activeTab={activeTab()} onChange={setActiveTab} />

      {/* 3. Área de Conteúdo Dinâmico */}
      <div class="flex-1 bg-neutral-900/30 rounded-xl border border-neutral-800 overflow-hidden relative shadow-inner">
        <Switch>
          <Match when={activeTab() === "logs"}>
            <LogsTerminal containerId={containerId()} />
          </Match>

          <Match when={activeTab() === "inspect"}>
            <InspectView containerId={containerId()} />
          </Match>

          <Match when={activeTab() === "stats"}>
            <StatsView containerId={containerId()} />
          </Match>
        </Switch>
      </div>
    </div>
  );
};
