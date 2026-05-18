"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface LatestContentProps {
  item: {
    type: "post" | "moment";
    title: string;
    href: string;
    date: string;
  };
}

export default function LatestContent({ item }: LatestContentProps) {
  const { t } = useLanguage();
  const label = item.type === "post" ? t("home.latestArticle") : t("home.latestMoment");
  const dateStr = item.date
    ? new Date(item.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <Link
      href={item.href}
      className="block card p-4 hover:shadow-lg transition-all duration-300 group text-center"
    >
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <span
          className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "var(--primary)",
            color: "#fff",
            opacity: 0.85,
          }}
        >
          {label}
        </span>
        {dateStr && (
          <span className="text-xs" style={{ color: "var(--text)", opacity: 0.5 }}>
            {dateStr}
          </span>
        )}
      </div>
      <p
        className="text-base font-medium group-hover:text-primary transition-colors line-clamp-1"
        style={{ color: "var(--text)" }}
      >
        {item.title}
      </p>
    </Link>
  );
}
