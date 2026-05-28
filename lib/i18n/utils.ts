import defaults from "./defaults.json";
import zhTranslations from "./translations/zh.json";
import enTranslations from "./translations/en.json";
import esTranslations from "./translations/es.json";
import jaTranslations from "./translations/ja.json";
import deTranslations from "./translations/de.json";
import frTranslations from "./translations/fr.json";

export type Language = "zh" | "en" | "es" | "ja" | "de" | "fr";

interface Translations {
  [key: string]: any;
}

const rawTranslations: Record<Language, Translations> = {
  zh: zhTranslations,
  en: enTranslations,
  es: esTranslations,
  ja: jaTranslations,
  de: deTranslations,
  fr: frTranslations,
};

function deepMerge(target: any, source: any): any {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export const translations: Record<Language, Translations> = {} as Record<
  Language,
  Translations
>;

const langKeys = Object.keys(rawTranslations) as Language[];
for (const lang of langKeys) {
  translations[lang] = deepMerge(defaults, rawTranslations[lang]);
}

export function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === "object") {
      value = value[key];
    } else {
      return path;
    }
  }
  return typeof value === "string" ? value : path;
}

export function formatString(
  template: string,
  params?: Record<string, string | number>,
): string {
  if (!params || Object.keys(params).length === 0) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key]?.toString() || `{${key}}`;
  });
}
