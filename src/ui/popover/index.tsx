import {
  createSignal,
  createContext,
  useContext,
  Show,
  type ParentComponent,
  type Accessor,
  type Setter,
  onCleanup,
} from "solid-js";
import { Portal } from "solid-js/web";

interface PopoverContextValue {
  isOpen: Accessor<boolean>;
  setIsOpen: Setter<boolean>;
  triggerRef: Accessor<HTMLElement | undefined>;
  setTriggerRef: Setter<HTMLElement | undefined>;
}

const PopoverContext = createContext<PopoverContextValue>();

export const Popover: ParentComponent = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  const [triggerRef, setTriggerRef] = createSignal<HTMLElement>();

  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen, triggerRef, setTriggerRef }}>
      <div class="relative inline-block">{props.children}</div>
    </PopoverContext.Provider>
  );
};

// 3. O Gatilho (O botão que você clica)
export const PopoverTrigger: ParentComponent<{ class?: string }> = (props) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverTrigger must be used within a Popover");

  return (
    <button
      type="button"
      ref={ctx.setTriggerRef}
      onClick={(e) => {
        e.stopPropagation();
        ctx.setIsOpen(!ctx.isOpen());
      }}
      class={`cursor-pointer bg-transparent border-none p-0 text-left ${props.class || ""}`}
    >
      {props.children}
    </button>
  );
};

// 4. O Conteúdo Flutuante (A mágica do Portal)
export const PopoverContent: ParentComponent<{ class?: string }> = (props) => {
  const ctx = useContext(PopoverContext);
  if (!ctx) throw new Error("PopoverContent must be used within a Popover");

  const [pos, setPos] = createSignal({ top: 0, left: 0 });

  // Calcula posição exata na tela
  const updatePosition = () => {
    const trigger = ctx.triggerRef();
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      setPos({
        top: rect.bottom + 6, // 6px de margem abaixo do botão
        left: rect.left,
      });
    }
  };

  // Fecha ao clicar fora (Backdrop)
  const close = (e: Event) => {
    e.stopPropagation();
    ctx.setIsOpen(false);
  };

  return (
    <Show when={ctx.isOpen()}>
      <Portal>
        {/* 1. Camada invisível na tela toda para detectar clique fora */}
        <button
          type="button"
          tabIndex={-1}
          class="fixed inset-0 z-[9998] cursor-default bg-transparent border-none w-full h-full block outline-none"
          onClick={close}
          onKeyDown={close}
        />
        {/* 2. O Conteúdo Posicionado */}
        <div
          ref={() => {
            updatePosition();
            window.addEventListener("resize", updatePosition);
            window.addEventListener("scroll", updatePosition, true);

            onCleanup(() => {
              window.removeEventListener("resize", updatePosition);
              window.removeEventListener("scroll", updatePosition, true);
            });
          }}
          class={`fixed z-[9999] outline-none ${props.class || ""}`}
          style={{
            top: `${pos().top}px`,
            left: `${pos().left}px`,
          }}
        >
          {props.children}
        </div>
      </Portal>
    </Show>
  );
};
