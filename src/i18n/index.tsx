import { translator } from "@solid-primitives/i18n";
import type { ParentComponent } from "solid-js";
import { createEffect, createMemo, createSignal, useContext, createContext } from "solid-js";
import { useSettingsStore } from "../stores/settings-store";

// Import translations
import globalPtBr from "./locales/global/pt-BR";
import globalEn from "./locales/global/en";
import globalEs from "./locales/global/es";
import globalFr from "./locales/global/fr";

import containersPtBr from "./locales/containers/pt-BR";
import containersEn from "./locales/containers/en";
import containersEs from "./locales/containers/es";
import containersFr from "./locales/containers/fr";

import imagesPtBr from "./locales/images/pt-BR";
import imagesEn from "./locales/images/en";
import imagesEs from "./locales/images/es";
import imagesFr from "./locales/images/fr";

import volumesPtBr from "./locales/volumes/pt-BR";
import volumesEn from "./locales/volumes/en";
import volumesEs from "./locales/volumes/es";
import volumesFr from "./locales/volumes/fr";

import networksPtBr from "./locales/networks/pt-BR";
import networksEn from "./locales/networks/en";
import networksEs from "./locales/networks/es";
import networksFr from "./locales/networks/fr";

import settingsPtBr from "./locales/settings/pt-BR";
import settingsEn from "./locales/settings/en";
import settingsEs from "./locales/settings/es";
import settingsFr from "./locales/settings/fr";

import systemPtBr from "./locales/system/pt-BR";
import systemEn from "./locales/system/en";
import systemEs from "./locales/system/es";
import systemFr from "./locales/system/fr";

export type Locale = "pt-BR" | "en" | "es" | "fr";

// Helper function to flatten and prefix
function flattenWithPrefix(obj: any, prefix: string): Record<string, string> {
  const flattened: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const newKey = `${prefix}.${key}`;
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      Object.assign(flattened, flattenWithPrefix(value, newKey));
    } else if (typeof value === "string") {
      flattened[newKey] = value;
    }
  }
  return flattened;
}

const dictionaries = {
  "pt-BR": {
    ...flattenWithPrefix(globalPtBr, "global"),
    ...flattenWithPrefix(containersPtBr, "containers"),
    ...flattenWithPrefix(imagesPtBr, "images"),
    ...flattenWithPrefix(volumesPtBr, "volumes"),
    ...flattenWithPrefix(networksPtBr, "networks"),
    ...flattenWithPrefix(settingsPtBr, "settings"),
    ...flattenWithPrefix(systemPtBr, "system"),
  },
  en: {
    ...flattenWithPrefix(globalEn, "global"),
    ...flattenWithPrefix(containersEn, "containers"),
    ...flattenWithPrefix(imagesEn, "images"),
    ...flattenWithPrefix(volumesEn, "volumes"),
    ...flattenWithPrefix(networksEn, "networks"),
    ...flattenWithPrefix(settingsEn, "settings"),
    ...flattenWithPrefix(systemEn, "system"),
  },
  es: {
    ...flattenWithPrefix(globalEs, "global"),
    ...flattenWithPrefix(containersEs, "containers"),
    ...flattenWithPrefix(imagesEs, "images"),
    ...flattenWithPrefix(volumesEs, "volumes"),
    ...flattenWithPrefix(networksEs, "networks"),
    ...flattenWithPrefix(settingsEs, "settings"),
    ...flattenWithPrefix(systemEs, "system"),
  },
  fr: {
    ...flattenWithPrefix(globalFr, "global"),
    ...flattenWithPrefix(containersFr, "containers"),
    ...flattenWithPrefix(imagesFr, "images"),
    ...flattenWithPrefix(volumesFr, "volumes"),
    ...flattenWithPrefix(networksFr, "networks"),
    ...flattenWithPrefix(settingsFr, "settings"),
    ...flattenWithPrefix(systemFr, "system"),
  },
};

// Map language codes from settings to locale codes
const languageToLocale: Record<string, Locale> = {
  pt: "pt-BR",
  en: "en",
  es: "es",
  fr: "fr",
};

export type I18nContextType = {
  locale: () => Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextType | undefined>();

export const I18nProvider: ParentComponent = (props) => {
  const { language } = useSettingsStore();
  const [locale, setLocale] = createSignal<Locale>("pt-BR");

  // Sync locale with settings store
  createEffect(() => {
    const newLocale = languageToLocale[language()] || "pt-BR";
    setLocale(newLocale);
  });

  const dict = createMemo(() => dictionaries[locale()]);
  const t = translator(dict);

  const value: I18nContextType = {
    locale,
    setLocale,
    t: (key: string, params?: Record<string, string | number>) => {
      let translation = t(key);
      if (params && typeof translation === "string") {
        translation = translation.replace(/\{(\w+)\}/g, (_: string, paramKey: string) => {
          return String(params[paramKey] ?? `{${paramKey}}`);
        });
      }
      return typeof translation === "string" ? translation : key;
    },
  };

  return <I18nContext.Provider value={value}>{props.children}</I18nContext.Provider>;
};

// Hook to use i18n
export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return context;
}
