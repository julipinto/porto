import { Box } from "lucide-solid";
import { ContainerList } from "./containers/components/ContainerList";

function Main() {
  return (
    <main class="min-h-screen bg-neutral-950 text-neutral-200 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* App Header / Navbar */}
      <header class="h-16 border-b border-neutral-800 bg-neutral-950 flex items-center px-8 justify-between sticky top-0 z-10">
        <div class="flex items-center gap-3">
          <div class="p-1.5 bg-blue-600/20 rounded-lg border border-blue-500/30">
            <Box class="w-5 h-5 text-blue-400" />
          </div>
          <h1 class="font-bold tracking-tight text-lg">Docker Manager</h1>
        </div>
        
        {/* Área para configurações futuras (tema, user, etc) */}
        <div class="text-xs text-neutral-600">v0.1.0-beta</div>
      </header>

      {/* Main Content Area */}
      <div class="flex-1 p-8 overflow-auto">
        <div class="max-w-6xl mx-auto">
          <ContainerList />
        </div>
      </div>
    </main>
  );
}

export default Main;