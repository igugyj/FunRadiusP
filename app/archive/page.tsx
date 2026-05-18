import type { Metadata } from "next";
import { getPostsGroupedByYear } from "../../lib/posts";
import ArchiveClient from "../../components/features/ArchiveClient";
import { generatePageMetadata } from "../../lib/i18n/metadata";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/archive",
    titleKey: "archive.title",
    descriptionKey: "archivePage.title",
  });
}

export default async function ArchivePage() {
  const postsByYear = getPostsGroupedByYear();
  const years = Object.keys(postsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a),
  );
  const currentYear = new Date().getFullYear().toString();

  // 如果有今年的文章，显示今年；否则显示最新的一年
  const targetYear = postsByYear[currentYear] ? currentYear : years[0];

  return (
    <ArchiveClient
      postsByYear={postsByYear}
      years={years}
      targetYear={targetYear}
    />
  );
}
