import type { Component } from "solid-js";
import { Box } from "lucide-solid";

interface Props {
  value: string;
  onInput: (val: string) => void;
  disabled: boolean;
}

export const PullInput: Component<Props> = (props) => {
  return (
    <div>
      <label
        for="image-name"
        class="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2"
      >
        Repositório / Tag
      </label>
      <div class="relative">
        <input
          id="image-name"
          type="text"
          value={props.value}
          onInput={(e) => props.onInput(e.currentTarget.value)}
          disabled={props.disabled}
          placeholder="ex: mongo:latest"
          class="w-full bg-black/40 border border-neutral-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none font-mono text-sm transition-all disabled:opacity-50"
          // Auto-focus simples
          ref={(el) => setTimeout(() => el?.focus(), 100)}
        />
        <div class="absolute right-3 top-3 text-neutral-600 pointer-events-none">
          <Box class="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
