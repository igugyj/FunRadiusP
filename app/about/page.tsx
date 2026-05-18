import type { Metadata } from "next";
import { markdownToHtml, getSpecPageContent } from "../../lib/markdown";
import ProfileCard from "../../components/ui/ProfileCard";
import PageTitle from "../../components/ui/PageTitle";
import { generatePageMetadata } from "../../lib/i18n/metadata";
import GitHubCard from "../../components/features/GitHubCard";
export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/about",
    titleKey: "about.pageTitle",
    descriptionKey: "about.description",
  });
}

export default async function AboutPage() {
  const content = await getSpecPageContent("about");
  const htmlContent = await markdownToHtml(content);

  return (
    <div className="max-w-4xl mx-auto">
      <PageTitle translationKey="about.title" />
      <div className="card p-6">
        <ProfileCard />
        <GitHubCard />
        <div
          className="prose max-w-none"
          style={{ display: "block", margin: "0 auto", textAlign: "center" }}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}
