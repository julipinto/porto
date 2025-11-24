import type { Component } from "solid-js";
import { FileText, Activity, Info } from "lucide-solid";
import { TabButton } from "./tab-button";

// Exportamos o tipo para usar no pai
export type TabOption = "logs" | "inspect" | "stats";

interface Props {
  activeTab: TabOption;
  onChange: (tab: TabOption) => void;
}

export const DetailsTabs: Component<Props> = (props) => {
  return (
    <div class="flex items-center gap-6 border-b border-neutral-800 mb-4 px-1">
      <TabButton
        active={props.activeTab === "logs"}
        onClick={() => props.onChange("logs")}
        label="Logs"
        icon={FileText}
      />
      <TabButton
        active={props.activeTab === "inspect"}
        onClick={() => props.onChange("inspect")}
        label="Inspect"
        icon={Info}
      />
      <TabButton
        active={props.activeTab === "stats"}
        onClick={() => props.onChange("stats")}
        label="Stats"
        icon={Activity}
      />
    </div>
  );
};
