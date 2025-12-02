import { type Component, Show } from "solid-js";
import { Search, X } from "lucide-solid";

interface Props {
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  class?: string;
}

export const SearchInput: Component<Props> = (props) => {
  return (
    <div class={`relative group w-full max-w-xs ${props.class || ""}`}>
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search class="w-4 h-4 text-neutral-500 group-focus-within:text-blue-500 transition-colors" />
      </div>

      <input
        type="text"
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        placeholder={props.placeholder || "Buscar..."}
        class="w-full bg-neutral-900/50 border border-neutral-800 text-neutral-200 text-sm rounded-lg pl-9 pr-8 py-1.5 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 outline-none transition-all placeholder:text-neutral-600"
      />

      <Show when={props.value.length > 0}>
        <button
          type="button"
          onClick={() => props.onInput("")}
          class="absolute inset-y-0 right-0 flex items-center pr-2 text-neutral-500 hover:text-neutral-300 cursor-pointer"
          title="Limpar busca"
        >
          <X class="w-3 h-3" />
        </button>
      </Show>
    </div>
  );
};
