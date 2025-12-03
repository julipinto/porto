import { Box, Layers, Database, Settings, Network } from "lucide-solid";
import type { Component } from "solid-js";
import { useUIStore } from "../../stores/ui-store";
import { useI18n } from "../../i18n";

import { SidebarHeader } from "./sidebar-header";
import { SidebarItem } from "./sidebar-item";
import { SidebarToggle } from "./sidebar-toggle";

export const Sidebar: Component = () => {
  const { isSidebarExpanded, toggleSidebar, activeView, setActiveView } = useUIStore();
  const { t } = useI18n();

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

      <nav class="flex-1 px-3 py-4 space-y-1">
        <div
          class={`px-3 mb-2 text-[10px] font-bold text-neutral-600 uppercase tracking-wider transition-opacity ${isSidebarExpanded() ? "opacity-100" : "opacity-0 h-0"}`}
        >
          {t("global.sidebar.management")}
        </div>

        <SidebarItem
          icon={Box}
          label={t("global.sidebar.containers")}
          isActive={activeView() === "containers"}
          isExpanded={isSidebarExpanded()}
          onClick={() => setActiveView("containers")}
        />
        <SidebarItem
          icon={Layers}
          label={t("global.sidebar.images")}
          isActive={activeView() === "images"}
          isExpanded={isSidebarExpanded()}
          onClick={() => setActiveView("images")}
        />
        <SidebarItem
          icon={Database}
          label={t("global.sidebar.volumes")}
          isActive={activeView() === "volumes"}
          isExpanded={isSidebarExpanded()}
          onClick={() => setActiveView("volumes")}
        />
        <SidebarItem
          icon={Network}
          label={t("global.sidebar.networks")}
          isActive={activeView() === "networks"}
          isExpanded={isSidebarExpanded()}
          onClick={() => setActiveView("networks")}
        />
      </nav>

      <div class="p-3 border-t border-white/5 space-y-1">
        <SidebarItem
          icon={Settings}
          label={t("global.sidebar.settings")}
          isActive={activeView() === "settings"}
          isExpanded={isSidebarExpanded()}
          onClick={() => setActiveView("settings")}
        />

        <SidebarToggle isExpanded={isSidebarExpanded()} onToggle={toggleSidebar} />
      </div>
    </aside>
  );
};
