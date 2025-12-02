import { type Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import { Play, ChevronDown, ChevronUp, Loader2 } from "lucide-solid";
import toast from "solid-toast";
import { useRunContainer } from "../../hooks/use-run-container";

// Imports Locais
import { createRunForm } from "./form-store";
import { BasicFields } from "./basic-fields";
import { PortsSection } from "./ports-section";
import { EnvSection } from "./env-section";
import { MountsSection } from "./mounts-section";
import { CommandPreview } from "./command-preview";
import { Button } from "../../../../ui/button";
import { Modal } from "../../../../ui/modal";
import { useNetworks } from "../../../networks/hooks/use-networks";
import { Select } from "../../../../ui/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialImage?: string;
}

export const RunContainerModal: Component<Props> = (props) => {
  const { runContainer } = useRunContainer();
  const [isRunning, setIsRunning] = createSignal(false);
  const [showAdvanced, setShowAdvanced] = createSignal(false);

  // Buscamos as redes (sem filtro de busca inicial)
  const networksQuery = useNetworks(() => "");

  // Usa a lógica extraída
  const { form, setForm, reset, addItem, removeItem } = createRunForm(props.initialImage);

  // Efeito para atualizar o formulário quando o modal abre com uma nova imagem
  createEffect(() => {
    if (props.isOpen && props.initialImage) {
      setForm("image", props.initialImage);
    }
  });

  const handleSubmit = async () => {
    if (!form.image) return;
    setIsRunning(true);
    try {
      await runContainer(form);
      toast.success(`Container iniciado com sucesso!`);
      props.onClose();
      reset();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setIsRunning(false);
    }
  };

  // Prepara as opções para o Select: { value: id, label: name }
  const networkOptions = createMemo(() => {
    const list = networksQuery.data || [];
    // Adiciona opção padrão (Bridge/Default) se quiser ser explícito, ou deixa vazio
    const options = list.map((n) => ({ value: n.Name, label: n.Name }));
    return [{ value: "", label: "Padrão (Bridge)" }, ...options];
  });

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Rodar Novo Container"
      maxWidth="max-w-2xl"
      footer={
        <div class="flex justify-between w-full items-center">
          <Button
            variant="ghost"
            size="sm"
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced())}
            class="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 h-auto py-1 px-2"
          >
            {showAdvanced() ? <ChevronUp class="w-3 h-3" /> : <ChevronDown class="w-3 h-3" />}
            {showAdvanced() ? "Menos opções" : "Opções avançadas"}
          </Button>
          <div class="flex gap-2">
            <Button variant="ghost" onClick={props.onClose} disabled={isRunning()}>
              Cancelar
            </Button>

            {/* Run vira Default */}
            <Button onClick={handleSubmit} disabled={isRunning() || !form.image} class="gap-2">
              <Show when={isRunning()} fallback={<Play class="w-4 h-4 fill-current" />}>
                <Loader2 class="w-4 h-4 animate-spin" />
              </Show>
              Run
            </Button>
          </div>
        </div>
      }
    >
      <div class="space-y-6">
        <BasicFields form={form} setForm={setForm} />

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PortsSection
            ports={form.ports}
            setForm={setForm}
            onAdd={() => addItem("ports", { host: "", container: "" })}
            onRemove={(i) => removeItem("ports", i)}
          />
          <EnvSection
            env={form.env}
            setForm={setForm}
            onAdd={() => addItem("env", { key: "", value: "" })}
            onRemove={(i) => removeItem("env", i)}
          />
        </div>

        <MountsSection
          mounts={form.mounts}
          setForm={setForm}
          onAdd={() => addItem("mounts", { hostPath: "", containerPath: "" })}
          onRemove={(i) => removeItem("mounts", i)}
        />

        <Show when={showAdvanced()}>
          <div class="pt-4 border-t border-dashed border-neutral-800 animate-in slide-in-from-top-2 fade-in space-y-4">
            {/* Seletor de Rede */}
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2 sm:col-span-1">
                <label
                  for="network-select"
                  class="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2"
                >
                  Rede
                </label>
                {/* Usamos nosso componente Select customizado */}
                <Select
                  id="network-select"
                  value={form.networkId || ""}
                  onChange={(val) => setForm("networkId", val)}
                  options={networkOptions()}
                />
                <p class="text-[10px] text-neutral-600 mt-1">
                  Selecione a rede para conectar o container.
                </p>
              </div>
            </div>
          </div>
        </Show>

        <CommandPreview form={form} />
      </div>
    </Modal>
  );
};
