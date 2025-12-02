import { useQuery } from "@tanstack/solid-query";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";
import { useDockerSystem } from "../../system/hooks/use-docker-system";
import type { Volume } from "../types";
import type { ContainerSummary } from "../../containers/types";

export interface VolumeDetails {
  base: Volume;
  used_by: ContainerSummary[];
}

export function useVolumeDetails(name: () => string | null) {
  const system = useDockerSystem();

  return useQuery(() => ({
    queryKey: ["volume-details", name()],
    queryFn: async () => {
      const volName = name();
      if (!volName) return null;
      return await dockerInvoke<VolumeDetails>("inspect_volume", { name: volName });
    },
    // Só roda se tiver um nome selecionado
    enabled: isDockerOnline() && !system.isToggling() && !!name(),
    staleTime: 5000,
  }));
}
