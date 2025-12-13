import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useQueryClient } from "@tanstack/solid-query";
import { getSetting, saveSetting } from "../../../stores/disk-settings-store";

type ConnectionType = "local" | "remote";

// interface ContextConfigResponse {
//   uri: string;
//   connection_type: ConnectionType;
// }

// --- Global singleton state ---
// Starts with default values, then is overridden from disk on mount
const [activeConnection, setActiveConnection] = createSignal("unix:///var/run/docker.sock");
const [connectionType, setConnectionType] = createSignal<ConnectionType>("local");
const [isConnecting, setIsConnecting] = createSignal(false);
const [customPath, setCustomPath] = createSignal("");

export function useDockerContextActions() {
  const queryClient = useQueryClient();

  // 1. Initial sync: Disk -> Memory -> Rust
  onMount(async () => {
    try {
      const savedConn = await getSetting<string>("docker.active-connection");

      if (savedConn) {
        setCustomPath(savedConn);

        invoke("connect_and_persist", { uri: savedConn }).catch((err) =>
          console.warn("Auto-connect falhou:", err),
        );
      }
    } catch (e) {
      console.error("Erro ao carregar configurações:", e);
    }
  });

  // 2. Apply context: UI -> Rust -> Memory -> Disk
  const applyContext = async (endpoint: string) => {
    if (!endpoint) return;

    setIsConnecting(true);

    try {
      // Simplificado: Só mandamos a URI
      // O Rust retorna qual variante ele detectou (opcional usar)
      const detectedVariant = await invoke<string>("connect_and_persist", {
        uri: endpoint,
      });
      console.log("Variante detectada pelo backend:", detectedVariant);

      console.log(`Conectado em ${endpoint}. Variante detectada: ${detectedVariant}`);

      // Salvamos APENAS a URI no disco.
      // Não precisamos salvar a variante, pois ela é derivada da URI.
      await saveSetting("docker.active-connection", endpoint);
      await saveSetting("docker.custom-path-input", endpoint);
      setActiveConnection(endpoint);
      setConnectionType(detectedVariant as ConnectionType);

      queryClient.invalidateQueries();
    } catch (err) {
      console.error(err);
      alert(`Falha ao conectar: ${err}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const browseSocketFile = async () => {
    // ... (Mantenha igual ao anterior) ...
    try {
      const selected = await open({
        multiple: false,
        directory: false,
        filters: [{ name: "Docker Socket", extensions: ["sock", "socket"] }],
      });

      if (selected && typeof selected === "string") {
        setCustomPath(selected);
        saveSetting("docker.custom-path-input", selected);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return {
    activeConnection,
    connectionType,
    browseSocketFile,
    applyContext,
    customPath,
    setCustomPath,
    isConnecting,
  };
}
