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
        group flex items-center w-full p-2.5 rounded-lg mb-1 transition-all duration-200 border border-transparent
        ${
          props.isActive
            ? "bg-neutral-800 text-white shadow-sm border-neutral-700/50" // Ativo: Fundo cinza sutil + Borda leve
            : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50" // Inativo: Texto cinza + Hover leve
        }
        ${!props.isExpanded ? "justify-center" : ""}
      `}
    >
      {/* Ícone */}
      <props.icon
        class={`w-5 h-5 shrink-0 transition-colors ${
          props.isActive ? "text-blue-400" : "text-current group-hover:text-neutral-200"
        }`}
      />

      {/* Texto */}
      <div
        class={`
          overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out
          ${props.isExpanded ? "w-32 opacity-100 ml-3" : "w-0 opacity-0 ml-0"}
        `}
      >
        <span class="font-medium text-sm text-left block tracking-wide">{props.label}</span>
      </div>
    </button>
  );
};
