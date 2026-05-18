import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTags, getPostsByTag } from "../../../lib/posts";
import { formatDate } from "../../../lib/utils";
import TagPageClient from "../../../components/features/TagPageClient";
import { getTagMetadata } from "../../../lib/i18n/metadata";

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { slug } = await params;
  return getTagMetadata(slug);
}

export async function generateStaticParams() {
  const tags = getTags();
  return tags.map((tag) => ({
    slug: tag,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tags = getTags();
  const tag = tags.find((t) => t === slug);
  if (!tag) {
    console.log("Tag not found:", slug);
    console.log("Available tags:", tags);
    notFound();
  }

  const posts = getPostsByTag(tag);
  const formattedPosts = posts.map((post) => ({
    ...post,
    published: formatDate(post.published),
  }));

  return <TagPageClient tag={tag} posts={formattedPosts} />;
}
