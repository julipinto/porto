import { onMount } from "solid-js";
import { getCurrentWindow, PhysicalSize, PhysicalPosition } from "@tauri-apps/api/window";
// Adicionamos availableMonitors para ver todas as telas
import { availableMonitors } from "@tauri-apps/api/window";
import { getSetting, saveSetting } from "../stores/disk-settings-store";

interface WindowState {
  width: number;
  height: number;
  x: number;
  y: number;
}

export function useWindowPersistence() {
  const appWindow = getCurrentWindow();
  let saveTimeout: number | undefined;

  const debouncedSave = () => {
    if (saveTimeout) clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async () => {
      const size = await appWindow.innerSize();
      const pos = await appWindow.outerPosition();

      const state: WindowState = {
        width: size.width,
        height: size.height,
        x: pos.x,
        y: pos.y,
      };

      await saveSetting("window-state", state);
    }, 500) as unknown as number;
  };

  const restoreState = async () => {
    try {
      const saved = await getSetting<WindowState>("window-state");
      if (!saved) return;

      const monitors = await availableMonitors();

      // Verifica se a posição salva cai dentro de ALGUM monitor conectado
      const isPositionValid = monitors.some((m) => {
        const mX = m.position.x;
        const mY = m.position.y;
        const mW = m.size.width;
        const mH = m.size.height;

        // Verifica se o canto superior esquerdo da janela salva está dentro deste monitor
        return saved.x >= mX && saved.x < mX + mW && saved.y >= mY && saved.y < mY + mH;
      });

      if (isPositionValid) {
        await appWindow.setSize(new PhysicalSize(saved.width, saved.height));
        await appWindow.setPosition(new PhysicalPosition(saved.x, saved.y));
      } else {
        console.log("Posição salva fora da área visível. Centralizando...");
        await appWindow.setSize(new PhysicalSize(saved.width, saved.height));
        await appWindow.center();
      }
    } catch (err) {
      console.error("Falha ao restaurar janela:", err);
    }
  };

  onMount(async () => {
    await restoreState();
    const unlistenResize = await appWindow.onResized(debouncedSave);
    const unlistenMove = await appWindow.onMoved(debouncedSave);

    return () => {
      unlistenResize();
      unlistenMove();
    };
  });
}
