import type { Metadata } from "next";
import { markdownToHtml, getSpecPageContent } from "../../lib/markdown";
import PageTitle from "../../components/ui/PageTitle";
import { generatePageMetadata } from "../../lib/i18n/metadata";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/information",
    titleKey: "informationPage.pageTitle",
    descriptionKey: "informationPage.description",
  });
}

export default async function InformationPage() {
  const content = await getSpecPageContent("information");
  const htmlContent = await markdownToHtml(content);

  return (
    <div className="max-w-4xl mx-auto">
      <PageTitle translationKey="informationPage.title" />
      <div className="card mb-8 p-6">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
