import { type Component, createMemo } from "solid-js";
import { Terminal } from "lucide-solid";
import type { RunConfig } from "../../hooks/use-run-container";

interface Props {
  form: RunConfig;
}

export const CommandPreview: Component<Props> = (props) => {
  const command = createMemo(() => {
    const parts = ["docker run", "-d"];

    if (props.form.name) parts.push(`--name ${props.form.name}`);

    props.form.ports.forEach((p) => {
      if (p.host && p.container) parts.push(`-p ${p.host}:${p.container}`);
    });

    props.form.env.forEach((e) => {
      if (e.key) parts.push(`-e ${e.key}=${e.value}`);
    });

    props.form.mounts.forEach((m) => {
      if (m.hostPath && m.containerPath) parts.push(`-v ${m.hostPath}:${m.containerPath}`);
    });

    if (props.form.networkId) {
      parts.push(`--network ${props.form.networkId}`);
    }

    parts.push(props.form.image || "<imagem>");

    return parts.join(" ");
  });

  return (
    <div class="bg-[#0d1117] border border-neutral-800 rounded-lg p-3 group">
      <div class="flex justify-between items-center mb-2">
        <span class="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
          <Terminal class="w-3 h-3" /> Comando Gerado
        </span>
      </div>
      <code class="block font-mono text-xs text-emerald-400 break-all whitespace-pre-wrap">
        {command()}
      </code>
    </div>
  );
};
