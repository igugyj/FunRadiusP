import type { Metadata } from "next";
import { markdownToHtml, getSpecPageContent } from "../../lib/markdown";
import PageTitle from "../../components/ui/PageTitle";
import { generatePageMetadata } from "../../lib/i18n/metadata";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/journey",
    titleKey: "journeyPage.pageTitle",
    descriptionKey: "journeyPage.description",
  });
}

export default async function JourneyPage() {
  const content = await getSpecPageContent("journey");
  const htmlContent = await markdownToHtml(content);

  return (
    <div className="max-w-4xl mx-auto">
      <PageTitle translationKey="journeyPage.title" />
      <div className="card p-6">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
