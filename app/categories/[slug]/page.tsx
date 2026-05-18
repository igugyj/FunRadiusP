import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCategories, getPostsByCategory } from "../../../lib/posts";
import { formatDate } from "../../../lib/utils";
import CategoryPageClient from "../../../components/features/CategoryPageClient";
import { getCategoryMetadata } from "../../../lib/i18n/metadata";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getCategoryMetadata(slug);
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    slug: category,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((cat) => cat === slug);

  if (!category) {
    console.log("Category not found:", slug);
    console.log("Available categories:", categories);
    notFound();
  }

  const posts = getPostsByCategory(category);
  const formattedPosts = posts.map((post) => ({
    ...post,
    published: formatDate(post.published),
  }));

  return <CategoryPageClient category={category} posts={formattedPosts} />;
}
