import type { Metadata } from "next";
import { getTags, getPostsByTag } from "../../lib/posts";
import TagsClient from "../../components/features/TagsClient";
import { generatePageMetadata } from "../../lib/i18n/metadata";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/tags",
    titleKey: "tagsPage.title",
    descriptionKey: "tagsPage.description",
  });
}

export default function TagsPage() {
  const tags = getTags();
  const tagsWithCount = tags.map((tag) => ({
    tag,
    count: getPostsByTag(tag).length,
  }));
  return <TagsClient tagsWithCount={tagsWithCount} />;
}