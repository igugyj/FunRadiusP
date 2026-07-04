import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "../../lib/posts";
import { paginate, formatDate } from "../../lib/utils";
import Pagination from "../../components/ui/Pagination";
import SafeImage from "../../components/ui/SafeImage";
import StructuredData from "../../components/ui/StructuredData";
import PageTitle from "../../components/ui/PageTitle";
import { generatePageMetadata } from "../../lib/i18n/metadata";

const PAGE_SIZE = 5;

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/articles",
    titleKey: "articlesPage.title",
    descriptionKey: "articlesPage.description",
  });
}

export default async function ArticlesPage() {
  const currentPage = 1;
  const posts = getPosts();
  const { items: paginatedPosts, totalPages } = paginate(
    posts,
    currentPage,
    PAGE_SIZE,
  );

  return (
    <>
      <StructuredData type="blog" />
      <div className="max-w-4xl mx-auto">
        <PageTitle translationKey="articlesPage.title" />

        <div className="space-y-6">
          {paginatedPosts.map((post, i) => {
            if (!post) return null;
            return (
              <Link
                key={post.id}
                href={`/posts/${post.id}`}
                className="entrance card flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all duration-300 group"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <div
                    className="flex items-center text-sm mb-4"
                    style={{ color: "var(--text)", opacity: 0.7 }}
                  >
                    <span>{formatDate(post.published)}</span>
                    <span className="mx-2">·</span>
                    <span>{post.category}</span>
                  </div>
                  <p
                    className="mb-4"
                    style={{ color: "var(--text)", opacity: 0.8 }}
                  >
                    {post.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: "var(--secondary)",
                          color: "var(--text)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                {post.image && (
                  <div className="md:w-48 flex-shrink-0 self-center">
                    <div
                      className="rounded-lg overflow-hidden shadow-md group-hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: "var(--secondary)" }}
                    >
                      <SafeImage
                        src={post.image}
                        alt={post.title}
                        className="w-full h-32 object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          basePath="/articles"
        />
      </div>
    </>
  );
}
