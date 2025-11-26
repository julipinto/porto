import { type Component, Show } from "solid-js";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  id?: string;
}

export const Switch: Component<Props> = (props) => {
  const inputId = props.id || `switch-${Math.random().toString(36).slice(2)}`;

  return (
    <div class="flex items-start justify-between gap-4 py-3">
      {/* Labels */}
      <button
        type="button"
        // Classes para remover estilo padrão de botão e alinhar texto
        class="flex flex-col cursor-pointer bg-transparent border-none p-0 text-left"
        onClick={() => props.onChange(!props.checked)}
      >
        <Show when={props.label}>
          <label
            for={inputId}
            // pointer-events-none ajuda a evitar duplo clique se o label já apontar pro input
            class="text-sm font-medium text-neutral-200 cursor-pointer select-none pointer-events-none"
          >
            {props.label}
          </label>
        </Show>
        <Show when={props.description}>
          <span class="text-xs text-neutral-500 mt-0.5 select-none">{props.description}</span>
        </Show>
      </button>

      {/* O Botão Toggle */}
      <button
        type="button"
        role="switch"
        id={inputId}
        aria-checked={props.checked}
        onClick={() => props.onChange(!props.checked)}
        class={`
          relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 
          focus-visible:ring-blue-600 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950
          ${props.checked ? "bg-blue-600" : "bg-neutral-700"}
        `}
      >
        <span class="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          class={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${props.checked ? "translate-x-5" : "translate-x-0"}
          `}
        />
      </button>
    </div>
  );
};
