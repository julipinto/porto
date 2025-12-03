import { type Component, createSignal, Show } from "solid-js";
import {
  Trash2,
  AlertTriangle,
  Loader2,
  CheckCircle,
  Box,
  Layers,
  Network,
  type LucideProps,
} from "lucide-solid";
import { Modal } from "../../../ui/modal";
import { Button } from "../../../ui/button";
import { useSystemActions, type PruneReport } from "../../system/hooks/use-system-actions";
import { formatBytes } from "../../../utils/format";
import { useI18n } from "../../../i18n";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PruneModal: Component<Props> = (props) => {
  const { pruneSystem, isPruning } = useSystemActions();
  const { t } = useI18n();
  const [report, setReport] = createSignal<PruneReport | null>(null);

  const handlePrune = async () => {
    const result = await pruneSystem();
    setReport(result);
  };

  const handleClose = () => {
    setReport(null);
    props.onClose();
  };

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={handleClose}
      title={t("settings.pruneModal.title")}
      maxWidth="max-w-lg"
      footer={
        <div class="flex justify-end gap-2">
          {/* Estado 1: Confirmação */}
          <Show when={!report()}>
            <Button variant="ghost" onClick={handleClose} disabled={isPruning()}>
              {t("settings.pruneModal.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handlePrune}
              disabled={isPruning()}
              class="gap-2"
            >
              <Show when={isPruning()} fallback={<Trash2 class="w-4 h-4" />}>
                <Loader2 class="w-4 h-4 animate-spin" />
              </Show>
              {isPruning()
                ? t("settings.pruneModal.cleaning")
                : t("settings.pruneModal.confirmClean")}
            </Button>
          </Show>

          {/* Estado 2: Resultado */}
          <Show when={report()}>
            <Button onClick={handleClose}>{t("settings.pruneModal.close")}</Button>
          </Show>
        </div>
      }
    >
      <div class="space-y-6">
        {/* Estado Inicial: Aviso */}
        <Show when={!report()}>
          <div class="flex items-start gap-4 bg-amber-500/10 p-4 rounded-lg border border-amber-500/20">
            <AlertTriangle class="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
            <div class="text-sm text-amber-200/80">
              <p class="font-bold text-amber-500 mb-1">{t("settings.pruneModal.warning.title")}</p>
              <p>{t("settings.pruneModal.warning.description")}</p>
              <ul class="list-disc list-inside mt-2 space-y-1 text-neutral-400 marker:text-amber-500">
                <li>{t("settings.pruneModal.warning.items.stoppedContainers")}</li>
                <li>{t("settings.pruneModal.warning.items.unusedNetworks")}</li>
                <li>{t("settings.pruneModal.warning.items.danglingImages")}</li>
              </ul>
            </div>
          </div>
        </Show>

        {/* Estado Final: Relatório */}
        <Show when={report()}>
          <div class="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div class="flex flex-col items-center justify-center py-4 text-emerald-500">
              <CheckCircle class="w-12 h-12 mb-2" />
              <h3 class="text-lg font-bold">{t("settings.pruneModal.success.title")}</h3>
              <p class="text-neutral-400 text-sm">
                {t("settings.pruneModal.success.spaceRecovered")}{" "}
                <span class="text-white font-mono font-bold">
                  {formatBytes(report()?.reclaimed_space || 0)}
                </span>
              </p>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <StatCard
                icon={Box}
                label={t("settings.pruneModal.success.containers")}
                value={report()?.deleted_containers}
              />
              <StatCard
                icon={Layers}
                label={t("settings.pruneModal.success.images")}
                value={report()?.deleted_images}
              />
              <StatCard
                icon={Network}
                label={t("settings.pruneModal.success.networks")}
                value={report()?.deleted_networks}
              />
            </div>
          </div>
        </Show>
      </div>
    </Modal>
  );
};

const StatCard = (props: { icon: Component<LucideProps>; label: string; value?: number }) => (
  <div class="bg-black/20 border border-neutral-800 p-3 rounded-lg text-center">
    <div class="flex justify-center mb-2 text-neutral-500">
      <props.icon class="w-5 h-5" />
    </div>
    <div class="text-xl font-bold text-white">{props.value || 0}</div>
    <div class="text-[10px] uppercase tracking-wider text-neutral-600">{props.label}</div>
  </div>
);
