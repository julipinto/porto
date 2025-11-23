import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { listen } from "@tauri-apps/api/event";
import { onCleanup, onMount } from "solid-js";
import { ContainerSummary } from "../types";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state"; // <--- Importe o Middleware

export function useContainers() {
  const queryClient = useQueryClient();

  const query = createQuery(() => ({
    queryKey: ["containers"],
    queryFn: async () => {
      return await dockerInvoke<ContainerSummary[]>("list_containers");
    },
    enabled: isDockerOnline(),
    retry: 1, // Tenta 1 vez antes de desistir e deixar o middleware agir
    staleTime: 10000, 
    refetchOnWindowFocus: false,
  }));

  onMount(async () => {
    let unlisten: (() => void) | undefined;
    try {
      unlisten = await listen("docker-event", () => {
        if (isDockerOnline()) {
           queryClient.invalidateQueries({ queryKey: ["containers"] });
        }
      });
    } catch (e) { console.warn(e); }
    onCleanup(() => unlisten?.());
  });

  return query;
}