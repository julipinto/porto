import { type Component, For, Show } from "solid-js";
import { ChevronDown, Check } from "lucide-solid";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  label?: string;
}

export const Select: Component<Props> = (props) => {
  // Encontra o label da opção selecionada para mostrar no botão
  const selectedLabel = () =>
    props.options.find((o) => o.value === props.value)?.label || props.value;

  return (
    <div class="flex items-center justify-between py-3">
      {/* Label da Configuração */}
      <Show when={props.label}>
        <span class="text-sm font-medium text-neutral-200 select-none">{props.label}</span>
      </Show>

      {/* O Dropdown */}
      <Popover>
        <PopoverTrigger class="w-48">
          <button
            type="button"
            class="flex items-center justify-between w-full px-3 py-2 text-sm bg-[#0d1117] border border-neutral-700 rounded-lg text-neutral-200 hover:border-neutral-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          >
            <span class="truncate">{selectedLabel()}</span>
            <ChevronDown class="w-4 h-4 text-neutral-500 ml-2" />
          </button>
        </PopoverTrigger>

        <PopoverContent class="w-48 p-1 bg-[#161b22] border border-neutral-700 rounded-lg shadow-xl animate-in fade-in zoom-in-95 duration-100">
          <div class="flex flex-col gap-0.5">
            <For each={props.options}>
              {(option) => (
                <button
                  type="button"
                  onClick={() => props.onChange(option.value)}
                  class={`
                    flex items-center justify-between w-full px-2 py-1.5 text-sm rounded-md transition-colors text-left
                    ${
                      props.value === option.value
                        ? "bg-blue-600 text-white"
                        : "text-neutral-300 hover:bg-neutral-800 hover:text-white"
                    }
                  `}
                >
                  <span>{option.label}</span>
                  {props.value === option.value && <Check class="w-3.5 h-3.5" />}
                </button>
              )}
            </For>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
