import { type Component, Show } from "solid-js";
import { Laptop, Box, FolderOpen, ArrowRight } from "lucide-solid";
import { Button } from "../../../../ui/button";

interface Props {
  type: "port" | "volume"; // Define os ícones e textos
  hostValue: string;
  containerValue: string;
  onHostInput: (val: string) => void;
  onContainerInput: (val: string) => void;
  onBrowse?: () => void; // Opcional, só para volumes
}

export const MappingRow: Component<Props> = (props) => {
  const isPort = props.type === "port";

  return (
    <div class="col-span-2 bg-neutral-900/30 border border-neutral-800 rounded-lg overflow-hidden group focus-within:border-blue-500/50 focus-within:bg-blue-500/5 transition-colors">
      {/* --- (HEADER) --- */}
      <div class="flex items-center justify-between px-1 py-1 bg-neutral-900/80 border-b border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-wider select-none">
        <div class="flex items-center gap-1.5 text-blue-400/80">
          <Laptop class="w-3 h-3" />
          <span>Seu PC (Host)</span>
        </div>

        {/* Seta indicando direção do mapeamento */}
        <ArrowRight class="w-3 h-3 text-neutral-700" />

        <div class="flex items-center gap-1.5 text-emerald-400/80">
          <span>Container</span>
          <Box class="w-3 h-3" />
        </div>
      </div>

      {/* --- O CORPO (INPUTS) --- */}
      <div class="flex items-center relative h-9">
        {/* Input Esquerdo (HOST) */}
        <div class="flex-1 relative h-full">
          <input
            type="text"
            value={props.hostValue}
            onInput={(e) => props.onHostInput(e.currentTarget.value)}
            placeholder={isPort ? "Ex: 8080" : "/home/user/projeto"}
            class="w-full h-full bg-transparent border-none outline-none text-sm px-3 text-white placeholder:text-neutral-600 font-mono"
          />

          {/* Botão de Pasta (Aparece só se tiver onBrowse) */}
          <Show when={props.onBrowse}>
            <div class="absolute right-0 top-0 h-full flex items-center pr-1">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={props.onBrowse}
                class="text-neutral-500 hover:text-white h-7 w-7"
                title="Selecionar Pasta"
              >
                <FolderOpen class="w-3.5 h-3.5" />
              </Button>
            </div>
          </Show>
        </div>

        {/* Divisor Vertical Sutil */}
        <div class="w-[1px] h-4 bg-neutral-800 mx-1"></div>

        {/* Input Direito (CONTAINER) */}
        <div class="flex-1 h-full">
          <input
            type="text"
            value={props.containerValue}
            onInput={(e) => props.onContainerInput(e.currentTarget.value)}
            placeholder={isPort ? "Ex: 80" : "/app/data"}
            class="w-full h-full bg-transparent border-none outline-none text-sm px-3 text-right text-white placeholder:text-neutral-600 font-mono"
          />
        </div>
      </div>
    </div>
  );
};
