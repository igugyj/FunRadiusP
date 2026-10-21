"use client";

import { HiOutlineEye } from "react-icons/hi2";
import { useLanguage } from "@/lib/i18n";
import useUmamiViews from "@/components/umami/useUmamiViews";

/**
 * 页脚全站总浏览量：眼睛图标 + 数字，样式跟随所在文本行（不套徽章）。
 * 未配置 / 加载中 / 请求失败时返回 null，不占位。
 */
export default function TotalViews() {
  const { t, language } = useLanguage();
  const views = useUmamiViews(); // 不传 path → 全站总量

  if (views === null) return null;

  const shown = views.toLocaleString(language);
  const label = `${t("footer.totalViews")} ${shown}`;

  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={label}
      aria-label={label}
    >
      <HiOutlineEye className="w-4 h-4" aria-hidden="true" />
      {shown}
    </span>
  );
}
