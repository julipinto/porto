import { useQueryClient } from "@tanstack/solid-query";
import { dockerInvoke } from "../../../lib/docker-state";

export function useNetworkActions() {
  const queryClient = useQueryClient();

  const removeNetwork = async (id: string) => {
    await dockerInvoke("remove_network", { id });
    queryClient.invalidateQueries({ queryKey: ["networks"] });
  };

  return { removeNetwork };
}
