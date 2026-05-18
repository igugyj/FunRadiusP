"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface TagWithCount {
  tag: string;
  count: number;
}

interface TagsClientProps {
  tagsWithCount: TagWithCount[];
}

// 计算标签大小（根据文章数量）
function getTagSize(count: number): string {
  if (count >= 10) return 'text-2xl';
  if (count >= 5) return 'text-xl';
  if (count >= 3) return 'text-lg';
  return 'text-base';
}

export default function TagsClient({ tagsWithCount }: TagsClientProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        {t("tagsPage.tagCloud")}
      </h1>

      <div className="card p-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {tagsWithCount.map(({ tag, count }) => {
            const sizeClass = getTagSize(count);

            return (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className={`${sizeClass} font-medium text-primary hover:text-dark transition-colors`}
              >
                {tag} ({count})
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
