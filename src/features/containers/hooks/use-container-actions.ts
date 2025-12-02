import { useQueryClient } from "@tanstack/solid-query";
import { dockerInvoke } from "../../../lib/docker-state";

export function useContainerActions() {
  const queryClient = useQueryClient();

  const refreshContainer = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["containers"] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["container-inspect", id] });
    }
  };

  const startContainer = async (id: string) => {
    await dockerInvoke("start_container", { id });
    refreshContainer(id);
  };

  const stopContainer = async (id: string) => {
    await dockerInvoke("stop_container", { id });
    refreshContainer(id);
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
    queryClient.invalidateQueries({ queryKey: ["container-inspect"] });
  };

  return {
    startContainer,
    stopContainer,
    removeContainer,
    toggleGroup,
  };
}
