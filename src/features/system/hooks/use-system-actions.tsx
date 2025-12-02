import { createSignal } from "solid-js";
import { useQueryClient } from "@tanstack/solid-query";
import { dockerInvoke } from "../../../lib/docker-state";
import toast from "solid-toast";
import { formatBytes } from "../../../utils/format";

export interface PruneReport {
  deleted_containers: number;
  deleted_images: number;
  deleted_networks: number;
  reclaimed_space: number;
}

export function useSystemActions() {
  const queryClient = useQueryClient();
  const [isPruning, setIsPruning] = createSignal(false);

  const pruneSystem = async () => {
    setIsPruning(true);
    try {
      const report = await dockerInvoke<PruneReport>("prune_system");

      const msg = `Limpeza concluída! Liberados ${formatBytes(report.reclaimed_space)}.`;
      toast.success(msg);

      // Atualiza todas as listas para sumir com os itens deletados
      queryClient.invalidateQueries();

      return report;
    } catch (err) {
      toast.error(String(err));
      throw err;
    } finally {
      setIsPruning(false);
    }
  };

  return { pruneSystem, isPruning };
}
