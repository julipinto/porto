import { createSignal } from "solid-js";
import { createPersistentSignal } from "../utils/persistent";

export type ViewType = "containers" | "images" | "volumes" | "settings";

const [isSidebarExpanded, setIsSidebarExpanded] = createPersistentSignal<boolean>(
  "sidebar-expanded",
  true,
);

const [activeView, setActiveView] = createPersistentSignal<ViewType>(
  "last-active-view",
  "containers",
);

const [selectedContainerId, setSelectedContainerId] = createSignal<string | null>(null);

export const useUIStore = () => {
  return {
    isSidebarExpanded,
    toggleSidebar: () => setIsSidebarExpanded((prev) => !prev),

    activeView,
    setActiveView: (view: ViewType) => {
      setActiveView(view);
      setSelectedContainerId(null);
    },

    selectedContainerId,
    setSelectedContainerId,
  };
};
