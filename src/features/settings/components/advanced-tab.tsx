import type { Component } from "solid-js";
import { Shield, Database } from "lucide-solid";

export const AdvancedTab: Component = () => {
  return (
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Seção: Segurança */}
      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Shield class="w-4 h-4 text-emerald-500" />
          Segurança & Conexão
        </h3>
        <p class="text-neutral-500 text-sm mb-4">
          Configurações avançadas sobre como o aplicativo se comunica com o Docker Socket.
        </p>

        <div class="p-3 bg-neutral-900/50 border border-neutral-800 rounded text-xs font-mono text-neutral-400">
          Socket Path: unix:///var/run/docker.sock
        </div>
      </section>

      {/* Seção: Dados (Exemplo futuro) */}
      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm opacity-50 cursor-not-allowed">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Database class="w-4 h-4 text-amber-500" />
          Backup de Dados
        </h3>
        <p class="text-neutral-500 text-sm">Em breve...</p>
      </section>
    </div>
  );
};
