import { LayoutGrid } from "lucide-solid";
import type { Component } from "solid-js";

interface Props {
  isExpanded: boolean;
}

export const SidebarHeader: Component<Props> = (props) => {
  return (
    <div class="h-16 flex items-center border-b border-white/5 mb-2 px-3 shrink-0">
      <div
        class={`flex items-center gap-3 overflow-hidden whitespace-nowrap w-full ${
          !props.isExpanded ? "justify-center" : ""
        }`}
      >
        {/* Logo mais limpo (sem fundo azul boxy) */}
        <div class="text-blue-500 shrink-0">
          <LayoutGrid class="w-7 h-7" />
        </div>

        <div
          class={`transition-all duration-300 ${
            props.isExpanded ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          <h1 class="font-bold text-lg tracking-tight text-neutral-100 leading-none">
            Porto<span class="font-normal text-neutral-500">Mng</span>
          </h1>
        </div>
      </div>
    </div>
  );
};
