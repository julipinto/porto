import { type Component, For, Show } from "solid-js";
import { ArrowLeft, Play, Trash2, Tag } from "lucide-solid";
import { Button } from "../../../../ui/button";

interface Props {
  mainTag: string | undefined;
  tags: string[];
  onBack: () => void;
  onRun: () => void;
  onDelete: () => void;
}

export const ImageHeader: Component<Props> = (props) => {
  return (
    <div class="flex items-center justify-between border-b border-neutral-800 pb-4 mb-6">
      <div class="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={props.onBack} title="Voltar">
          <ArrowLeft class="w-5 h-5" />
        </Button>

        <div>
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-white tracking-tight">{props.mainTag}</h2>
            <span class="text-[10px] font-bold text-neutral-500 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 uppercase tracking-wider">
              IMAGE
            </span>
          </div>

          <Show when={props.tags.length > 1}>
            <div class="flex gap-2 mt-1.5">
              <For each={props.tags.slice(1)}>
                {(t) => (
                  <div class="flex items-center gap-1 text-[10px] text-neutral-400 bg-neutral-900/50 px-1.5 py-0.5 rounded border border-neutral-800">
                    <Tag class="w-3 h-3 opacity-50" /> {t.split(":")[1]}
                  </div>
                )}
              </For>
            </div>
          </Show>
        </div>
      </div>

      <div class="flex gap-2">
        <Button onClick={props.onRun} class="gap-2 shadow-lg shadow-blue-900/20">
          <Play class="w-4 h-4 fill-current" /> Run
        </Button>
        <Button
          variant="ghost"
          onClick={props.onDelete}
          size="icon"
          class="text-neutral-500 hover:text-red-400 hover:bg-red-900/20"
        >
          <Trash2 class="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
