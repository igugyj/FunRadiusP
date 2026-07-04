"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { deterministicColor, VIBRANT_COLORS } from "@/lib/colors";

interface TagWithCount {
  tag: string;
  count: number;
}

interface TagsClientProps {
  tagsWithCount: TagWithCount[];
}

function getSizeClass(count: number): { text: string; padding: string } {
  if (count >= 8) return { text: "text-base", padding: "px-5 py-2" };
  if (count >= 4) return { text: "text-sm", padding: "px-4 py-1.5" };
  return { text: "text-xs", padding: "px-3 py-1" };
}

function handleRipple(e: React.MouseEvent<HTMLAnchorElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  e.currentTarget.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

export default function TagsClient({ tagsWithCount }: TagsClientProps) {
  const { t } = useLanguage();
  const sorted = [...tagsWithCount].sort((a, b) => b.count - a.count);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        {t("tagsPage.tagCloud")}
      </h1>
      <div className="card p-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {sorted.map(({ tag, count }, i) => (
            <TagPill key={tag} tag={tag} count={count} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TagPill({ tag, count, index }: { tag: string; count: number; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const det = deterministicColor(tag);
  const size = getSizeClass(count);

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
      href={`/tags/${tag}`}
      onClick={handleRipple}
      className={`tag-pill entrance ${size.text} ${size.padding}`}
      style={
        {
          "--hue": det.hue,
          "--sat": det.sat,
          animationDelay: `${index * 10}ms`,
        } as React.CSSProperties
      }
    >
      {tag}
      <span className="opacity-60 text-[0.7em]">({count})</span>
    </Link>
  );
}
