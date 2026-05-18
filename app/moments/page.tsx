import type { Metadata } from "next";
import { getMoments } from "../../lib/moments";
import { paginate } from "../../lib/utils";
import { markdownToHtml } from "../../lib/markdown";
import StructuredData from "../../components/ui/StructuredData";
import MomentsClient from "../../components/features/MomentsClient";
import { generatePageMetadata } from "../../lib/i18n/metadata";

const PAGE_SIZE = 10;

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/moments",
    titleKey: "momentsPage.pageTitle",
    descriptionKey: "momentsPage.description",
  });
}

export default async function MomentsPage() {
  const currentPage = 1;
  const moments = getMoments();
  const { items: paginatedMoments, totalPages } = paginate(
    moments,
    currentPage,
    PAGE_SIZE,
  );

  // 预渲染所有 Markdown 内容
  const momentsWithHtml = (
    await Promise.all(
      paginatedMoments.map(async (moment) => {
        if (!moment) return null;
        const htmlContent = await markdownToHtml(moment.content, {
          type: "moment",
          id: moment.id,
        });
        return { ...moment, htmlContent };
      }),
    )
  ).filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <>
      <StructuredData type="blog" />
      <MomentsClient
        initialMomentsWithHtml={momentsWithHtml}
        totalPages={totalPages}
      />
    </>
  );
}
