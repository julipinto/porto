import type { Component } from "solid-js";
import { Calendar, Globe, type LucideIcon, Settings, Shield } from "lucide-solid";
import { formatTimeAgo } from "../../../../utils/format";
import type { Network } from "../../types";

interface Props {
  network?: Network | null;
}

const InfoCard = (props: { label: string; value: string; icon: LucideIcon }) => (
  <div class="bg-[#161b22] border border-neutral-800 p-4 rounded-xl shadow-sm">
    <div class="flex items-center gap-2 text-neutral-500 mb-1">
      <props.icon class="w-4 h-4" />
      <span class="text-[10px] font-bold uppercase tracking-wider">{props.label}</span>
    </div>
    <div class="text-sm font-medium text-white truncate" title={props.value}>
      {props.value}
    </div>
  </div>
);

export const GeneralTab: Component<Props> = (props) => {
  if (!props.network) {
    return <div class="p-12 text-center text-neutral-600 italic">Rede não encontrada.</div>;
  }

  const config = () => props.network?.IPAM?.Config?.[0] || {};

  return (
    <div class="space-y-6 p-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard label="Driver" value={props.network.Driver} icon={Settings} />
        <InfoCard label="Escopo" value={props.network.Scope} icon={Globe} />
        <InfoCard label="Interna" value={props.network.Internal ? "Sim" : "Não"} icon={Shield} />
        <InfoCard
          label="Criada"
          value={formatTimeAgo(new Date(props.network.Created).getTime() / 1000)}
          icon={Calendar}
        />
      </div>

      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">
          Configuração IPAM (IP Address Management)
        </h3>
        <div class="grid grid-cols-2 gap-6">
          <div>
            <label for="subnet" class="text-xs text-neutral-500 block mb-1">
              Subnet
            </label>
            <code
              id="subnet"
              class="bg-neutral-900 px-2 py-1 rounded border border-neutral-800 text-emerald-400 font-mono text-sm"
            >
              {config().Subnet || "Auto / N/A"}
            </code>
          </div>
          <div>
            <label for="gateway" class="text-xs text-neutral-500 block mb-1">
              Gateway
            </label>
            <code
              id="gateway"
              class="bg-neutral-900 px-2 py-1 rounded border border-neutral-800 text-blue-400 font-mono text-sm"
            >
              {config().Gateway || "Auto / N/A"}
            </code>
          </div>
        </div>
      </section>
    </div>
  );
};
