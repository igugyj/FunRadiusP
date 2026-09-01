"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import TableOfContents from "@/components/ui/TableOfContents";
import GiscusComments from "@/components/features/GiscusComments";
import ExpandableCover from "@/components/ui/ExpandableCover";
import MarkdownContent from "@/components/ui/MarkdownContent";

interface Post {
  id: string;
  title: string;
  description: string;
  published: string;
  category: string;
  tags: string[];
  image?: string;
  content: string;
  player?: any;
}

interface PostPageClientProps {
  post: Post;
  prev: Post | null;
  next: Post | null;
  htmlContent: string;
  isAutoHideEnabled: boolean;
  slug: string;
  shortCode: string | null;
}

export default function PostPageClient({
  post,
  prev,
  next,
  htmlContent,
  isAutoHideEnabled,
  slug,
  shortCode,
}: PostPageClientProps) {
  const { t } = useLanguage();
  const [copiedPath, setCopiedPath] = useState<string | null>(null);
  const _year = post.published ? post.published.match(/\d+/)?.at(0) : "";
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");

  const copyLink = async (path: string) => {
    const url = `${window.location.origin}${path}`;
    await navigator.clipboard.writeText(url);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  return (
    <>
      <div
        className={
          isAutoHideEnabled
            ? "max-w-6xl mx-auto px-4"
            : "max-w-6xl mx-auto px-4 pt-20"
        }
      >
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 主内容 */}
          <div className="lg:w-3/4 min-w-0">
            <h1
              className="text-3xl font-bold mb-4"
              style={{ color: "var(--primary)" }}
            >
              {post.title}
            </h1>
            <div
              className="flex flex-wrap items-center gap-4 text-sm mb-6"
              style={{ color: "var(--text)", opacity: 0.7 }}
            >
              <span>{post.published}</span>
              {post.category && (
                <Link
                  href={`/categories/${post.category}`}
                  className="px-3 py-1 rounded-full hover:opacity-80 transition-colors"
                  style={{
                    backgroundColor: "var(--secondary)",
                    color: "var(--primary)",
                  }}
                >
                  {post.category}
                </Link>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="px-3 py-1 rounded-full hover:opacity-80 transition-colors"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--text)",
                      }}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* 分享链接 */}
            {shortCode && (
              <div
                className="flex items-center justify-between gap-2 text-sm mb-3 px-3 py-2 rounded-lg"
                style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
              >
                <a
                  href={`/p/${shortCode}/`}
                  className="hover:underline font-mono truncate"
                  style={{ color: "var(--primary)" }}
                >
                  {siteUrl}/p/{shortCode}/
                </a>
                <button
                  onClick={() => copyLink(`/p/${shortCode}/`)}
                  className="p-1 rounded hover:opacity-80 transition-opacity flex-shrink-0"
                  title={copiedPath === `/p/${shortCode}/` ? t("common.copied") : t("common.copy")}
                >
                  {copiedPath === `/p/${shortCode}/` ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
            )}
            <div
              className="flex items-center justify-between gap-2 text-sm mb-6 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--secondary)", color: "var(--text)" }}
            >
              <a
                href={`/posts/${slug}/`}
                className="hover:underline font-mono truncate"
                style={{ color: "var(--primary)" }}
              >
                {siteUrl}/posts/{slug}/
              </a>
              <button
                onClick={() => copyLink(`/posts/${slug}/`)}
                className="p-1 rounded hover:opacity-80 transition-opacity flex-shrink-0"
                title={copiedPath === `/posts/${slug}/` ? t("common.copied") : t("common.copy")}
              >
                {copiedPath === `/posts/${slug}/` ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
                    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" strokeWidth="2" />
                  </svg>
                )}
              </button>
            </div>

            {/* 文章封面 */}
            {post.image && (
              <ExpandableCover image={post.image} alt={post.title} />
            )}

            {/* 文章内容 */}
            <MarkdownContent html={htmlContent} />

            {/* 版权声明 */}
            <div
              className="border-t pt-6 mb-8"
              style={{ borderColor: "var(--secondary)" }}
            >
              <p
                className="text-sm"
                style={{ color: "var(--text)", opacity: 0.7 }}
              >
                © {_year} {process.env.NEXT_PUBLIC_AUTHOR_NAME}. CC BY-NC-SA
                4.0.
              </p>
            </div>

            {/* 上一篇/下一篇 */}
            <div className="grid grid-cols-2 gap-8 mb-12">
              <div className="text-left">
                {prev && (
                  <Link
                    href={`/posts/${prev.id}`}
                    className="hover:underline flex items-center transition-all px-4 py-2 rounded-lg"
                    style={{
                      color: "var(--primary)",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <span className="mr-2">←</span>
                    <span className="truncate">
                      {t("posts.prevPost")}
                      {prev.title}
                    </span>
                  </Link>
                )}
              </div>
              <div className="text-right">
                {next && (
                  <Link
                    href={`/posts/${next.id}`}
                    className="hover:underline flex items-center justify-end transition-all px-4 py-2 rounded-lg"
                    style={{
                      color: "var(--primary)",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    <span className="truncate">
                      {t("posts.nextPost")}
                      {next.title}
                    </span>
                    <span className="ml-2">→</span>
                  </Link>
                )}
              </div>
            </div>

            {/* 评论区 */}
            <GiscusComments />
          </div>

          {/* 侧边栏 */}
          <div className="lg:w-1/4 flex-shrink-0 hidden lg:block">
            {/* 目录 */}
            {isAutoHideEnabled ? (
              <div className="sticky top-4">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("posts.toc")}
                  </h3>
                  <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                    <TableOfContents content={htmlContent} />
                  </div>
                </div>
              </div>
            ) : (
              <div className="sticky top-24">
                <div className="card">
                  <h3 className="text-lg font-semibold mb-4">
                    {t("posts.toc")}
                  </h3>
                  <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                    <TableOfContents content={htmlContent} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
