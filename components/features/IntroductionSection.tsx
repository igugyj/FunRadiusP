// components/features/IntroductionSection.tsx
import { markdownToHtml, getSpecPageContent } from "../../lib/markdown";

export default async function IntroductionSection() {
  const content = await getSpecPageContent("about");
  const htmlContent = await markdownToHtml(content);

  return (
    <div
      className="prose max-w-none"
      style={{ display: "block", margin: "0 auto", textAlign: "center" }}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
