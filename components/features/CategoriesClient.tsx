"use client";

import { useRef, useState, useMemo } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface CategoryWithCount {
  category: string;
  count: number;
}

interface CategoriesClientProps {
  categoriesWithCount: CategoryWithCount[];
}

const SPHERE_COLORS = [
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

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function arrangePositions(
  names: string[],
  width: number,
  height: number,
  itemW: number,
  itemH: number,
): { x: number; y: number }[] {
  const minDist = 150;
  const margin = 10;
  const positions: { x: number; y: number }[] = [];

  for (let i = 0; i < names.length; i++) {
    const seed = names[i]
      .split("")
      .reduce((a, c) => a + c.charCodeAt(0), i * 9973);
    const rand = seededRandom(seed);
    let placed = false;

    for (let attempt = 0; attempt < 500; attempt++) {
      const x = margin + rand() * (width - 2 * margin - itemW);
      const y = margin + rand() * (height - 2 * margin - itemH);
      const cx = x + itemW / 2;
      const cy = y + itemH / 2;
      const tooClose = positions.some(
        (p) => Math.hypot(p.x + itemW / 2 - cx, p.y + itemH / 2 - cy) < minDist,
      );
      if (!tooClose) {
        positions.push({ x, y });
        placed = true;
        break;
      }
    }

    if (!placed) {
      const angle = i * 2.399;
      const radius = 70 + i * 15;
      positions.push({
        x: width / 2 + Math.cos(angle) * radius - itemW / 2,
        y: height / 2 + Math.sin(angle) * radius - itemH / 2,
      });
    }
  }
  return positions;
}

export default function CategoriesClient({
  categoriesWithCount,
}: CategoriesClientProps) {
  const { t } = useLanguage();
  const sorted = [...categoriesWithCount].sort((a, b) => b.count - a.count);
  const mountKey = useRef(Date.now()).current;

  const names = useMemo(() => sorted.map((c) => c.category), [sorted]);

  const positions = useMemo(
    () => arrangePositions(names, 600, 420, 130, 150),
    [names],
  );

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
      <div
        className="relative mx-auto"
        style={{ maxWidth: 640, height: 440 }}
      >
          {sorted.map(({ category, count }, i) => (
          <div
            key={`${mountKey}-${category}`}
            className="absolute flex flex-col items-center gap-2"
            style={{
              left: positions[i].x,
              top: positions[i].y,
              width: 130,
              animation: `fadeInUp 0.4s ease-out ${i * 50}ms both`,
            }}
          >
            <OrbSphere category={category} count={count} />
          </div>
        ))}
      </div>
    </div>
  );
}

function OrbSphere({ category, count }: { category: string; count: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [hoverStyle, setHoverStyle] = useState<Record<string, string>>({});
  const [color] = useState(() => SPHERE_COLORS[Math.floor(Math.random() * SPHERE_COLORS.length)]);
  const { hue, sat } = color;

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;
    setHoverStyle({
      transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    });
  };

  const handleMouseLeave = () => {
    setHoverStyle({});
  };

  return (
    <Link
      ref={cardRef}
      href={`/categories/${category}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="orb-card"
      style={{
        "--orb-hue": hue,
        "--orb-sat": sat,
        animation: `float-orb 5s ease-in-out infinite`,
        ...hoverStyle,
      } as React.CSSProperties}
    >
      <div className="flex flex-col items-center leading-tight max-w-[80%]">
        <span className="text-sm font-semibold truncate max-w-full">{category}</span>
        <span className="text-[10px] font-medium opacity-65">{count}</span>
      </div>
    </Link>
  );
}
