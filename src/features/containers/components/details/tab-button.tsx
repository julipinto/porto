import type { Component } from "solid-js";
import type { LucideProps } from "lucide-solid";

interface Props {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: Component<LucideProps>;
}

export const TabButton: Component<Props> = (props) => (
  <button
    type="button"
    onClick={props.onClick}
    class={`
      flex items-center gap-2 pb-3 text-sm font-medium transition-colors relative
      ${props.active ? "text-blue-400" : "text-neutral-500 hover:text-neutral-300"}
    `}
  >
    <props.icon class="w-4 h-4" />
    {props.label}

    {/* A linha azul embaixo da aba ativa */}
    {props.active && (
      <span class="absolute bottom-0 left-0 w-full h-0.5 bg-blue-500 rounded-t-full animate-in fade-in duration-200" />
    )}
  </button>
);
