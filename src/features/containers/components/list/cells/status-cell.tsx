import type { ContainerSummary } from "../../../types";

export function StatusCell(props: { container: ContainerSummary }) {
  const isRunning = props.container.State === "running";

  return (
    <div
      class={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        isRunning
          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
          : "bg-neutral-800/50 text-neutral-400 border-neutral-700/50"
      }`}
    >
      <div
        class={`w-1.5 h-1.5 rounded-full ${
          isRunning ? "bg-emerald-400 animate-pulse" : "bg-neutral-500"
        }`}
      />
      {props.container.State}
    </div>
  );
}
