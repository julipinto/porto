import { type Component, For } from "solid-js";
import { Box } from "lucide-solid";

interface Props {
  containers: Record<
    string,
    {
      Name: string;
      IPv4Address: string;
      IPv6Address: string;
    }
  >;
}
export const ContainersTab: Component<Props> = (props) => {
  const list = () => Object.values(props.containers || {});

  return (
    <div class="border border-neutral-800 rounded-lg overflow-hidden">
      <div class="flex gap-4 p-3 bg-[#0d1117] border-b border-neutral-800 text-neutral-500 font-bold text-xs uppercase tracking-wider">
        <div class="flex-1">Container</div>
        <div class="w-40">IPv4 Address</div>
        <div class="w-40">IPv6 Address</div>
      </div>

      <For
        each={list()}
        fallback={
          <div class="p-12 text-center text-neutral-600 italic">
            Nenhum container conectado nesta rede.
          </div>
        }
      >
        {(c) => (
          <div class="flex gap-4 p-3 border-b border-neutral-800 last:border-0 bg-neutral-900/20 hover:bg-white/[0.02] items-center transition-colors text-sm">
            <div class="flex-1 flex items-center gap-3 font-medium text-white">
              <Box class="w-4 h-4 text-blue-500" />
              {c.Name}
            </div>
            <div class="w-40 font-mono text-emerald-400 text-xs">
              {c.IPv4Address.split("/")[0] || "-"}
            </div>
            <div class="w-40 font-mono text-amber-400 text-xs">{c.IPv6Address || "-"}</div>
          </div>
        )}
      </For>
    </div>
  );
};
