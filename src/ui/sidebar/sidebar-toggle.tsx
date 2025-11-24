import { ChevronLeft, ChevronRight } from "lucide-solid";
import { type Component, Show } from "solid-js";

interface Props {
  isExpanded: boolean;
  onToggle: () => void;
}

export const SidebarToggle: Component<Props> = (props) => {
  return (
    <button
      type="button"
      onClick={props.onToggle}
      class="w-full flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:bg-neutral-900 hover:text-white transition-colors mt-2"
      title={props.isExpanded ? "Recolher menu" : "Expandir menu"}
    >
      <Show when={props.isExpanded} fallback={<ChevronRight class="w-5 h-5" />}>
        <ChevronLeft class="w-5 h-5" />
      </Show>
    </button>
  );
};
