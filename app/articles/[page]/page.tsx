import type { Metadata } from "next";
import { getPosts } from "../../../lib/posts";
import { paginate, formatDate } from "../../../lib/utils";
import ArticlesPageClient from "../../../components/features/ArticlesPageClient";
import { getArticlesPageMetadata } from "../../../lib/i18n/metadata";

const PAGE_SIZE = 5;

interface ArticlesPageProps {
  params: Promise<{ page: string }>;
}

export async function generateMetadata({ params }: ArticlesPageProps): Promise<Metadata> {
  const { page } = await params;
  return getArticlesPageMetadata(page);
}

export async function generateStaticParams() {
  const posts = getPosts();
  const totalPages = Math.ceil(posts.length / PAGE_SIZE);
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { page } = await params;
  const currentPage = parseInt(page || "1");
  const posts = getPosts();
  const { items: paginatedPosts, totalPages } = paginate(
    posts,
    currentPage,
    PAGE_SIZE,
  );

  const formattedPosts = paginatedPosts.map((post) => ({
    ...post,
    published: formatDate(post.published),
  }));

  return (
    <ArticlesPageClient
      paginatedPosts={formattedPosts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
