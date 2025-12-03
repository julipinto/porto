import { useQuery } from "@tanstack/solid-query";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";
import { useDockerSystem } from "../../system/hooks/use-docker-system";

export interface ImageInspect {
  Id: string;
  RepoTags: string[];
  Size: number;
  Created: string;
  Os: string;
  Architecture: string;
  DockerVersion: string;
  Config: {
    Env: string[];
    Cmd: string[];
    Image: string;
  };
  // ... outros campos
}

export interface HistoryResponseItem {
  Id: string;
  Created: number;
  CreatedBy: string;
  Size: number;
  Comment: string;
}

export function useImageDetails(imageId: () => string | null) {
  const system = useDockerSystem();

  const inspectQuery = useQuery(() => ({
    queryKey: ["image-inspect", imageId()],
    queryFn: async () => {
      const id = imageId();
      if (!id) return null;
      return await dockerInvoke<ImageInspect>("inspect_image", { id });
    },
    enabled: isDockerOnline() && !system.isToggling() && !!imageId(),
    staleTime: 60000,
  }));

  const historyQuery = useQuery(() => ({
    queryKey: ["image-history", imageId()],
    queryFn: async () => {
      const id = imageId();
      if (!id) return null;
      return await dockerInvoke<HistoryResponseItem[]>("history_image", { id });
    },
    enabled: isDockerOnline() && !system.isToggling() && !!imageId(),
    staleTime: 60000,
  }));

  return { inspect: inspectQuery, history: historyQuery };
}
