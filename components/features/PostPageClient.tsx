"use client";

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
}

export default function PostPageClient({
  post,
  prev,
  next,
  htmlContent,
  isAutoHideEnabled,
}: PostPageClientProps) {
  const { t } = useLanguage();
  const _year = post.published ? post.published.match(/\d+/)?.at(0) : "";
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
                © {_year} {process.env.NEXT_PUBLIC_AUTHOR_NAME}. All rights
                reserved.
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
