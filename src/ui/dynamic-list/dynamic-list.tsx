import { For, type JSX } from "solid-js";
import { Plus, Trash2 } from "lucide-solid";

interface Props<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => JSX.Element;
  label: string;
  emptyText?: string;
}

export function DynamicList<T>(props: Props<T>) {
  return (
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <label for="add-item" class="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          {props.label}
        </label>
        <button
          id="add-item"
          type="button"
          onClick={props.onAdd}
          class="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <Plus class="w-3 h-3" /> Adicionar
        </button>
      </div>

      <div class="space-y-2">
        <For
          each={props.items}
          fallback={
            <div class="text-xs text-neutral-600 italic py-2">
              {props.emptyText || "Nenhum item configurado."}
            </div>
          }
        >
          {(item, index) => (
            <div class="flex gap-2 items-start animate-in fade-in slide-in-from-left-2 duration-200">
              <div class="flex-1 grid grid-cols-2 gap-2">{props.renderItem(item, index())}</div>
              <button
                type="button"
                onClick={() => props.onRemove(index())}
                class="p-2 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
