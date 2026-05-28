"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getNestedValue, formatString, translations, Language } from "./utils";

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
  const availableLanguages: Language[] = ["zh", "en", "es", "ja", "de", "fr"];

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && availableLanguages.includes(savedLang)) {
      setLanguageState(savedLang);
    } else {
      const browserLang = navigator.language.split("-")[0];
      if (availableLanguages.includes(browserLang as Language)) {
        setLanguageState(browserLang as Language);
      } else {
        setLanguageState(defaultLang);
      }
    }
  }, [defaultLang]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const value = getNestedValue(translations[language], key);
    return formatString(value, params);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        availableLanguages,
      }}
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
