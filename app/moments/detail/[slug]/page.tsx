import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMomentById, getMoments } from "../../../../lib/moments";
import { formatMomentTime } from "../../../../lib/utils";
import { markdownToHtml } from "../../../../lib/markdown";
import StructuredData from "../../../../components/ui/StructuredData";
import MomentsDetailPageClient from "../../../../components/features/MomentsDetailPageClient";
import { getMomentDetailMetadata, getMomentNotFoundMetadata, formatTranslation, buildMetadata } from "../../../../lib/i18n/metadata";

interface MomentsPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: MomentsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const moment = getMomentById(slug);

  if (!moment) {
    return getMomentNotFoundMetadata(slug);
  }

  const formattedTime = formatMomentTime(moment.time);
  const title = formatTranslation("momentsPage.detailTitle", { time: formattedTime });
  const description = moment.content.substring(0, 100);
  const photoAltOpenGraph = formatTranslation("momentsPage.photoAltOpenGraph");
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com").replace(/\/+$/, "");
  const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Your Name";
  let image = `${siteUrl}/favicon.png`;

  if (moment.photos.length > 0) {
    const photoUrl = moment.photos[0];
    if (photoUrl.startsWith("http://") || photoUrl.startsWith("https://")) {
      image = photoUrl;
    } else {
      image = `${siteUrl}${photoUrl}`;
    }
  }

  const baseMetadata = buildMetadata(`/moments/detail/${slug}`, title, description, "article");
  return {
    ...baseMetadata,
    openGraph: {
      ...baseMetadata.openGraph,
      images: [{ url: image, alt: photoAltOpenGraph }],
      publishedTime: moment.time,
      modifiedTime: moment.time,
      authors: [authorName],
    } as any,
    twitter: {
      ...baseMetadata.twitter,
      images: [image],
    },
  };
}

export async function generateStaticParams() {
  const moments = getMoments();
  return moments.map((moment) => ({
    slug: moment.id,
  }));
}

export default async function MomentsPage({ params }: MomentsPageProps) {
  const { slug } = await params;
  const moment = getMomentById(slug);
  if (!moment) notFound();

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com").replace(/\/+$/, "");
  const htmlContent = await markdownToHtml(moment.content, {
    type: "moment",
    id: moment.id,
  });

  const isAutoHideEnabled =
    process.env.NEXT_PUBLIC_HEADER_AUTO_HIDE_ENABLED !== "false";

  const formattedMoment = {
    ...moment,
    time: formatMomentTime(moment.time),
  };

  return (
    <>
      <StructuredData type="breadcrumb" data={{
        items: [
          { name: "Home", url: siteUrl },
          { name: "Moments", url: `${siteUrl}/moments` },
          { name: formattedMoment.time, url: `${siteUrl}/moments/detail/${slug}` },
        ],
      }} />
      <StructuredData type="article" data={moment} />
      <MomentsDetailPageClient
        moment={formattedMoment}
        htmlContent={htmlContent}
        isAutoHideEnabled={isAutoHideEnabled}
      />
    </>
  );
}
