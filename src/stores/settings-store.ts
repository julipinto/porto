import { createPersistentSignal } from "../utils/persistent";

const [showSystemMonitor, setShowSystemMonitor] = createPersistentSignal<boolean>(
  "settings.showSystemMonitor",
  true,
);

export type Language = "en" | "pt" | "es" | "fr";

export const LANGUAGES: Record<Language, string> = {
  pt: "Português (Brasil)",
  en: "English",
  es: "Español",
  fr: "Français",
};

// Configuração de Idioma (Padrão: pt)
const [language, setLanguage] = createPersistentSignal<Language>("settings.language", "pt");

export const useSettingsStore = () => {
  return {
    showSystemMonitor,
    setShowSystemMonitor,
    language,
    setLanguage,
  };
};
