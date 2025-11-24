import { Switch, Match } from "solid-js";
import { ContainerList } from "../features/containers/components/container-list";
import { ServiceGuard } from "../features/system/components/service-guard";
import { Sidebar } from "../ui/sidebar";
import { useUIStore } from "../stores/ui-store";
import { ImageList } from "./images/components/image-list";
import { VolumeList } from "./volumes/components/volume-list";

export default function Main() {
  const { activeView } = useUIStore();

  return (
    <ServiceGuard>
      <div class="flex h-screen w-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-blue-500/30 overflow-hidden">
        <Sidebar />

        {/* 2. Área de Conteúdo */}
        <main class="flex-1 flex flex-col min-w-0 bg-black/20">
          <div class="flex-1 overflow-auto p-8 custom-scrollbar">
            <div class="max-w-7xl mx-auto">
              <Switch>
                <Match when={activeView() === "containers"}>
                  <ContainerList />
                </Match>

                <Match when={activeView() === "images"}>
                  <ImageList />
                </Match>

                <Match when={activeView() === "volumes"}>
                  <VolumeList />
                </Match>

                <Match when={activeView() === "settings"}>
                  <div class="p-12 text-center border border-dashed border-neutral-800 rounded-xl">
                    <h2 class="text-xl font-bold text-neutral-500">Configurações</h2>
                    <p class="text-neutral-600 mt-2">Em breve...</p>
                  </div>
                </Match>
              </Switch>
            </div>
          </div>
        </main>
      </div>
    </ServiceGuard>
  );
}
