"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import Pagination from "@/components/ui/Pagination";
import SafeImage from "@/components/ui/SafeImage";

interface MomentWithHtml {
  id: string;
  time: string;
  content: string;
  htmlContent: string;
  photos: string[];
  draft: boolean;
}

interface MomentsPageWithPaginationClientProps {
  initialMomentsWithHtml: MomentWithHtml[];
  totalPages: number;
  currentPage: number;
  isAutoHideEnabled: boolean;
}

export default function MomentsPageWithPaginationClient({
  initialMomentsWithHtml,
  totalPages,
  currentPage,
  isAutoHideEnabled,
}: MomentsPageWithPaginationClientProps) {
  const { t } = useLanguage();

  return (
    <div
      className={
        isAutoHideEnabled
          ? "max-w-4xl mx-auto px-4"
          : "max-w-4xl mx-auto px-4 pt-20"
      }
    >
      <h1
        className="text-3xl font-bold mb-8"
        style={{ color: "var(--primary)" }}
      >
        {t("momentsPage.title")}
      </h1>

      <div className="space-y-8">
        {initialMomentsWithHtml.map((moment) => {
          const hasPhotos = moment.photos && moment.photos.length > 0;
          const previewPhotos = hasPhotos ? moment.photos.slice(0, 6) : [];

          // 确定图片布局
          let photoGridClass = "";
          if (previewPhotos.length === 1) {
            photoGridClass = "grid-cols-1";
          } else if (previewPhotos.length === 2) {
            photoGridClass = "grid-cols-2";
          } else if (previewPhotos.length <= 4) {
            photoGridClass = "grid-cols-2";
          } else {
            photoGridClass = "grid-cols-3";
          }

          // 确定图片高度
          let photoHeightClass = "";
          if (previewPhotos.length === 1) {
            photoHeightClass = "h-64"; // 单张照片更高一些
          } else {
            photoHeightClass = "h-40"; // 多张照片稍矮一些
          }

          return (
            <div key={moment.id} className="card">
              <Link href={`/moments/detail/${moment.id}`} className="block">
                <div
                  className="flex items-center text-sm mb-4"
                  style={{ color: "var(--text)", opacity: 0.7 }}
                >
                  <span>{moment.time}</span>
                </div>

                {/* 纯 CSS 限制高度，简单可靠 */}
                <div className="relative">
                  <div
                    className="prose max-w-none mb-4 post-content overflow-hidden"
                    style={{ maxHeight: "150px" }}
                    dangerouslySetInnerHTML={{ __html: moment.htmlContent }}
                  />
                  {/* 渐变遮罩 + 更多提示 */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--background)] to-transparent flex items-end justify-end pr-4 pb-2">
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--primary)" }}
                    >
                      {t("momentsPage.readMore")}
                    </span>
                  </div>
                </div>

                {hasPhotos && previewPhotos.length > 0 && (
                  <div className={`grid gap-2 mb-4 ${photoGridClass}`}>
                    {previewPhotos.map((photo: string, index: number) => (
                      <div
                        key={index}
                        className="rounded-lg overflow-hidden"
                        style={{ backgroundColor: "var(--secondary)" }}
                      >
                        <SafeImage
                          src={photo}
                          alt={t("momentsPage.photoAlt", { index: index + 1 })}
                          className={`w-full ${photoHeightClass} object-cover transition-transform duration-300 hover:scale-105`}
                          loading="lazy"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {hasPhotos && moment.photos.length > 6 && (
                  <div
                    className="text-sm"
                    style={{ color: "var(--text)", opacity: 0.6 }}
                  >
                    {t("momentsPage.morePhotos", {
                      count: moment.photos.length - 6,
                    })}
                  </div>
                )}
              </Link>
            </div>
          );
        })}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/moments/page"
      />
    </div>
  );
}
