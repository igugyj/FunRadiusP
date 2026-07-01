"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

const THRESHOLDS = [0, 3, 7, 14, 30, 60, 90, 180, 365, 730, 1825, 3650, 10950, Infinity];

function getLevelIndex(days: number): number {
  const idx = THRESHOLDS.findIndex((t) => days <= t);
  return idx >= 0 ? idx : THRESHOLDS.length - 1;
}

const COLORS = {
  green: { dot: "#22c55e", border: "border-l-green-500", text: "text-green-700 dark:text-green-400" },
  yellow: { dot: "#eab308", border: "border-l-yellow-500", text: "text-yellow-700 dark:text-yellow-400" },
  red: { dot: "#ef4444", border: "border-l-red-500", text: "text-red-700 dark:text-red-400" },
} as const;

function getColorKey(days: number): keyof typeof COLORS {
  if (days < 30) return "green";
  if (days < 10950) return "yellow";
  return "red";
}

function formatDays(
  days: number,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  if (days < 1) return t("lastUpdateStatus.units.lessThanOne");
  if (days < 30) return t("lastUpdateStatus.units.day", { n: days });
  if (days < 365)
    return t("lastUpdateStatus.units.month", { n: Math.floor(days / 30) });
  return t("lastUpdateStatus.units.year", { n: Math.floor(days / 365) });
}

export default function LastUpdateStatus({ buildTime }: { buildTime: string }) {
  const { t } = useLanguage();
  const [days, setDays] = useState(-1);

  useEffect(() => {
    const tick = () => {
      const diff = Date.now() - new Date(buildTime).getTime();
      setDays(Math.max(0, Math.floor(diff / 86400000)));
    };
    tick();
    const id = setInterval(tick, 3600000);
    return () => clearInterval(id);
  }, [buildTime]);

  if (days < 0) return null;

  const levelIdx = getLevelIndex(days);
  const levelText = t(`lastUpdateStatus.levels.${levelIdx}`);
  const ck = getColorKey(days);
  const c = COLORS[ck];
  const daysStr = formatDays(days, t);

  return (
    <div
      className={`mt-8 border-l-4 ${c.border} rounded-r-xl px-4 py-3`}
      style={{ backgroundColor: "var(--background)" }}
    >
      <div className="flex items-start gap-3">
        <svg
          viewBox="0 0 24 24"
          className="w-5 h-5 shrink-0 mt-0.5 opacity-50"
          fill="none"
          stroke="currentColor"
          style={{ color: "var(--text)" }}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <div className="flex-1 min-w-0">
          <div style={{ color: "var(--text)" }}>
            {t("lastUpdateStatus.prefix", { days: daysStr })}
          </div>
          <div className="mt-0.5 text-xs opacity-60" style={{ color: "var(--text)" }}>
            {t("lastUpdateStatus.statusPrefix")}
            {levelText}
          </div>
        </div>
        <svg
          viewBox="0 0 8 8"
          className="w-2.5 h-2.5 shrink-0 mt-1.5"
          style={{ color: c.dot }}
        >
          <circle cx="4" cy="4" r="4" fill="currentColor" />
        </svg>
      </div>
    </div>
  );
}
