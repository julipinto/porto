import { invoke } from "@tauri-apps/api/core";
import { createSignal } from "solid-js";

const [isDockerOnline, setIsDockerOnline] = createSignal(true);

export async function dockerInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  // LOG DE SAÍDA
  console.log(`[Middleware] 🚀 Chamando: ${command}`, args);
  
  try {
    const result = await invoke<T>(command, args);
    
    if (!isDockerOnline()) {
      console.log("[Middleware] Sistema voltou a ficar ONLINE");
      setIsDockerOnline(true);
    }
    
    console.log(result)
    return result;
  } catch (error) {
    // LOG DE ERRO
    console.error(`[Middleware] ❌ Erro em ${command}:`, error);
    
    const errString = String(error);
    if (errString.includes("connec") || errString.includes("socket") || errString.includes("os error")) {
         console.log("[Middleware] Detectado falha crítica. Mudando para OFFLINE.");
         setIsDockerOnline(false);
    }
    
    throw error;
  }
}

export { isDockerOnline, setIsDockerOnline };