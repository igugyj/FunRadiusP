import type { Metadata } from "next";
import { getMoments } from "../../../../lib/moments";
import { paginate, formatMomentTime } from "../../../../lib/utils";
import { markdownToHtml } from "../../../../lib/markdown";
import StructuredData from "../../../../components/ui/StructuredData";
import MomentsPageWithPaginationClient from "../../../../components/features/MomentsPageWithPaginationClient";
import { getMomentsPageMetadata } from "../../../../lib/i18n/metadata";

const PAGE_SIZE = 10;

interface MomentsPageProps {
  params: Promise<{ page: string }>;
}

export async function generateMetadata({
  params,
}: MomentsPageProps): Promise<Metadata> {
  const { page } = await params;
  return getMomentsPageMetadata(page);
}

export async function generateStaticParams() {
  const moments = getMoments();
  const totalPages = Math.ceil(moments.length / PAGE_SIZE);
  return Array.from({ length: totalPages }, (_, i) => ({
    page: (i + 1).toString(),
  }));
}

export default async function MomentsPageWithPagination({
  params,
}: MomentsPageProps) {
  const { page: pageParam } = await params;
  const currentPage = parseInt(pageParam || "1", 10);
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
        return { ...moment, time: formatMomentTime(moment.time), htmlContent };
      }),
    )
  ).filter((item): item is NonNullable<typeof item> => item !== null);

  const isAutoHideEnabled =
    process.env.NEXT_PUBLIC_HEADER_AUTO_HIDE_ENABLED !== "false";

  return (
    <>
      <StructuredData type="blog" />
      <MomentsPageWithPaginationClient
        initialMomentsWithHtml={momentsWithHtml}
        totalPages={totalPages}
        currentPage={currentPage}
        isAutoHideEnabled={isAutoHideEnabled}
      />
    </>
  );
}
