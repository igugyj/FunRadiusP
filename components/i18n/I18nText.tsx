"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n";

interface I18nTextProps {
  translationKey: string;
  params?: Record<string, string | number>;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children?: React.ReactNode;
}

export default function I18nText({
  translationKey,
  params = {},
  as: Component = "span",
  className = "",
  children,
  ...rest
}: I18nTextProps) {
  const { t } = useLanguage();
  const Tag = Component as React.ElementType;
  return (
    <Tag className={className} {...(rest as React.Attributes)}>
      {t(translationKey, params)}
      {children}
    </Tag>
  );
}
