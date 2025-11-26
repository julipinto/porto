import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";

export interface DockerContext {
  Name: string;
  Description?: string;
  DockerEndpoint?: string;
  Current: boolean;
}

export function useDockerContexts() {
  const [contexts, setContexts] = createSignal<DockerContext[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const fetchContexts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await invoke<DockerContext[]>("list_docker_contexts");
      setContexts(data);
    } catch (err) {
      console.error(err);
      setError("Não foi possível listar os contextos. O Docker CLI está instalado?");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(() => {
    fetchContexts();
  });

  return { contexts, isLoading, error, refetch: fetchContexts };
}
