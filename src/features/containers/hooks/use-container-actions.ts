import { useQueryClient } from "@tanstack/solid-query";
import { dockerInvoke } from "../../../lib/docker-state";

export function useContainerActions() {
  const queryClient = useQueryClient();

  const startContainer = async (id: string) => {
    await dockerInvoke("start_container", { id });
    queryClient.invalidateQueries({ queryKey: ["containers"] });
  };

  const stopContainer = async (id: string) => {
    await dockerInvoke("stop_container", { id });
    queryClient.invalidateQueries({ queryKey: ["containers"] });
  };

  const removeContainer = async (id: string) => {
    await dockerInvoke("remove_container", { id });
    queryClient.invalidateQueries({ queryKey: ["containers"] });
  };

  const toggleGroup = async (groupName: string, action: "start" | "stop") => {
    await dockerInvoke("manage_container_group", {
      group: groupName,
      action: action,
    });

    queryClient.invalidateQueries({ queryKey: ["containers"] });
  };

  return {
    startContainer,
    stopContainer,
    removeContainer,
    toggleGroup,
  };
}
