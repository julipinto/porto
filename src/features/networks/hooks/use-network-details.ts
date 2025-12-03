import { useQuery } from "@tanstack/solid-query";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";
import { useDockerSystem } from "../../system/hooks/use-docker-system";
import type { Network } from "../types";

interface NetworkDetail extends Network {
  Containers?: Record<
    string,
    {
      Name: string;
      EndpointID: string;
      MacAddress: string;
      IPv4Address: string;
      IPv6Address: string;
    }
  >;
  Options?: Record<string, string>;
  Labels?: Record<string, string>;
}

export function useNetworkDetails(networkId: () => string | null) {
  const system = useDockerSystem();

  return useQuery(() => ({
    queryKey: ["network-inspect", networkId()],
    queryFn: async () => {
      const id = networkId();
      if (!id) return null;
      return await dockerInvoke<NetworkDetail>("inspect_network", { id });
    },
    enabled: isDockerOnline() && !system.isToggling() && !!networkId(),
    staleTime: 5000,
  }));
}
