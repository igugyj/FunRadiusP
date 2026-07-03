"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { deterministicColor, VIBRANT_COLORS } from "@/lib/colors";

interface CategoryWithCount {
  category: string;
  count: number;
}

interface CategoriesClientProps {
  categoriesWithCount: CategoryWithCount[];
}

function hashRot(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++)
    h = name.charCodeAt(i) + ((h << 5) - h);
  return `${((h % 7) + 7) % 7 - 3}deg`;
}

export default function CategoriesClient({
  categoriesWithCount,
}: CategoriesClientProps) {
  const { t } = useLanguage();
  const sorted = [...categoriesWithCount].sort((a, b) => b.count - a.count);

  if (sorted.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-primary">
          {t("categoriesPage.title")}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {t("categories.noCategories")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        {t("categoriesPage.title")}
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {sorted.map(({ category, count }, i) => (
          <div
            key={category}
            className="stamp-enter"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <StampCard category={category} count={count} />
          </div>
        ))}
      </div>
    </div>
  );
}

function StampCard({
  category,
  count,
}: {
  category: string;
  count: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const det = deterministicColor(category);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const pick = VIBRANT_COLORS[Math.floor(Math.random() * VIBRANT_COLORS.length)];
    el.style.setProperty("--hue", String(pick.hue));
    el.style.setProperty("--sat", pick.sat);
  }, []);

  return (
    <Link
      ref={ref}
      href={`/categories/${category}`}
      className="stamp-card"
      style={
        {
          "--hue": det.hue,
          "--sat": det.sat,
          "--rot": hashRot(category),
        } as React.CSSProperties
      }
    >
      <span className="text-sm font-semibold leading-tight">{category}</span>
      <span className="text-xs font-medium opacity-75">{count}</span>
    </Link>
  );
}
