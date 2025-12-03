import { For, type JSX } from "solid-js";
import { Plus, Trash2 } from "lucide-solid";
import { Button } from "../button";
import { useI18n } from "../../i18n";

interface Props<T> {
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => JSX.Element;
  label: string;
  emptyText?: string;
}

export function DynamicList<T>(props: Props<T>) {
  const { t } = useI18n();
  return (
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <label for="add-item" class="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          {props.label}
        </label>
        <Button
          id="add-item"
          variant="ghost"
          size="sm" // Pequeno
          onClick={props.onAdd}
          class="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-auto py-1"
        >
          <Plus class="w-3 h-3" /> {t("global.common.add")}
        </Button>
      </div>

      <div class="space-y-2">
        <For
          each={props.items}
          fallback={
            <div class="text-xs text-neutral-600 italic py-2">
              {props.emptyText || t("global.common.noItems")}
            </div>
          }
        >
          {(item, index) => (
            <div class="flex gap-2 items-start animate-in fade-in slide-in-from-left-2 duration-200">
              <div class="flex-1 grid grid-cols-2 gap-2">{props.renderItem(item, index())}</div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => props.onRemove(index())}
                class="text-neutral-500 hover:text-red-400 hover:bg-neutral-800"
              >
                <Trash2 class="w-4 h-4" />
              </Button>
            </div>
          )}
        </For>
      </div>
    </div>
  );
}
