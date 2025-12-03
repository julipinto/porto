import { type Component, Show } from "solid-js";
import { ArrowLeft, Trash2, Loader2, Network as NetworkIcon } from "lucide-solid";
import { Button } from "../../../../ui/button";

interface Props {
  name: string;
  id: string;
  onBack: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const NetworkHeader: Component<Props> = (props) => {
  return (
    <div class="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={props.onBack} title="Voltar">
          <ArrowLeft class="w-5 h-5" />
        </Button>

        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-white tracking-tight">{props.name}</h2>
            <span class="text-[10px] font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 uppercase tracking-wider">
              NETWORK
            </span>
          </div>
          <div class="flex items-center gap-2 mt-1 text-xs text-neutral-500 font-mono">
            <NetworkIcon class="w-3 h-3 opacity-50" />
            <span class="select-all">{props.id.substring(0, 12)}</span>
          </div>
        </div>
      </div>

      <Button
        variant="destructive"
        onClick={props.onDelete}
        disabled={props.isDeleting}
        size="icon"
      >
        <Show when={!props.isDeleting} fallback={<Loader2 class="w-4 h-4 animate-spin" />}>
          <Trash2 class="w-4 h-4" />
        </Show>
      </Button>
    </div>
  );
};
