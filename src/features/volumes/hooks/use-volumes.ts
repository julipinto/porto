import { useQuery } from "@tanstack/solid-query";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";
import { useDockerSystem } from "../../system/hooks/use-docker-system";
import { Volume } from "../types";

export function useVolumes() {
  const system = useDockerSystem();

  return useQuery(() => ({
    queryKey: ["volumes"],
    queryFn: async () => {
      return await dockerInvoke<Volume[]>("list_volumes");
    },
    enabled: isDockerOnline() && !system.isToggling(),
    refetchOnWindowFocus: false,
    staleTime: 10000,
  }));
}
