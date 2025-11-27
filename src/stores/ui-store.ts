import { createSignal } from "solid-js";
import { createPersistentSignal } from "../utils/persistent";

export type ViewType = "containers" | "images" | "volumes" | "settings";

const [isSidebarExpanded, setIsSidebarExpanded] = createPersistentSignal<boolean>(
  "sidebar-expanded",
  true,
);

const [activeView, setViewSignal] = createPersistentSignal<ViewType>(
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
      console.log(view);
      setViewSignal(view);
      setSelectedContainerId(null);
    },

    selectedContainerId,
    setSelectedContainerId,
  };
};
