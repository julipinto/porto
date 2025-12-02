import { Box } from "lucide-solid";
import { useUIStore } from "../../../../../stores/ui-store";
import type { ContainerSummary } from "../../../types";
import { Button } from "../../../../../ui/button";

interface Props {
  container: ContainerSummary;
  isNested?: boolean;
}

export function IdentityCell(props: Props) {
  const { setSelectedContainerId } = useUIStore();
  const shortId = props.container.Id.substring(0, 12);
  const name = props.container.Names[0]?.replace("/", "") || "Sem Nome";

  return (
    <div class={`flex items-start gap-3 ${props.isNested ? "pl-10" : ""}`}>
      <div class={`flex items-start gap-3 ${props.isNested ? "pl-10" : ""}`}>
        <div class={`mt-1 shrink-0 ${props.isNested ? "text-neutral-600" : "text-neutral-400"}`}>
          {props.isNested ? (
            <div class="w-1.5 h-1.5 rounded-full bg-neutral-700 mt-1.5" />
          ) : (
            <Box class="w-4 h-4" />
          )}
        </div>
        <div class="flex flex-col min-w-0">
          <Button
            variant="link"
            onClick={() => setSelectedContainerId(props.container.Id)}
            title={props.container.Names[0] || "Sem Nome"}
            class="font-medium text-sm text-neutral-200 hover:text-blue-400 truncate"
          >
            {name}
          </Button>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="text-[10px] text-neutral-600 font-mono select-all uppercase tracking-wider">
              {shortId}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
