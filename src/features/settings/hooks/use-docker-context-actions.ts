import { createSignal } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useQueryClient } from "@tanstack/solid-query";
import { type } from "@tauri-apps/plugin-os";

export function useDockerContextActions() {
  const queryClient = useQueryClient();

  const [activeConnection, setActiveConnection] = createSignal("unix:///var/run/docker.sock");

  const [customPath, setCustomPath] = createSignal("");

  const getSystemPrefix = async () => {
    const osType = await type();
    if (osType === "windows") return "npipe://";
    return "unix://";
  };

  const applyContext = async (endpoint: string) => {
    try {
      await invoke("set_docker_context", { endpoint });
      setActiveConnection(endpoint);
      setCustomPath(endpoint);
      queryClient.invalidateQueries();
    } catch (err) {
      alert(`Erro ao conectar: ${err}`);
    }
  };

  const browseSocketFile = async () => {
    try {
      const selected = await open({
        multiple: false,
        directory: false,
      });

      if (selected === null) return;

      if (typeof selected !== "string") {
        alert("Formato de arquivo não suportado.");
        return;
      }

      const prefix = await getSystemPrefix();

      const uri = selected.startsWith(prefix) ? selected : `${prefix}${selected}`;

      setCustomPath(uri);

      // await applyContext(uri);
    } catch (err) {
      console.error("Erro ao abrir diálogo:", err);
      alert("Não foi possível abrir o seletor de arquivos.");
    }
  };

  return {
    activeConnection,
    browseSocketFile,
    applyContext,
    customPath,
    setCustomPath,
  };
}
