"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface TagWithCount {
  tag: string;
  count: number;
}

interface TagsClientProps {
  tagsWithCount: TagWithCount[];
}

const PILL_COLORS = [
  { hue: 330, sat: '72%' },
  { hue: 15,  sat: '76%' },
  { hue: 38,  sat: '82%' },
  { hue: 155, sat: '68%' },
  { hue: 205, sat: '72%' },
  { hue: 260, sat: '68%' },
  { hue: 345, sat: '74%' },
  { hue: 28,  sat: '78%' },
  { hue: 48,  sat: '78%' },
  { hue: 175, sat: '66%' },
  { hue: 295, sat: '62%' },
  { hue: 135, sat: '64%' },
  { hue: 235, sat: '68%' },
];

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
  const mountKey = useRef(Date.now()).current;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        {t("tagsPage.tagCloud")}
      </h1>
      <div className="card p-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {sorted.map(({ tag, count }, i) => (
            <TagPill key={`${mountKey}-${tag}`} tag={tag} count={count} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TagPill({ tag, count, index }: { tag: string; count: number; index: number }) {
  const [color] = useState(() => PILL_COLORS[Math.floor(Math.random() * PILL_COLORS.length)]);
  const { hue, sat } = color;
  const size = getSizeClass(count);
  return (
    <Link
      href={`/tags/${tag}`}
      onClick={handleRipple}
      className={`tag-pill ${size.text} ${size.padding}`}
      style={
        {
          "--hue": hue,
          "--sat": sat,
          animation: "fadeInUp 0.4s ease-out both",
          animationDelay: `${index * 10}ms`,
        } as React.CSSProperties
      }
    >
      {tag}
      <span className="opacity-60 text-[0.7em]">({count})</span>
    </Link>
  );
}
