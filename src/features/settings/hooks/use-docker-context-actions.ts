import { createSignal, onMount } from "solid-js";
import { invoke } from "@tauri-apps/api/core";
import { open } from "@tauri-apps/plugin-dialog";
import { useQueryClient } from "@tanstack/solid-query";
import { getSetting, saveSetting } from "../../../stores/disk-settings-store";

type ConnectionType = "local" | "remote";

interface ContextConfigResponse {
  uri: string;
  connection_type: ConnectionType;
}

// --- ESTADOS GLOBAIS (SINGLETON) ---
// Iniciam com valores padrão, mas serão sobrescritos pelo disco no onMount
const [activeConnection, setActiveConnection] = createSignal("unix:///var/run/docker.sock");
const [connectionType, setConnectionType] = createSignal<ConnectionType>("local");
const [customPath, setCustomPath] = createSignal("");

export function useDockerContextActions() {
  const queryClient = useQueryClient();

  // 1. Sincronia Inicial: Disco -> Memória -> Rust
  onMount(async () => {
    try {
      const savedConn = await getSetting<string>("docker.active-connection");
      const savedType = await getSetting<ConnectionType>("docker.connection-type");
      const savedInput = await getSetting<string>("docker.custom-path-input");

      // Se existe conexão salva, aplica no Rust e no Estado
      if (savedConn) {
        setActiveConnection(savedConn);
        if (savedType) setConnectionType(savedType);

        // Avisa o Rust para usar esse socket (sem await para não bloquear UI)
        invoke("set_docker_context", { endpoint: savedConn }).catch(console.error);
      }

      // Restaura o que estava escrito no input
      if (savedInput) setCustomPath(savedInput);
    } catch (e) {
      console.error("Erro ao carregar configurações:", e);
    }
  });

  // 2. Aplicar Contexto: UI -> Rust -> Memória -> Disco
  const applyContext = async (endpoint: string) => {
    try {
      // Chama o Rust e espera o objeto formatado { uri, connection_type }
      const response = await invoke<ContextConfigResponse>("set_docker_context", { endpoint });

      console.log("Contexto aplicado:", response);

      // Atualiza Estado em Memória
      setActiveConnection(response.uri);
      setConnectionType(response.connection_type);
      setCustomPath(response.uri); // Atualiza o input visual também

      // Salva no Disco (Persistência)
      await saveSetting("docker.active-connection", response.uri);
      await saveSetting("docker.connection-type", response.connection_type);
      await saveSetting("docker.custom-path-input", response.uri);

      // Reseta as queries para buscar dados do novo docker
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

      // Apenas preenche o input visual
      setCustomPath(selected);
      // Salva o rascunho do input no disco (opcional, mas bom para UX)
      saveSetting("docker.custom-path-input", selected);
    } catch (err) {
      console.error("Erro ao abrir diálogo:", err);
    }
  };

  return {
    activeConnection,
    connectionType,
    browseSocketFile,
    applyContext,
    customPath,
    setCustomPath,
  };
}
