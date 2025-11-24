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
        h-screen bg-neutral-950 border-r border-neutral-800 flex flex-col 
        transition-all duration-300 ease-in-out z-20
        ${isSidebarExpanded() ? "w-64" : "w-20"}
      `}
    >
      {/* 1. Header */}
      <SidebarHeader isExpanded={isSidebarExpanded()} />

      {/* 2. Menu Principal */}
      <nav class="flex-1 px-3 space-y-1">
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

      {/* 3. Rodapé (Settings + Toggle) */}
      <div class="p-3 border-t border-neutral-800 space-y-1">
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
