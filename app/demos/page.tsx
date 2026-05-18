import type { Metadata } from "next";
import { getDemos } from "../../lib/demos";
import DemosClient from "../../components/features/DemosClient";
import { generatePageMetadata } from "../../lib/i18n/metadata";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/demos",
    titleKey: "demosPage.pageTitle",
    descriptionKey: "demosPage.description",
  });
}

export default async function DemosPage() {
  const demos = getDemos();
  return <DemosClient demos={demos} />;
}
