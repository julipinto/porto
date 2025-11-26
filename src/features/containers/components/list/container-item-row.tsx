import { HardDrive } from "lucide-solid";
import type { ContainerSummary } from "../../types";

// Importando as células
import { IdentityCell } from "./cells/identity-cell";
import { PortsCell } from "./cells/ports-cell";
import { StatusCell } from "./cells/status-cell";
import { ActionsCell } from "./cells/actions-cell";

interface Props {
  container: ContainerSummary;
  isNested?: boolean;
  parentAction?: "start" | "stop" | null;
}

export function ContainerItemRow(props: Props) {
  const imageName = () => props.container.Image.split(":")[0];
  const imageTag = () => props.container.Image.split(":")[1] || "latest";

  return (
    <tr class="group hover:bg-neutral-800/40 transition-colors duration-150 border-b border-transparent hover:border-neutral-800">
      {/* Identidade */}
      <td class="p-4 align-top">
        <IdentityCell container={props.container} isNested={props.isNested} />
      </td>

      {/* Imagem (Essa é simples demais pra criar componente, pode ficar aqui) */}
      <td class="p-4 align-top">
        <div class="flex items-center gap-2 text-neutral-400" title={props.container.Image}>
          <HardDrive class="w-4 h-4 shrink-0" />
          <div class="flex flex-col truncate">
            <span class="text-sm text-neutral-300 truncate">{imageName()}</span>
            <span class="text-[10px] text-neutral-500 truncate">:{imageTag()}</span>
          </div>
        </div>
      </td>

      {/* Portas */}
      <td class="p-4 align-top">
        <PortsCell container={props.container} />
      </td>

      {/* Status */}
      <td class="p-4 align-top">
        <StatusCell container={props.container} />
      </td>

      {/* Ações */}
      <td class="p-4 text-right align-top">
        <ActionsCell container={props.container} parentAction={props.parentAction} />
      </td>
    </tr>
  );
}
