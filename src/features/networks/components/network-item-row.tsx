import { type Component, createSignal, Show } from "solid-js";
import { Network as NetworkIcon, Trash2, Loader2, Globe, Calendar, Shield } from "lucide-solid";
import type { Network } from "../types";
import { useNetworkActions } from "../hooks/use-network-actions";
import { formatTimeAgo } from "../../../utils/format";
import { Button } from "../../../ui/button";

interface Props {
  network: Network;
}

export const NetworkItemRow: Component<Props> = (props) => {
  const { removeNetwork } = useNetworkActions();
  const [isDeleting, setIsDeleting] = createSignal(false);

  const shortId = props.network.Id.substring(0, 12);
  const subnet = props.network.IPAM?.Config?.[0]?.Subnet || "-";

  const handleDelete = async () => {
    if (isDeleting()) return;

    const confirmed = confirm(
      `Tem certeza que deseja remover a rede "${props.network.Name}"?\nIsso falhará se houver containers conectados.`,
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      await removeNetwork(props.network.Id);
    } catch (error) {
      alert(`Erro: ${error}`);
      setIsDeleting(false);
    }
  };

  return (
    <tr class="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0">
      {/* Nome e ID */}
      <td class="p-4 align-top">
        <div class="flex items-start gap-3">
          <div class="mt-1 text-purple-500 shrink-0">
            <NetworkIcon class="w-5 h-5" />
          </div>

          <div class="flex flex-col min-w-0">
            <div class="font-medium text-sm text-neutral-200 truncate" title={props.network.Name}>
              {props.network.Name}
            </div>
            <div class="flex items-center gap-1.5 mt-0.5">
              <span class="text-[10px] text-neutral-600 font-mono select-all uppercase tracking-wide">
                {shortId}
              </span>
            </div>
          </div>
        </div>
      </td>

      {/* Driver e Escopo */}
      <td class="p-4 align-top pt-5">
        <div class="flex items-center gap-2">
          <span class="text-xs text-neutral-400 font-medium bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 capitalize">
            {props.network.Driver}
          </span>
          <Show when={props.network.Internal}>
            <span
              class="text-[10px] text-amber-500 border border-amber-500/20 px-1.5 rounded flex items-center gap-1"
              title="Rede Interna (Sem acesso externo)"
            >
              <Shield class="w-3 h-3" /> Internal
            </span>
          </Show>
        </div>
      </td>

      {/* Subnet / Gateway */}
      <td class="p-4 align-top pt-5">
        <div class="flex items-center gap-2 text-neutral-500 font-mono text-xs">
          <Globe class="w-4 h-4 opacity-50" />
          <span title="Subnet">{subnet}</span>
        </div>
      </td>

      {/* Data */}
      <td class="p-4 align-top pt-5">
        <div class="flex items-center gap-2 text-neutral-500 text-xs">
          <Calendar class="w-4 h-4 opacity-50" />
          <span>{formatTimeAgo(new Date(props.network.Created).getTime() / 1000)}</span>
        </div>
      </td>

      {/* Ações */}
      <td class="p-4 text-right align-top pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting()}
          title="Remover Rede"
          class="text-neutral-500 hover:text-red-400 hover:bg-red-900/20"
        >
          <Show when={!isDeleting()} fallback={<Loader2 class="w-4 h-4 animate-spin" />}>
            <Trash2 class="w-4 h-4" />
          </Show>
        </Button>
      </td>
    </tr>
  );
};
