import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import "./App.css";
import { useUIStore } from "./stores/ui-store";
import { ServiceGuard } from "./features/system/components/service-guard";
import { Sidebar } from "./ui/sidebar";
import { Match, type ParentComponent, Switch } from "solid-js";
import { ContainerList } from "./features/containers/components/list/container-list";
import { ImageList } from "./features/images/components/image-list";
import { VolumeList } from "./features/volumes/components/volume-list";
import { ContainerDetails } from "./features/containers/components/details";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const { activeView, selectedContainerId } = useUIStore();

  return (
    <QueryClientProvider client={queryClient}>
      <ServiceGuard>
        <div class="flex h-screen w-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-blue-500/30 overflow-hidden">
          <Sidebar />

          {/* 2. Área de Conteúdo */}
          <main class="flex-1 flex flex-col min-w-0 bg-black/20">
            <div class="flex-1 overflow-hidden relative">
              <Switch>
                <Match when={selectedContainerId()}>
                  {/* Padding movido para cá para o scrollbar ficar na borda da tela se quiser */}
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
                  <PageWrapper>
                    <ImageList />
                  </PageWrapper>
                </Match>

                <Match when={activeView() === "volumes"}>
                  <PageWrapper>
                    <VolumeList />
                  </PageWrapper>
                </Match>

                <Match when={activeView() === "settings"}>
                  <PageWrapper>
                    <div class="p-12 text-center border border-dashed border-neutral-800 rounded-xl">
                      <h2 class="text-xl font-bold text-neutral-500">Configurações</h2>
                      <p class="text-neutral-600 mt-2">Em breve...</p>
                    </div>
                  </PageWrapper>
                </Match>
              </Switch>
            </div>
          </main>
        </div>
      </ServiceGuard>
    </QueryClientProvider>
  );
}

const PageWrapper: ParentComponent = (props) => (
  <div class="h-full w-full overflow-y-auto custom-scrollbar p-8">
    <div class="max-w-7xl mx-auto">{props.children}</div>
  </div>
);

export default App;
