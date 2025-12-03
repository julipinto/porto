import { createSignal } from "solid-js";
import { createPersistentSignal } from "../utils/persistent";

export type ViewType =
  | "containers"
  | "images"
  | "volumes"
  | "settings"
  | "create-container"
  | "networks";

// --- ESTADO PERSISTENTE ---
const [isSidebarExpanded, setIsSidebarExpanded] = createPersistentSignal<boolean>(
  "sidebar-expanded",
  true,
);
const [activeView, setViewSignal] = createPersistentSignal<ViewType>(
  "last-active-view",
  "containers",
);

// --- ESTADO DE NAVEGAÇÃO (Ephemeral) ---
const [selectedContainerId, setSelectedContainerId] = createSignal<string | null>(null);
const [selectedVolumeName, setSelectedVolumeName] = createSignal<string | null>(null);
const [selectedImageId, setSelectedImageId] = createSignal<string | null>(null);
const [runImagePreset, setRunImagePreset] = createSignal<string | null>(null);
const [selectedNetworkId, setSelectedNetworkId] = createSignal<string | null>(null);

export const useUIStore = () => {
  const persistView = (view: ViewType) => {
    setViewSignal(view);
  };

  return {
    isSidebarExpanded,
    toggleSidebar: () => setIsSidebarExpanded((prev) => !prev),

    activeView,

    selectedContainerId,
    setSelectedContainerId,

    selectedVolumeName,
    setSelectedVolumeName,

    selectedImageId,
    setSelectedImageId,

    runImagePreset,
    setRunImagePreset,

    selectedNetworkId,
    setSelectedNetworkId,

    setActiveView: (view: ViewType) => {
      persistView(view);
      setSelectedContainerId(null);
      setSelectedVolumeName(null);
      setSelectedImageId(null);
      setSelectedNetworkId(null);
      setRunImagePreset(null);
    },

    navigateToRun: (image?: string) => {
      if (image) setRunImagePreset(image);
      setViewSignal("create-container");
      setSelectedContainerId(null);
      setSelectedVolumeName(null);
      setSelectedImageId(null);
      setSelectedNetworkId(null);
    },
  };
};
