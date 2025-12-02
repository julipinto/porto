import { useQuery } from "@tanstack/solid-query";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";
import { useDockerSystem } from "../../system/hooks/use-docker-system";
import type { Network } from "../types";

export function useNetworks(searchParam: () => string) {
  const system = useDockerSystem();

  return useQuery(() => ({
    queryKey: ["networks", searchParam()],
    queryFn: async () => {
      return await dockerInvoke<Network[]>("list_networks", {
        search: searchParam() || null,
      });
    },
    enabled: isDockerOnline() && !system.isToggling(),
    refetchOnWindowFocus: false,
    staleTime: 10000,
  }));
}
