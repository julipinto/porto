import { onCleanup } from "solid-js";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { isDockerOnline } from "../../../lib/docker-state";

export function useTerminal(containerId: string, terminalContainer: HTMLDivElement) {
  if (!isDockerOnline()) return;

  // 1. Configuração do Xterm.js
  const term = new Terminal({
    cursorBlink: true,
    theme: {
      background: "#0d1117",
      foreground: "#c9d1d9",
      cursor: "#58a6ff",
    },
    fontFamily: "monospace",
    fontSize: 12,
  });

  const fitAddon = new FitAddon();
  term.loadAddon(fitAddon);

  // 2. Monta no DOM
  term.open(terminalContainer);
  fitAddon.fit();

  // 3. Listener de Saída (Rust -> Xterm)
  // Quando o Docker mandar texto, escreve no terminal
  const unlistenPromise = listen<string>(`terminal-output://${containerId}`, (event) => {
    term.write(event.payload);
  });

  // 4. Listener de Entrada (Xterm -> Rust)
  // Quando o usuário digita, manda pro Rust
  term.onData((data) => {
    invoke("write_terminal", { id: containerId, data });
  });

  // 5. Inicializa a sessão no backend
  invoke("open_terminal", { id: containerId }).catch((err) => {
    term.writeln(`\x1b[31mErro ao conectar no terminal: ${err}\x1b[0m`);
  });

  // Resize Observer para ajustar o terminal se a janela mudar
  const resizeObserver = new ResizeObserver(() => fitAddon.fit());
  resizeObserver.observe(terminalContainer);

  onCleanup(async () => {
    term.dispose();
    resizeObserver.disconnect();
    const unlisten = await unlistenPromise;
    unlisten();
    // Opcional: Avisar o backend para matar a sessão
  });

  return term;
}
