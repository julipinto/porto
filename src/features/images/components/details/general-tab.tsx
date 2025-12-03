import { type Component, For } from "solid-js";
import { Box, Calendar, HardDrive, FileCode, type LucideIcon } from "lucide-solid";
import { formatBytes, formatTimeAgo } from "../../../../utils/format";
import type { ImageInspect } from "../../hooks/use-image-details";

interface Props {
  info?: ImageInspect | null;
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
  return (
    <div class="space-y-8 p-6">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard label="Tamanho" value={formatBytes(props.info?.Size ?? 0)} icon={HardDrive} />
        <InfoCard
          label="OS / Arq"
          value={`${props.info?.Os || "?"} / ${props.info?.Architecture || "?"}`}
          icon={Box}
        />
        <InfoCard
          label="Criado"
          value={formatTimeAgo(new Date(props.info?.Created ?? 0).getTime() / 1000)}
          icon={Calendar}
        />
        <InfoCard label="Versão Docker" value={props.info?.DockerVersion || "-"} icon={FileCode} />
      </div>

      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-sm font-bold text-neutral-400 uppercase tracking-wider mb-4">
          Variáveis de Ambiente Padrão
        </h3>
        <div class="grid gap-2">
          <For
            each={props.info?.Config?.Env || []}
            fallback={
              <span class="text-neutral-500 italic text-sm">Nenhuma variável definida.</span>
            }
          >
            {(env) => (
              <div class="bg-neutral-900/50 px-3 py-2 rounded border border-neutral-800 font-mono text-xs text-neutral-300 break-all hover:border-neutral-700 transition-colors">
                {env}
              </div>
            )}
          </For>
        </div>
      </section>
    </div>
  );
};
