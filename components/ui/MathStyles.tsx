"use client";

import { useEffect } from "react";

// KaTeX CSS 按需注入：仅当页面出现 .katex 元素（数学公式）时才加载，
// 避免全局渲染阻塞。样式由 copy-assets 自托管到 /katex/。
let injected = false;

export default function MathStyles() {
  useEffect(() => {
    const inject = () => {
      if (injected || !document.querySelector(".katex")) return;
      injected = true;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/katex/katex.min.css";
      document.head.appendChild(link);
    };

    inject();
    if (injected) return;
    const observer = new MutationObserver(inject);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
