"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import Pagination from "@/components/ui/Pagination";
import SafeImage from "@/components/ui/SafeImage";

interface Post {
  id: string;
  title: string;
  description: string;
  published: string;
  category: string;
  tags: string[];
  image?: string;
}

interface ArticlesPageClientProps {
  paginatedPosts: Post[];
  currentPage: number;
  totalPages: number;
}

export default function ArticlesPageClient({
  paginatedPosts,
  currentPage,
  totalPages,
}: ArticlesPageClientProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--primary)" }}
      >
        {t("articlesPage.listTitle")}
      </h1>

      <div className="space-y-6">
        {paginatedPosts.map((post) => {
          if (!post) return null;
          return (
            <div key={post.id} className="card flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <div
                  className="flex items-center text-sm mb-4"
                  style={{ color: "var(--text)", opacity: 0.7 }}
                >
                  <span>{post.published}</span>
                  <span className="mx-2">·</span>
                  <Link
                    href={`/categories/${post.category}`}
                    className="hover:text-primary transition-colors"
                    style={{ color: "var(--text)", opacity: 0.7 }}
                  >
                    {post.category}
                  </Link>
                </div>
                <p
                  className="mb-4"
                  style={{ color: "var(--text)", opacity: 0.8 }}
                >
                  {post.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="text-xs px-2 py-1 rounded-full hover:opacity-80 transition-colors"
                      style={{
                        backgroundColor: "var(--secondary)",
                        color: "var(--text)",
                      }}
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
              {post.image && (
                <div className="md:w-48 flex-shrink-0">
                  <Link href={`/posts/${post.id}`} className="block">
                    <div
                      className="rounded-lg overflow-hidden shadow-md hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "var(--secondary)" }}
                    >
                      <SafeImage
                        src={post.image}
                        alt={post.title}
                        className="w-full h-32 object-cover"
                        loading="lazy"
                      />
                    </div>
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/articles"
      />
    </div>
  );
}
