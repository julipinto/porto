import type { Component } from "solid-js";
import { Settings } from "lucide-solid";

// UI Imports

// Tab Components Imports
import { GeneralTab } from "./components/general-tab";
import { AdvancedTab } from "./components/advanced-tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs/tabs";
import { useI18n } from "../../i18n";

export const SettingsPage: Component = () => {
  const { t } = useI18n();
  return (
    <div class="max-w-3xl mx-auto pb-20 animate-in fade-in duration-300">
      {/* Header da Página */}
      <div class="mb-8 border-b border-neutral-800 pb-6">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <div class="p-2 bg-neutral-800 rounded-lg">
            <Settings class="w-6 h-6 text-neutral-400" />
          </div>
          {t("settings.title")}
        </h2>
        <p class="text-neutral-500 mt-2 ml-1">{t("settings.description")}</p>
      </div>

      {/* Sistema de Abas */}
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">{t("settings.tabs.general")}</TabsTrigger>
          <TabsTrigger value="advanced">{t("settings.tabs.advanced")}</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <GeneralTab />
        </TabsContent>

        <TabsContent value="advanced">
          <AdvancedTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
