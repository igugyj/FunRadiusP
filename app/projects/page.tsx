import type { Metadata } from "next";
import { markdownToHtml, getSpecPageContent } from "../../lib/markdown";
import PageTitle from "../../components/ui/PageTitle";
import { generatePageMetadata } from "../../lib/i18n/metadata";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/projects",
    titleKey: "projectsPage.pageTitle",
    descriptionKey: "projectsPage.description",
  });
}

export default async function ProjectsPage() {
  const content = await getSpecPageContent('projects');
  const htmlContent = await markdownToHtml(content);

  return (
    <div className="max-w-4xl mx-auto">
      <PageTitle translationKey="projectsPage.title" />
      <div className="card p-6">
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: htmlContent }} />
      </div>
    </div>
  );
}
