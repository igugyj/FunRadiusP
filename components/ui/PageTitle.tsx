"use client";

import { useLanguage } from "@/lib/i18n";

interface PageTitleProps {
  translationKey: string;
  params?: Record<string, string | number>;
  className?: string;
}

export default function PageTitle({
  translationKey,
  params = {},
  className = "",
}: PageTitleProps) {
  const { t } = useLanguage();
  return (
    <h1
      className={`text-3xl font-bold mb-8 text-primary ${className}`}
      style={{ color: "var(--primary)" }}
    >
      {t(translationKey, params)}
    </h1>
  );
}
