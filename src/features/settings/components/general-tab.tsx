import type { Component } from "solid-js";
import { Monitor, Globe } from "lucide-solid";
import { useSettingsStore, LANGUAGES, type Language } from "../../../stores/settings-store";

// UI Components
import { Switch } from "../../../ui/switch";
import { Select } from "../../../ui/select";

export const GeneralTab: Component = () => {
  const { showSystemMonitor, setShowSystemMonitor, language, setLanguage } = useSettingsStore();

  // Prepara as opções do Select
  const languageOptions = Object.entries(LANGUAGES).map(([value, label]) => ({
    value,
    label,
  }));

  return (
    <div class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Seção: Idioma */}
      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Globe class="w-4 h-4 text-blue-500" />
          Idioma e Região
        </h3>

        <div class="divide-y divide-neutral-800/50">
          <Select
            label="Idioma da Interface"
            value={language()}
            onChange={(v) => setLanguage(v as Language)}
            options={languageOptions}
          />
        </div>
      </section>

      {/* Seção: Interface */}
      <section class="bg-[#161b22] border border-neutral-800 rounded-xl p-6 shadow-sm">
        <h3 class="text-lg font-medium text-white mb-4 flex items-center gap-2">
          <Monitor class="w-4 h-4 text-purple-500" />
          Interface & Aparência
        </h3>

        <div class="divide-y divide-neutral-800/50">
          <Switch
            label="Monitoramento de Sistema"
            description="Exibir barra de CPU e RAM no rodapé da aplicação."
            checked={showSystemMonitor()}
            onChange={setShowSystemMonitor}
          />
        </div>
      </section>
    </div>
  );
};
