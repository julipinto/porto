import { Box, Layers, Database, Settings } from "lucide-solid";
import type { Component } from "solid-js";
import { useUIStore } from "../../stores/ui-store";

import { SidebarHeader } from "./sidebar-header";
import { SidebarItem } from "./sidebar-item";
import { SidebarToggle } from "./sidebar-toggle";

export const Sidebar: Component = () => {
  const { isSidebarExpanded, toggleSidebar, activeView, setActiveView } = useUIStore();

  return (
    <aside
      class={`
        h-screen flex flex-col transition-all duration-300 ease-in-out z-20
        border-r border-white/5 
        ${/* Mudança de cor de fundo para criar contraste com o dashboard */ ""}
        bg-[#09090b] 
        ${isSidebarExpanded() ? "w-64" : "w-[70px]"}
      `}
    >
      <SidebarHeader isExpanded={isSidebarExpanded()} />

      {/* Área de Navegação com padding mais refinado */}
      <nav class="flex-1 px-3 py-4 space-y-1">
        {/* Label de Seção (Só aparece expandido) */}
        <div
          class={`px-3 mb-2 text-[10px] font-bold text-neutral-600 uppercase tracking-wider transition-opacity ${isSidebarExpanded() ? "opacity-100" : "opacity-0 h-0"}`}
        >
          Gerenciamento
        </div>

        <SidebarItem
          icon={Box}
          label="Containers"
          isActive={activeView() === "containers"}
          isExpanded={isSidebarExpanded()}
          onClick={() => setActiveView("containers")}
        />
        <SidebarItem
          icon={Layers}
          label="Imagens"
          isActive={activeView() === "images"}
          isExpanded={isSidebarExpanded()}
          onClick={() => setActiveView("images")}
        />
        <SidebarItem
          icon={Database}
          label="Volumes"
          isActive={activeView() === "volumes"}
          isExpanded={isSidebarExpanded()}
          onClick={() => setActiveView("volumes")}
        />
      </nav>

      <div class="p-3 border-t border-white/5 space-y-1">
        <SidebarItem
          icon={Settings}
          label="Configurações"
          isActive={activeView() === "settings"}
          isExpanded={isSidebarExpanded()}
          onClick={() => setActiveView("settings")}
        />

        <SidebarToggle isExpanded={isSidebarExpanded()} onToggle={toggleSidebar} />
      </div>
    </aside>
  );
};
