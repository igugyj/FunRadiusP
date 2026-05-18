"use client";

import React from "react";
import { FaGithub } from "react-icons/fa";
import { SiCloudflare } from "react-icons/si";
import { useLanguage } from "@/lib/i18n";

// 辅助函数：解析带占位符的翻译字符串
const parseTranslationWithPlaceholders = (
  str: string,
  placeholders: Record<string, React.ReactNode>,
): React.ReactNode[] => {
  const regex = /\{(\w+)\}/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    // 添加占位符之前的文本
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${lastIndex}`}>
          {str.slice(lastIndex, match.index)}
        </span>,
      );
    }
    // 添加占位符对应的内容
    const placeholderName = match[1];
    parts.push(
      <React.Fragment key={`placeholder-${placeholderName}`}>
        {placeholders[placeholderName]}
      </React.Fragment>,
    );
    lastIndex = match.index + match[0].length;
  }
  // 添加最后剩余的文本
  if (lastIndex < str.length) {
    parts.push(<span key={`text-${lastIndex}`}>{str.slice(lastIndex)}</span>);
  }
  return parts;
};

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "FunRadiusP";

  const githubLink = (
    <span className="relative inline-block group">
      <a
        href="https://github.com"
        className="inline-flex items-center gap-1"
        style={{ color: "var(--primary)" }}
      >
        <FaGithub className="w-4 h-4" />
        GitHub
      </a>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded bg-gray-800 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {t("footer.githubThanks")}
      </span>
    </span>
  );

  const cloudflareLink = (
    <span className="relative inline-block group">
      <a
        href="https://www.cloudflare.com"
        className="inline-flex items-center gap-1"
        style={{ color: "var(--primary)" }}
      >
        <SiCloudflare className="w-4 h-4" />
        Cloudflare
      </a>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs rounded bg-gray-800 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {t("footer.cloudflareThanks")}
      </span>
    </span>
  );

  return (
    <footer
      className="border-t mt-12 py-8 relative z-20"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--secondary)",
      }}
    >
      <div className="container mx-auto px-4 text-center">
        <p style={{ color: "var(--text)" }}>
          {t("footer.copyright", { year, siteName })}
        </p>
        <p
          className="text-sm mt-2"
          style={{ color: "var(--text)", opacity: 0.7 }}
        >
          {t("footer.poweredBy")}
        </p>
        <p
          className="text-sm mt-2 flex items-center justify-center gap-2"
          style={{ color: "var(--text)", opacity: 0.7 }}
        >
          {parseTranslationWithPlaceholders(t("footer.supportedBy"), {
            github: githubLink,
            cloudflare: cloudflareLink,
          })}
        </p>
        {/* 新增备案号链接
        <p className="text-sm mt-2" style={{ color: "var(--text)" }}>
          <a
            href="https://icp.gov.moe/?keyword=20268070"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--primary)", opacity: 0.7 }}
          >
            萌ICP备20268070号
          </a>{" "}
          |{" "}
          <a
            href="https://travel.moe/go.html?travel=on"
            style={{ color: "var(--primary)", opacity: 0.7 }}
            rel="noopener noreferrer"
          >
            {t("footer.travelLink")}
          </a>
        </p> */}
      </div>
    </footer>
  );
}
