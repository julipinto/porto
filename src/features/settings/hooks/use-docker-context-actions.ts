import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useQueryClient } from "@tanstack/solid-query";
import { getSetting, saveSetting } from "../../../stores/disk-settings-store";

const [activeConnection, setActiveConnection] = createSignal("unix:///var/run/docker.sock");
const [customPath, setCustomPath] = createSignal("");

export function useDockerContextActions() {
  const queryClient = useQueryClient();

  onMount(async () => {
    const savedConn = await getSetting<string>("docker.active-connection");
    const savedPath = await getSetting<string>("docker.custom-path");

    if (savedConn) {
      setActiveConnection(savedConn);
      await invoke("set_docker_context", { endpoint: savedConn });
    }

    if (savedPath) setCustomPath(savedPath);
  });

  const applyContext = async (endpoint: string) => {
    try {
      const formattedUri = await invoke<string>("set_docker_context", { endpoint });

      setActiveConnection(formattedUri);
      setCustomPath(formattedUri);

      // Salva no disco
      await saveSetting("docker.active-connection", formattedUri);
      await saveSetting("docker.custom-path", formattedUri);

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

      setCustomPath(selected);

      // Opcional: Se quiser conectar direto ao selecionar
      // await applyContext(selected);
    } catch (err) {
      console.error("Erro ao abrir diálogo:", err);
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
