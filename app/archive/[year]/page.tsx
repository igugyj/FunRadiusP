import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostsGroupedByYear } from "../../../lib/posts";
import { formatDate } from "../../../lib/utils";
import ArchiveYearPageClient from "../../../components/features/ArchiveYearPageClient";
import { getArchiveYearMetadata } from "../../../lib/i18n/metadata";

interface ArchiveYearPageProps {
  params: Promise<{ year: string }>;
}

export async function generateMetadata({ params }: ArchiveYearPageProps): Promise<Metadata> {
  const { year } = await params;
  return getArchiveYearMetadata(year);
}

export async function generateStaticParams() {
  const postsByYear = getPostsGroupedByYear();
  const years = Object.keys(postsByYear);
  return years.map((year) => ({
    year: year,
  }));
}

export default async function ArchiveYearPage({
  params,
}: ArchiveYearPageProps) {
  const { year } = await params;
  const postsByYear = getPostsGroupedByYear();
  const years = Object.keys(postsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a),
  );

  if (!postsByYear[year]) {
    notFound();
  }

  const posts = postsByYear[year];

  const formattedPostsByYear: Record<string, any[]> = {};
  Object.keys(postsByYear).forEach((y) => {
    formattedPostsByYear[y] = postsByYear[y].map((post) => ({
      id: post.id,
      title: post.title,
      published: formatDate(post.published),
    }));
  });

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    published: formatDate(post.published),
  }));

  return (
    <ArchiveYearPageClient
      year={year}
      posts={formattedPosts}
      postsByYear={formattedPostsByYear}
    />
  );
}
