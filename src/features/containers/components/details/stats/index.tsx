import { type Component, createEffect, createSignal, lazy, Show, Suspense } from "solid-js";
import type { ApexOptions } from "apexcharts";
import { Cpu, HardDrive, Loader2, PowerOff } from "lucide-solid";
import { useContainerInspect } from "../../../hooks/use-container-inspect";
import { useContainerStats } from "../../../hooks/use-container-stats";
import { formatBytes } from "../../../../../utils/format";

interface Props {
  containerId: string;
}

const SolidApexCharts = lazy(() =>
  import("solid-apexcharts").then((m) => ({ default: m.SolidApexCharts })),
);

export const StatsView: Component<Props> = (props) => {
  // 1. Precisamos saber se está rodando
  const inspect = useContainerInspect(props.containerId);

  const stats = useContainerStats(props.containerId);
  const [cpuHistory, setCpuHistory] = createSignal<{ x: number; y: number }[]>([]);
  const [memHistory, setMemHistory] = createSignal<{ x: number; y: number }[]>([]);
  const [hasData, setHasData] = createSignal(false);

  createEffect(() => {
    const s = stats();
    if (s.memory_limit > 0) {
      setHasData(true);
      setCpuHistory((prev) => [...prev.slice(-30), { x: Date.now(), y: s.cpu_percent }]);
      setMemHistory((prev) => [...prev.slice(-30), { x: Date.now(), y: s.memory_usage }]);
    }
  });

  const commonOptions: ApexOptions = {
    chart: {
      id: "realtime",
      toolbar: { show: false },
      animations: { enabled: true, dynamicAnimation: { speed: 1000 } },
      background: "transparent",
    },
    theme: { mode: "dark" },
    stroke: { curve: "smooth", width: 2 },
    grid: { show: true, borderColor: "#333", strokeDashArray: 4, padding: { left: 10, right: 0 } },
    xaxis: {
      type: "datetime",
      labels: { show: false },
      tooltip: { enabled: false },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    dataLabels: { enabled: false },
    tooltip: { theme: "dark", x: { show: false } },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 90, 100] },
    },
  };

  // --- VERIFICAÇÃO DE ESTADO ---
  // Se já carregou o inspect E não está rodando...
  if (inspect.data && !inspect.data.State.Running) {
    return (
      <div class="h-full flex flex-col items-center justify-center text-neutral-500 space-y-4">
        <div class="p-4 bg-neutral-900 rounded-full border border-neutral-800">
          <PowerOff class="w-8 h-8 opacity-50" />
        </div>
        <div class="text-center">
          <h3 class="text-lg font-medium text-neutral-300">Container Parado</h3>
          <p class="text-sm max-w-xs mt-1">
            Inicie o container para visualizar as métricas de CPU e Memória em tempo real.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div class="h-full overflow-y-auto p-6 custom-scrollbar relative">
      <Show
        when={hasData()}
        fallback={
          <div class="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 gap-3">
            <Loader2 class="w-8 h-8 animate-spin text-blue-500" />
            <span>Coletando métricas iniciais...</span>
          </div>
        }
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* ... (O código dos gráficos continua exatamente igual ao anterior) ... */}
          {/* Card CPU */}
          <div class="bg-[#161b22] border border-neutral-800/50 p-5 rounded-xl shadow-sm overflow-hidden">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2.5 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                <Cpu class="w-5 h-5" />
              </div>
              <div>
                <div class="text-xs text-neutral-400 uppercase font-bold tracking-wider">
                  CPU Usage
                </div>
                <div class="text-2xl font-mono font-bold text-white flex items-baseline gap-2">
                  {stats().cpu_percent.toFixed(2)}%
                  <span class="text-sm text-neutral-500 font-normal">cores</span>
                </div>
              </div>
            </div>
            <div class="h-48 -ml-4 -mr-2">
              <Suspense fallback={<div class="h-40 bg-neutral-900/50 animate-pulse rounded" />}>
                <SolidApexCharts
                  type="area"
                  options={{
                    ...commonOptions,
                    colors: ["#3b82f6"],
                    yaxis: {
                      max: 100,
                      min: 0,
                      tickAmount: 4,
                      labels: { formatter: (val: number) => `${val.toFixed(0)}%` },
                    },
                  }}
                  series={[{ name: "CPU", data: cpuHistory() }]}
                  width="100%"
                  height="100%"
                />
              </Suspense>
            </div>
          </div>

          {/* Card Memória */}
          <div class="bg-[#161b22] border border-neutral-800/50 p-5 rounded-xl shadow-sm overflow-hidden">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2.5 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                <HardDrive class="w-5 h-5" />
              </div>
              <div>
                <div class="text-xs text-neutral-400 uppercase font-bold tracking-wider">
                  Memory Usage
                </div>
                <div class="text-2xl font-mono font-bold text-white">
                  {formatBytes(stats().memory_usage)}
                  <span class="text-sm text-neutral-500 font-normal ml-2">
                    / {formatBytes(stats().memory_limit)}
                  </span>
                </div>
              </div>
            </div>
            <div class="h-48 -ml-4 -mr-2">
              <SolidApexCharts
                type="area"
                options={{
                  ...commonOptions,
                  colors: ["#a855f7"],
                  yaxis: {
                    min: 0,
                    max: undefined,
                    tickAmount: 4,
                    labels: { formatter: (val: number) => formatBytes(val, 0) },
                  },
                }}
                series={[{ name: "Memory", data: memHistory() }]}
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};
