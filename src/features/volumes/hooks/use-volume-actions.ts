import { useQueryClient } from "@tanstack/solid-query";
import { dockerInvoke } from "../../../lib/docker-state";

export function useVolumeActions() {
  const queryClient = useQueryClient();

  const removeVolume = async (name: string) => {
    await dockerInvoke("remove_volume", { name });
    queryClient.invalidateQueries({ queryKey: ["volumes"] });
  };

  return { removeVolume };
}
