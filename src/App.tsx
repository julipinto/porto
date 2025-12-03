import { Switch, Match, Show, type ParentComponent } from "solid-js";
import { useUIStore } from "./stores/ui-store";
import { useSettingsStore } from "./stores/settings-store";
import { Sidebar } from "./ui/sidebar";
import { SettingsPage } from "./features/settings";
import { ServiceGuard } from "./features/system/components/service-guard";
import { ContainerDetails } from "./features/containers/components/details";
import { ContainerList } from "./features/containers/components/list/container-list";
import { ImageList } from "./features/images/components/image-list";
import { VolumeList } from "./features/volumes/components/volume-list";
import { Footer } from "./ui/footer";
import { Toaster } from "solid-toast";

import "./App.css";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { useWindowPersistence } from "./hooks/use-window-persistence";
import { NetworkList } from "./features/networks/components/network-list";
import { VolumeDetailsPage } from "./features/volumes/components/details";
import { ImageDetailsPage } from "./features/images/components/details";
import { NetworkDetailsPage } from "./features/networks/components/details/details";

function App() {
  const {
    activeView,
    selectedContainerId,
    selectedVolumeName,
    selectedImageId,
    selectedNetworkId,
  } = useUIStore();
  const { showSystemMonitor } = useSettingsStore();

  useWindowPersistence();

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-right"
        containerStyle={{
          "z-index": 99999,
        }}
        toastOptions={{
          style: {
            background: "#161b22",
            color: "#fff",
            border: "1px solid #333",
          },
        }}
      />

      <div class="flex h-screen w-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-blue-500/30 overflow-hidden">
        {/* Sidebar está FORA do Guardião agora. Sempre acessível. */}
        <Sidebar />

        <main class="flex-1 flex flex-col min-w-0 bg-black/20 relative">
          <div class="flex-1 overflow-hidden relative">
            <Switch>
              {/* CASO 1: SETTINGS (Acessível mesmo Offline) */}
              <Match when={activeView() === "settings"}>
                <div class="h-full w-full overflow-y-auto custom-scrollbar p-8">
                  <SettingsPage />
                </div>
              </Match>

              {/* CASO 2: FEATURES PROTEGIDAS (Precisam de Docker) */}
              <Match when={["containers", "images", "volumes", "networks"].includes(activeView())}>
                {/* O Guardião agora protege apenas esta área */}
                <ServiceGuard>
                  <Switch>
                    <Match when={activeView() === "containers" && selectedContainerId()}>
                      <div class="h-full w-full p-6">
                        <ContainerDetails />
                      </div>
                    </Match>

                    <Match when={activeView() === "containers"}>
                      <PageWrapper>
                        <ContainerList />
                      </PageWrapper>
                    </Match>

                    <Match when={activeView() === "images"}>
                      <Show
                        when={selectedImageId()}
                        fallback={
                          <PageWrapper>
                            <ImageList />
                          </PageWrapper>
                        }
                      >
                        <div class="h-full w-full p-6">
                          <ImageDetailsPage />
                        </div>
                      </Show>
                    </Match>

                    <Match when={activeView() === "volumes"}>
                      <Show
                        when={selectedVolumeName()}
                        fallback={
                          <PageWrapper>
                            <VolumeList />
                          </PageWrapper>
                        }
                      >
                        <div class="h-full w-full p-6">
                          <VolumeDetailsPage />
                        </div>
                      </Show>
                    </Match>

                    <Match when={activeView() === "networks"}>
                      <Show
                        when={selectedNetworkId()}
                        fallback={
                          <PageWrapper>
                            <NetworkList />
                          </PageWrapper>
                        }
                      >
                        <div class="h-full w-full p-6">
                          <NetworkDetailsPage />
                        </div>
                      </Show>
                    </Match>
                  </Switch>
                </ServiceGuard>
              </Match>
            </Switch>
          </div>

          <Show when={showSystemMonitor()}>
            <Footer />
          </Show>
        </main>
      </div>
    </QueryClientProvider>
  );
}

const PageWrapper: ParentComponent = (props) => (
  <div class="h-full w-full overflow-y-auto custom-scrollbar p-8">
    <div class="max-w-7xl mx-auto">{props.children}</div>
  </div>
);

export default App;
