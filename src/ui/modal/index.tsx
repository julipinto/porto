import { type Component, type JSX, Show } from "solid-js";
import { Portal } from "solid-js/web";
import { X } from "lucide-solid";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: JSX.Element;
  footer?: JSX.Element;
  maxWidth?: string;
}

export const Modal: Component<ModalProps> = (props) => {
  return (
    <Show when={props.isOpen}>
      <Portal>
        {/* Container de Posicionamento (Flex para centralizar) */}
        <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* CAMADA 1: Backdrop (Botão real para acessibilidade) */}
          <button
            type="button"
            class="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-default w-full h-full border-none"
            onClick={props.onClose}
            aria-label="Fechar modal"
          />

          {/* CAMADA 2: O Card do Modal (Fica por cima devido à ordem) */}
          <div
            role="dialog"
            aria-modal="true"
            class={`relative bg-[#0d1117] border border-neutral-800 rounded-xl shadow-2xl w-full ${props.maxWidth || "max-w-md"} flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200`}
          >
            {/* Header */}
            <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
              <h3 class="text-lg font-semibold text-white">{props.title}</h3>
              <button
                type="button"
                onClick={props.onClose}
                class="text-neutral-500 hover:text-white transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div class="p-6 overflow-y-auto custom-scrollbar">{props.children}</div>

            {/* Footer */}
            <Show when={props.footer}>
              <div class="px-6 py-4 bg-neutral-900/50 border-t border-neutral-800 flex justify-end gap-3">
                {props.footer}
              </div>
            </Show>
          </div>
        </div>
      </Portal>
    </Show>
  );
};
