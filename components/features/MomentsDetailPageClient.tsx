"use client";

import { useLanguage } from "@/lib/i18n";
import GiscusComments from "@/components/features/GiscusComments";
import SafeImage from "@/components/ui/SafeImage";
import MarkdownContent from "@/components/ui/MarkdownContent";

interface MomentDetail {
  id: string;
  time: string;
  content: string;
  photos: string[];
  draft: boolean;
}

interface MomentsDetailPageClientProps {
  moment: MomentDetail;
  htmlContent: string;
  isAutoHideEnabled: boolean;
}

export default function MomentsDetailPageClient({
  moment,
  htmlContent,
  isAutoHideEnabled,
}: MomentsDetailPageClientProps) {
  const { t } = useLanguage();

  // 确定图片布局
  let photoGridClass = "";
  let photoHeightClass = "";

  if (moment.photos.length === 1) {
    photoGridClass = "grid-cols-1";
    photoHeightClass = "h-80"; // 单张照片，更大一点但不要太夸张
  } else if (moment.photos.length === 2) {
    photoGridClass = "grid-cols-2";
    photoHeightClass = "h-52"; // 2列，高度适中
  } else if (moment.photos.length <= 4) {
    photoGridClass = "grid-cols-2";
    photoHeightClass = "h-52"; // 2列，高度适中
  } else {
    photoGridClass = "grid-cols-3";
    photoHeightClass = "h-48"; // 3列，稍小一点
  }

  return (
    <div
      className={
        isAutoHideEnabled
          ? "max-w-4xl mx-auto px-4"
          : "max-w-4xl mx-auto px-4 pt-20"
      }
    >
      <div className="card">
        <div
          className="flex items-center text-sm mb-6"
          style={{ color: "var(--text)", opacity: 0.7 }}
        >
          <span>{moment.time}</span>
        </div>

        <MarkdownContent html={htmlContent} />

        {moment.photos.length > 0 && (
          <div className={`grid gap-3 ${photoGridClass}`}>
            {moment.photos.map((photo: string, index: number) => (
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
                  clickable={true}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12">
        <GiscusComments />
      </div>
    </div>
  );
}
