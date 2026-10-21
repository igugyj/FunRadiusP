"use client";

import { HiOutlineEye } from "react-icons/hi2";
import { useLanguage } from "@/lib/i18n";
import useUmamiViews from "@/components/umami/useUmamiViews";

/**
 * 文章页浏览量徽章：眼睛图标 + 数字（无指示文本）。
 * 未配置 / 加载中 / 请求失败时返回 null，该徽章直接不渲染。
 */
export default function PageViews({ path }: { path: string }) {
  const { t, language } = useLanguage();
  const views = useUmamiViews(path);

  if (views === null) return null;

  const shown = views.toLocaleString(language);
  const label = `${t("posts.statsViews")} ${shown}`;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full"
      style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
      title={label}
      aria-label={label}
    >
      <HiOutlineEye className="w-4 h-4" aria-hidden="true" />
      {shown}
    </span>
  );
}
