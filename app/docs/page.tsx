import type { Metadata } from "next";
import { getDocCollections } from "../../lib/docs";
import DocsClient from "../../components/features/DocsClient";
import { generatePageMetadata } from "../../lib/i18n/metadata";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/docs",
    titleKey: "docsPage.pageTitle",
    descriptionKey: "docsPage.description",
  });
}

export default async function DocsPage() {
  const collections = getDocCollections();
  return <DocsClient collections={collections} />;
}
