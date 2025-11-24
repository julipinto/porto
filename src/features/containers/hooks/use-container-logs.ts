import { createSignal, onCleanup, onMount } from "solid-js";
import { listen } from "@tauri-apps/api/event";
import Converter from "ansi-to-html";
import { dockerInvoke, isDockerOnline } from "../../../lib/docker-state";

const convert = new Converter({
  fg: "#e5e5e5",
  bg: "#000000",
  newline: true,
  escapeXML: true,
});

export function useContainerLogs(containerId: string) {
  const [logs, setLogs] = createSignal<string[]>([]);
  const [isConnected, setIsConnected] = createSignal(false);

  onMount(async () => {
    if (!isDockerOnline()) {
      return;
    }

    let unlisten: (() => void) | undefined;
    const eventName = `log-stream://${containerId}`;

    try {
      unlisten = await listen<string>(eventName, (event) => {
        const html = convert.toHtml(event.payload);

        setLogs((prev) => {
          const newLogs = [...prev, html];
          if (newLogs.length > 2000) return newLogs.slice(-2000);
          return newLogs;
        });
      });

      await dockerInvoke("stream_container_logs", { id: containerId });

      setIsConnected(true);
    } catch (err) {
      console.error("Falha no stream de logs:", err);
      setIsConnected(false);
    }

    onCleanup(() => {
      if (unlisten) unlisten();
    });
  });

  return { logs, isConnected };
}
