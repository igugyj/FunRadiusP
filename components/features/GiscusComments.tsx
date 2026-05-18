'use client';

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

export default function GiscusComments() {
  const { t, language } = useLanguage();
  const [theme, setTheme] = useState("light");
  const [hasConfig, setHasConfig] = useState(false);

  // 语言到 Giscus 语言码的映射
  const getGiscusLang = (lang: string): string => {
    const langMap: Record<string, string> = {
      zh: "zh-CN",
      en: "en",
      es: "es",
      ja: "ja",
      de: "de",
      fr: "fr",
    };
    return langMap[lang] || "zh-CN";
  };

  useEffect(() => {
    // 检查是否有 Giscus 配置
    const checkConfig = () => {
      const configScript = document.getElementById("giscus-config");
      const hasEnvConfig = process.env.NEXT_PUBLIC_GISCUS_REPO;
      setHasConfig(!!configScript || !!hasEnvConfig);
    };

    // 检测当前主题
    const checkTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    };

    // 初始检测
    checkConfig();
    checkTheme();

    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          checkTheme();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasConfig) return;

    // giscus 评论区管理器 - 简洁版本
    (function () {
      "use strict";

      // 初始化 giscus 评论区
      function loadGiscus(currentTheme: string) {
        // 查找评论区容器
        const container = document.getElementById("giscus-container");
        if (!container) {
          return;
        }

        // 读取配置
        const configScript = document.getElementById("giscus-config");
        let config: {
          repo: string;
          repoId: string;
          category: string;
          categoryId: string;
          mapping: string;
          strict: string;
          reactionsEnabled: string;
          emitMetadata: string;
          inputPosition: string;
          theme: string;
          lang: string;
        };

        if (configScript) {
          try {
            config = JSON.parse(configScript.textContent);
          } catch (e) {
            return;
          }
        } else if (process.env.NEXT_PUBLIC_GISCUS_REPO) {
          // 从环境变量读取配置
          config = {
            repo: process.env.NEXT_PUBLIC_GISCUS_REPO as string,
            repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID as string,
            category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY as string,
            categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID as string,
            mapping: "pathname",
            strict: "0",
            reactionsEnabled: "1",
            emitMetadata: "0",
            inputPosition: "bottom",
            theme: currentTheme,
            lang: getGiscusLang(language),
          };
        } else {
          return;
        }

        // 清理旧的 giscus 组件
        cleanupGiscus(container);

        // 创建新的 giscus script
        const script = document.createElement("script");
        script.src = "https://giscus.app/client.js";
        script.setAttribute("data-repo", config.repo);
        script.setAttribute("data-repo-id", config.repoId);
        script.setAttribute("data-category", config.category);
        script.setAttribute("data-category-id", config.categoryId);
        script.setAttribute("data-mapping", config.mapping);
        script.setAttribute("data-strict", config.strict);
        script.setAttribute("data-reactions-enabled", config.reactionsEnabled);
        script.setAttribute("data-emit-metadata", config.emitMetadata);
        script.setAttribute("data-input-position", config.inputPosition);
        script.setAttribute("data-theme", config.theme);
        script.setAttribute("data-lang", config.lang);
        script.setAttribute("data-loading", "lazy");
        script.setAttribute("crossorigin", "anonymous");
        script.async = true;

        // 插入 script
        container.appendChild(script);
      }

      // 清理旧的 giscus 组件
      function cleanupGiscus(container: HTMLElement) {
        // 移除所有子元素
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }

      // 延迟加载
      function delayedLoadGiscus(currentTheme: string) {
        setTimeout(() => loadGiscus(currentTheme), 100);
      }

      // 暴露到全局
      (window as any).reloadGiscus = delayedLoadGiscus;

      // 初始页面加载
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () =>
          delayedLoadGiscus(theme),
        );
      } else {
        delayedLoadGiscus(theme);
      }
    })();
  }, [theme, hasConfig, language]);

  if (!hasConfig) {
    return null;
  }

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-6">{t("comments.title")}</h3>
      <div id="giscus-container"></div>
    </div>
  );
}