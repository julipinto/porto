import { createSignal, onCleanup, onMount } from "solid-js";
import { listen } from "@tauri-apps/api/event"; // Use o 'event' que tem tipagem melhor
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";

export interface ContainerStats {
  cpu_percent: number;
  memory_usage: number;
  memory_limit: number;
  memory_percent: number;
  net_io: { rx: number; tx: number };
}

interface DockerStatsEvent {
  cpu_stats: {
    cpu_usage: {
      total_usage: number;
      percpu_usage?: number[];
    };
    system_cpu_usage: number;
    online_cpus?: number;
  };
  precpu_stats: {
    cpu_usage: {
      total_usage: number;
    };
    system_cpu_usage: number;
  };
  memory_stats: {
    usage: number;
    limit: number;
    stats?: {
      cache?: number;
    };
  };
}

export function useContainerStats(containerId: string) {
  const [stats, setStats] = createSignal<ContainerStats>({
    cpu_percent: 0,
    memory_usage: 0,
    memory_limit: 0,
    memory_percent: 0,
    net_io: { rx: 0, tx: 0 },
  });

  onMount(async () => {
    if (!isDockerOnline()) return;

    const eventName = `stats-stream://${containerId}`;
    let unlisten: (() => void) | undefined;

    try {
      unlisten = await listen<DockerStatsEvent>(eventName, (event) => {
        const data = event.payload;

        // --- CÁLCULO DE CPU ---
        let cpuPercent = 0.0;
        const cpuDelta =
          data.cpu_stats.cpu_usage.total_usage - data.precpu_stats.cpu_usage.total_usage;
        const systemDelta = data.cpu_stats.system_cpu_usage - data.precpu_stats.system_cpu_usage;
        const onlineCpus =
          data.cpu_stats.online_cpus || data.cpu_stats.cpu_usage.percpu_usage?.length || 1;

        if (systemDelta > 0.0 && cpuDelta > 0.0) {
          cpuPercent = (cpuDelta / systemDelta) * onlineCpus * 100.0;
        }

        // --- CÁLCULO DE MEMÓRIA ---
        const cache = data.memory_stats.stats?.cache || 0;
        const usedMemory = data.memory_stats.usage - cache;
        const availableMemory = data.memory_stats.limit;
        const memPercent = (usedMemory / availableMemory) * 100.0;

        setStats({
          cpu_percent: parseFloat(cpuPercent.toFixed(2)),
          memory_usage: usedMemory,
          memory_limit: availableMemory,
          memory_percent: parseFloat(memPercent.toFixed(2)),
          net_io: { rx: 0, tx: 0 },
        });
      });

      await dockerInvoke("stream_container_stats", { id: containerId });
    } catch (err) {
      console.error("Erro ao iniciar stats:", err);
    }

    onCleanup(() => {
      if (unlisten) unlisten();
    });
  });

  return stats;
}
