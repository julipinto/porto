import { useQueryClient } from "@tanstack/solid-query";
import { dockerInvoke } from "../../../lib/docker-state";

export interface PortMapping {
  host: string;
  container: string;
}

export interface EnvVar {
  key: string;
  value: string;
}

export interface VolumeMount {
  hostPath: string;
  containerPath: string;
}

export interface RunConfig {
  image: string;
  name: string;
  ports: PortMapping[];
  env: EnvVar[];
  mounts: VolumeMount[];
  networkId: string;
}

export function useRunContainer() {
  const queryClient = useQueryClient();

  const runContainer = async (config: RunConfig) => {
    // Transforma os objetos em tuplas para o Rust
    const payload = {
      image: config.image,
      name: config.name || null,
      ports: config.ports.map((p) => [p.host, p.container]),
      env: config.env.map((e) => [e.key, e.value]),
      mounts: config.mounts.map((m) => [m.hostPath, m.containerPath]),
    };

    await dockerInvoke("create_and_start_container", { config: payload });

    queryClient.invalidateQueries({ queryKey: ["containers"] });
  };

  return { runContainer };
}
