import type { Component } from "solid-js";
import type { LucideProps } from "lucide-solid";

interface Props {
  icon: Component<LucideProps>;
  label: string;
  isActive: boolean;
  isExpanded: boolean;
  onClick: () => void;
}

export const SidebarItem: Component<Props> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      title={!props.isExpanded ? props.label : undefined}
      class={`
        group flex items-center w-full p-3 rounded-xl transition-all duration-200 mb-1
        ${
          props.isActive
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
            : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
        }
        ${!props.isExpanded ? "justify-center" : ""}
      `}
    >
      {/* Ícone (Sempre visível) */}
      <props.icon
        class={`w-5 h-5 shrink-0 transition-colors ${
          props.isActive ? "text-white" : "group-hover:text-white"
        }`}
      />

      {/* Texto (Com animação de largura/opacidade) */}
      <div
        class={`
          overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out
          ${props.isExpanded ? "w-32 opacity-100 ml-3" : "w-0 opacity-0 ml-0"}
        `}
      >
        <span class="font-medium text-sm text-left block">{props.label}</span>
      </div>
    </button>
  );
};
