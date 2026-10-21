"use client";

import { HiOutlineClock, HiOutlineDocumentText } from "react-icons/hi2";
import { useLanguage } from "@/lib/i18n";
import { formatCompactCount } from "@/lib/utils";
import PageViews from "@/components/umami/PageViews";

interface PostStatsProps {
  words: number;
  minutes: number;
  path: string;
}

const badgeStyle = {
  backgroundColor: "var(--secondary)",
  color: "var(--text)",
};

/**
 * 文章统计徽章行：字数 → 阅读时间 → 浏览量
 * 三个独立徽章用空白隔开，无分隔符；只显示图标 + 数字，
 * 含义通过 title/aria-label 传达（走 i18n）。
 * 浏览量为异步数据，加载完成前只渲染前两个徽章。
 */
export default function PostStats({ words, minutes, path }: PostStatsProps) {
  const { t } = useLanguage();

  const wordsLabel = formatCompactCount(words);
  const minutesLabel = `${minutes} min`;

  return (
    <div
      className="flex flex-wrap items-center gap-2 mb-6"
      style={{ color: "var(--text)", opacity: 0.7 }}
    >
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
        style={badgeStyle}
        title={`${t("posts.statsWords")} ${wordsLabel}`}
        aria-label={`${t("posts.statsWords")} ${wordsLabel}`}
      >
        <HiOutlineDocumentText className="w-4 h-4" aria-hidden="true" />
        {wordsLabel}
      </span>

      <span
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
        style={badgeStyle}
        title={`${t("posts.statsReadTime")} ${minutesLabel}`}
        aria-label={`${t("posts.statsReadTime")} ${minutesLabel}`}
      >
        <HiOutlineClock className="w-4 h-4" aria-hidden="true" />
        {minutesLabel}
      </span>

      <PageViews path={path} />
    </div>
  );
}
