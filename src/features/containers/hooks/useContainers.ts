import { createQuery, useQueryClient } from "@tanstack/solid-query";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { onCleanup, onMount } from "solid-js";
import { ContainerSummary } from "../types";

export function useContainers() {
  const queryClient = useQueryClient();

  // 1. A Query principal (Dados estáticos funcionam mesmo sem eventos)
  const query = createQuery(() => ({
    queryKey: ["containers"],
    queryFn: async () => {
      return await invoke<ContainerSummary[]>("list_containers");
    },
    refetchOnWindowFocus: true,
  }));

  // 2. O Listener de Eventos (Blindado com Try/Catch)
  onMount(async () => {
    let unlisten: (() => void) | undefined;

    try {
      console.log("🔌 Tentando conectar ao socket de eventos...");
      
      // AWAIT o listener. Se a lib do Tauri estiver quebrada, o erro acontece aqui.
      unlisten = await listen("docker-event", (event) => {
        console.log("⚡ Evento Docker detectado:", event);
        queryClient.invalidateQueries({ queryKey: ["containers"] });
      });
      
      console.log("✅ Conectado aos eventos do Docker.");

    } catch (err) {
      console.error("❌ Falha crítica no sistema de eventos do Tauri:", err);
      console.warn("⚠️ O app funcionará, mas sem atualização em tempo real (Auto-refresh ativado por segurança).");
      
      // Opcional: Se os eventos falharem, podemos forçar um polling como fallback
      // Mas por enquanto, vamos apenas logar o erro para não travar a tela.
    }

    onCleanup(() => {
      if (unlisten) unlisten();
    });
  });

  return query;
}