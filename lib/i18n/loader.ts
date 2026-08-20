import defaults from "./defaults.json";
import zhTranslations from "./translations/zh.json";

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

// 中文为同步基线（首屏 bundle），其余语言按需分包加载
export const defaultTranslations: any = deepMerge(defaults, zhTranslations);

const dynamicLoaders: Record<string, () => Promise<{ default: any }>> = {
  en: () => import("./translations/en.json"),
  es: () => import("./translations/es.json"),
  ja: () => import("./translations/ja.json"),
  de: () => import("./translations/de.json"),
  fr: () => import("./translations/fr.json"),
};

const cache = new Map<string, any>();

export async function loadTranslations(lang: string): Promise<any> {
  if (lang === "zh") return defaultTranslations;
  const cached = cache.get(lang);
  if (cached) return cached;
  const mod = await dynamicLoaders[lang]();
  const merged = deepMerge(defaults, mod.default);
  cache.set(lang, merged);
  return merged;
}
