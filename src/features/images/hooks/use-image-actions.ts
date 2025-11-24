import { useQueryClient } from "@tanstack/solid-query";
import { dockerInvoke } from "../../../lib/docker-state";

export function useImageActions() {
  const queryClient = useQueryClient();

  const removeImage = async (id: string) => {
    await dockerInvoke("remove_image", { id });
    queryClient.invalidateQueries({ queryKey: ["images"] });
  };

  return {
    removeImage,
  };
}
