"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import { formatShortDate } from "@/lib/utils";

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

export default function ArchiveYearPageClient({
  year,
  posts,
  postsByYear,
}: ArchiveYearPageClientProps) {
  const { t } = useLanguage();
  const years = Object.keys(postsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a),
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
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
                  {t("archivePage.yearWithCount", {
                    year: y,
                    count: postsByYear[y].length,
                  })}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        <main className="flex-1">
          <h1 className="text-3xl font-bold mb-8 text-primary">
            {t("archivePage.yearPosts", { year })}
          </h1>

          <div className="space-y-2">
            {posts.map((post, i) => (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="archive-item entrance"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <span className="truncate text-sm font-medium">
                  {post.title}
                </span>
                <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                  {formatShortDate(post.published)}
                </span>
              </Link>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
