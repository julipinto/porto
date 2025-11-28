import { type Component, createSignal, Show } from "solid-js";
import { Download, Loader2 } from "lucide-solid";
import toast from "solid-toast";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { useQueryClient } from "@tanstack/solid-query";

// UI
import { Modal } from "../../../../ui/modal";

// Componentes Locais
import { PullInput } from "./pull-input";
import { ProgressList } from "./progress-list";
import type { DockerProgress, LayerState } from "./types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PullImageModal: Component<Props> = (props) => {
  const queryClient = useQueryClient();

  // Estados
  const [imageName, setImageName] = createSignal("");
  const [isPulling, setIsPulling] = createSignal(false);
  const [layers, setLayers] = createSignal<Record<string, LayerState>>({});
  const [statusMessage, setStatusMessage] = createSignal("");

  // --- Lógica de Controle (Handlers) ---

  const handleClose = () => {
    if (isPulling()) return;
    setImageName("");
    setLayers({});
    setStatusMessage("");
    props.onClose();
  };

  const handleSuccess = () => {
    setIsPulling(false);
    toast.success("Imagem baixada com sucesso!");
    queryClient.invalidateQueries({ queryKey: ["images"] });
    setTimeout(handleClose, 3000);
  };

  const handlePull = async () => {
    if (!imageName()) return;

    setIsPulling(true);
    setLayers({});
    setStatusMessage("Iniciando conexão...");

    // Listeners do Evento
    const unlistenProgress = await listen<DockerProgress>("pull-progress", (e) => {
      const data = e.payload;

      // 1. Atualiza Layers
      if (data.id) {
        const layerId = data.id;
        setLayers((prev) => {
          const currentTotal = data.progressDetail?.total || prev[layerId]?.total || 0;
          const currentVal = data.progressDetail?.current || prev[layerId]?.current || 0;

          let pct = prev[layerId]?.percentage || 0;
          if (currentTotal > 0) pct = (currentVal / currentTotal) * 100;

          // Força 100% se acabou
          if (
            data.status === "Pull complete" ||
            data.status === "Already exists" ||
            data.status.includes("complete")
          ) {
            pct = 100;
          }

          return {
            ...prev,
            [layerId]: {
              status: data.status,
              current: currentVal,
              total: currentTotal,
              percentage: pct,
            },
          };
        });
      }
      // 2. Atualiza Mensagem Global
      else {
        setStatusMessage(data.status);
        if (
          data.status.includes("Downloaded newer image") ||
          data.status.includes("Image is up to date")
        ) {
          handleSuccess();
        }
      }
    });

    const unlistenComplete = await listen("pull-complete", () => {
      // Força visual de sucesso em tudo
      setLayers((prev) => {
        const completedLayers: Record<string, LayerState> = {};
        for (const [id, layer] of Object.entries(prev)) {
          completedLayers[id] = { ...layer, status: "Concluído", percentage: 100 };
        }
        return completedLayers;
      });
      setStatusMessage("Download finalizado!");
      handleSuccess();
      cleanup();
    });

    const unlistenError = await listen<string>("pull-error", (e) => {
      toast.error(e.payload);
      setStatusMessage(`Erro: ${e.payload}`);
      cleanup();
      setIsPulling(false);
    });

    const cleanup = () => {
      unlistenProgress();
      unlistenComplete();
      unlistenError();
    };

    // Dispara Comando
    try {
      await invoke("pull_image", { image: imageName() });
    } catch (err) {
      toast.error(String(err));
      cleanup();
      setIsPulling(false);
    }
  };

  // --- Renderização ---

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleClose}
      title="Baixar Nova Imagem"
      maxWidth="max-w-xl"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            disabled={isPulling()}
            class="px-4 py-2 text-sm text-neutral-400 hover:text-white disabled:opacity-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handlePull}
            disabled={isPulling() || !imageName()}
            class="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-900/20"
          >
            <Show when={isPulling()} fallback={<Download class="w-4 h-4" />}>
              <Loader2 class="w-4 h-4 animate-spin" />
            </Show>
            {isPulling() ? "Baixando..." : "Pull"}
          </button>
        </>
      }
    >
      <div class="space-y-6">
        <PullInput value={imageName()} onInput={setImageName} disabled={isPulling()} />

        <ProgressList layers={layers()} isPulling={isPulling()} statusMessage={statusMessage()} />
      </div>
    </Modal>
  );
};
