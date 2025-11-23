import { createEffect, createSignal, onCleanup } from "solid-js";
import { useQueryClient } from "@tanstack/solid-query";
import { dockerInvoke, isDockerOnline, setIsDockerOnline } from "../../../lib/docker-state";

export function useDockerSystem() {
  const queryClient = useQueryClient();
  const [isToggling, setIsToggling] = createSignal(false);

  // --- LÓGICA DE POLLING ---
  createEffect(() => {
    let interval: number | undefined;

    // Se estivermos OFFLINE, inicia o polling
    if (!isDockerOnline()) {
      console.log("⚠️ Recuperação: Sondando Docker...");
      
      // O 'as unknown as number' é um truque de segurança caso seu editor
      // esteja confuso entre os tipos do Node e do Navegador.
      interval = setInterval(async () => {
        try {
          await dockerInvoke("list_containers");
          console.log("✅ Docker voltou!");
          queryClient.invalidateQueries();
        } catch (e) {
          // Continua offline...
        }
      }, 5000) as unknown as number; 
    }

    onCleanup(() => {
      // Limpa o intervalo se o componente morrer ou se o docker voltar
      if (interval) clearInterval(interval);
    });
  });

  // ... (o resto da função toggleDockerService continua igual)
  const toggleDockerService = async (action: "start" | "stop") => {
      // ... seu código anterior ...
      setIsToggling(true);
      try {
        await dockerInvoke("manage_docker", { action });
        if (action === "stop") setIsDockerOnline(false);
      } catch (err) {
        alert(`Erro: ${err}`);
      } finally {
        setTimeout(() => setIsToggling(false), 2000);
      }
  };

  return {
    isDockerDown: () => !isDockerOnline(),
    toggleDockerService,
    isToggling,
  };
}