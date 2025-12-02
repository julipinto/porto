import { createSignal, createContext, useContext, type ParentComponent, Show } from "solid-js";

// Contexto
const TabsContext = createContext<{
  activeTab: () => string;
  setActiveTab: (v: string) => void;
}>();

// 1. Container Principal
export const Tabs: ParentComponent<{ defaultValue: string; class?: string }> = (props) => {
  const [activeTab, setActiveTab] = createSignal(props.defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div class={`w-full ${props.class || ""}`}>{props.children}</div>
    </TabsContext.Provider>
  );
};

// 2. Lista de Gatilhos
export const TabsList: ParentComponent<{ class?: string }> = (props) => {
  return (
    <div class={`flex items-center border-b border-neutral-800 mb-6 ${props.class || ""}`}>
      {props.children}
    </div>
  );
};

// 3. O Gatilho (CORREÇÃO AQUI)
export const TabsTrigger: ParentComponent<{ value: string; class?: string }> = (props) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within Tabs");

  const isActive = () => ctx.activeTab() === props.value;

  return (
    <button
      type="button"
      onClick={() => ctx.setActiveTab(props.value)}
      // Adicionamos ${props.class || ""} no final da string de classes
      class={`
        px-4 py-2 text-sm font-medium border-b-2 transition-colors relative -bottom-[1px]
        ${
          isActive()
            ? "border-blue-500 text-blue-400"
            : "border-transparent text-neutral-500 hover:text-neutral-300 hover:border-neutral-700"
        }
        ${props.class || ""}
      `}
    >
      {props.children}
    </button>
  );
};

// 4. O Conteúdo
export const TabsContent: ParentComponent<{ value: string; class?: string }> = (props) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsContent must be used within Tabs");

  return (
    <Show when={ctx.activeTab() === props.value}>
      <div class={`animate-in fade-in slide-in-from-bottom-2 duration-200 ${props.class || ""}`}>
        {props.children}
      </div>
    </Show>
  );
};
