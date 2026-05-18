"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface Post {
  id: string;
  title: string;
  published: string;
}

interface ArchiveYearPageClientProps {
  year: string;
  posts: Post[];
  postsByYear: Record<string, Post[]>;
}

export default function ArchiveYearPageClient({ year, posts, postsByYear }: ArchiveYearPageClientProps) {
  const { t } = useLanguage();
  const years = Object.keys(postsByYear).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* 左侧年份导航 */}
        <aside className="lg:w-48 flex-shrink-0">
          <div className="card sticky top-4">
            <h2 className="text-lg font-semibold mb-4 text-primary">
              {t("archivePage.yearNav")}
            </h2>
            <nav className="space-y-1">
              {years.map((y) => (
                <Link
                  key={y}
                  href={`/archive/${y}`}
                  className={`block px-3 py-2 rounded transition-colors ${
                    y === year
                      ? "bg-primary text-white"
                      : "text-primary hover:bg-secondary"
                  }`}
                >
                  {t("archivePage.yearWithCount", { year: y, count: postsByYear[y].length })}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* 右侧文章列表 */}
        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-8 text-primary">
            {t("archivePage.yearPosts", { year })}
          </h1>

          <div className="space-y-3">
            {posts.map((post) => (
              <div key={post.id} className="card">
                <h3 className="text-lg font-semibold mb-2">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-gray-500 text-sm">
                  {post.published}
                </p>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
