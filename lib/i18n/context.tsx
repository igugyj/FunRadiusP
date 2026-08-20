"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { getNestedValue, formatString } from "./format";
import { defaultTranslations, loadTranslations } from "./loader";
import type { Language } from "./utils";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const defaultLang = (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ||
    "en") as Language; // 默认英语
  const [language, setLanguageState] = useState<Language>(defaultLang);
  const [translation, setTranslation] = useState<any>(defaultTranslations);
  const availableLanguages: Language[] = ["zh", "en", "es", "ja", "de", "fr"];

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    let target: Language;
    if (savedLang && availableLanguages.includes(savedLang)) {
      target = savedLang;
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (availableLanguages.includes(browserLang as Language)) {
        target = browserLang as Language;
      } else {
        target = defaultLang;
      }
    }
    setLanguageState(target);
    loadTranslations(target).then(setTranslation);
  }, [defaultLang]); // eslint-disable-line react-hooks/exhaustive-deps

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
    loadTranslations(lang).then(setTranslation);
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      return formatString(getNestedValue(translation, key), params);
    },
    [translation],
  );

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t, availableLanguages }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
