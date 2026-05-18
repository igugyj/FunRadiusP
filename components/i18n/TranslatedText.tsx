"use client";

import { useLanguage } from "@/lib/i18n";

interface TranslatedTextProps {
  translationKey: string;
  params?: Record<string, string | number>;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  className?: string;
}

export default function TranslatedText({
  translationKey,
  params = {},
  as: Component = "span",
  className = "",
}: TranslatedTextProps) {
  const { t } = useLanguage();
  return <Component className={className}>{t(translationKey, params)}</Component>;
}
