"use client";

import { useEffect, useState } from "react";
import { getUmamiConfig, fetchPageviews } from "@/lib/umami";

/**
 * 浏览量数据源。不传 path 查全站总量，传文章路径查该页。
 * 返回 null 表示「不可用」：未配置 / 加载中 / 请求失败，调用方直接隐藏该段。
 */
export default function useUmamiViews(path?: string): number | null {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    if (!getUmamiConfig()) return; // 环境变量缺失 → 模块禁用，保持 null

    let cancelled = false;

    (async () => {
      try {
        let count = await fetchPageviews(path);

        // Umami 记录的路径可能带也可能不带尾部斜杠，0 时用另一种写法兜底
        if (count === 0 && path?.endsWith("/")) {
          const alt = await fetchPageviews(path.replace(/\/+$/, ""));
          count = Math.max(count, alt ?? 0);
        }

        if (!cancelled) setViews(count);
      } catch (error) {
        console.error("获取浏览量失败:", error);
        // 失败保持 null：隐藏该段，不显示 0
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [path]);

  return views;
}
