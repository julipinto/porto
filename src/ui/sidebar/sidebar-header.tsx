import { LayoutGrid } from "lucide-solid";
import type { Component } from "solid-js";

interface Props {
  isExpanded: boolean;
}

export const SidebarHeader: Component<Props> = (props) => {
  return (
    <div class="h-16 flex items-center border-b border-neutral-800/50 mb-4 px-3">
      <div
        class={`flex items-center gap-3 overflow-hidden whitespace-nowrap w-full ${!props.isExpanded ? "justify-center" : ""}`}
      >
        {/* Logo Box */}
        <div class="p-2 bg-blue-600 rounded-lg shrink-0 shadow-lg shadow-blue-900/20">
          <LayoutGrid class="w-5 h-5 text-white" />
        </div>

        {/* Título com Fade */}
        <div
          class={`transition-all duration-300 ${props.isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"}`}
        >
          <h1 class="font-bold text-lg tracking-tight text-white leading-none">
            Docker<span class="text-blue-500">Mng</span>
          </h1>
        </div>
      </div>
    </div>
  );
};
