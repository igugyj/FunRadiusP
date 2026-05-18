"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface Post {
  id: string;
  title: string;
  description: string;
  published: string;
  tags: string[];
}

interface CategoryPageClientProps {
  category: string;
  posts: Post[];
}

export default function CategoryPageClient({ category, posts }: CategoryPageClientProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        {t("categories.pageTitle", { category })}
      </h1>

      {posts.length === 0 ? (
        <p className="text-gray-500">{t("categories.noPosts")}</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => {
            if (!post) return null;
            return (
              <div key={post.id} className="card">
                <h2 className="text-xl font-semibold mb-2">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <span>{post.published}</span>
                </div>
                <p className="text-gray-600 mb-4">{post.description}</p>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag: string) => (
                    <Link
                      key={tag}
                      href={`/tags/${tag}`}
                      className="text-xs bg-secondary text-primary px-2 py-1 rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
