import type { ContainerSummary } from "../../../types";

export function StatusCell(props: { container: ContainerSummary }) {
  const isRunning = props.container.State === "running";

  return (
    <div class="flex items-center gap-2">
      <div
        class={`w-2 h-2 rounded-full ${isRunning ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "bg-neutral-600"}`}
      />

      <span class={`text-xs font-medium ${isRunning ? "text-emerald-400" : "text-neutral-500"}`}>
        {props.container.State} {/* ou capitalize() se quiser "Running" */}
      </span>
    </div>
  );
}
