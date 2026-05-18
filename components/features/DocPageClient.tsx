"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";
import TableOfContents from "@/components/ui/TableOfContents";
import GiscusComments from "@/components/features/GiscusComments";
import MarkdownContent from "@/components/ui/MarkdownContent";

interface Doc {
  id: string;
  title: string;
  description?: string;
  content: string;
}

interface DocCollection {
  id: string;
  title: string;
  icon: string;
  docs: Doc[];
}

interface DocPageClientProps {
  collection: DocCollection;
  doc: Doc;
  prev: Doc | null;
  next: Doc | null;
  htmlContent: string;
  isAutoHideEnabled: boolean;
}

function DocSidebar({
  collection,
  currentDocId,
}: {
  collection: DocCollection;
  currentDocId: string;
}) {
  return (
    <div className="card">
      <Link
        href={`/docs/${collection.id}`}
        className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
        style={{ color: "var(--primary)" }}
      >
        <span className="text-2xl">{collection.icon}</span>
        <span className="font-bold">{collection.title}</span>
      </Link>
      <div className="space-y-1 max-h-[calc(100vh-12rem)] overflow-y-auto">
        {collection.docs.map((doc, index) => (
          <Link
            key={doc.id}
            href={`/docs/${collection.id}/${encodeURIComponent(doc.id)}`}
            className={`block px-3 py-2 rounded-md text-sm transition-all ${
              doc.id === currentDocId
                ? "bg-primary/10 text-primary font-medium"
                : "hover:bg-primary/5"
            }`}
            style={{
              color: doc.id === currentDocId ? "var(--primary)" : "var(--text)",
            }}
          >
            <span className="mr-2 opacity-60">{index + 1}.</span>
            <span className="truncate">{doc.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function DocPageClient({
  collection,
  doc,
  prev,
  next,
  htmlContent,
  isAutoHideEnabled,
}: DocPageClientProps) {
  const { t } = useLanguage();

  return (
    <div className={isAutoHideEnabled ? "w-full" : "w-full pt-20"}>
      <div className="flex flex-col lg:flex-row">
        {/* 左侧 - 文件目录 - 靠左停靠 */}
        <div className="lg:w-72 flex-shrink-0 hidden lg:block">
          {isAutoHideEnabled ? (
            <div className="sticky top-4 pl-4">
              <DocSidebar collection={collection} currentDocId={doc.id} />
            </div>
          ) : (
            <div className="sticky top-24 pl-4">
              <DocSidebar collection={collection} currentDocId={doc.id} />
            </div>
          )}
        </div>

        {/* 中间 - 内容 - 扩大宽度 */}
        <div className="flex-1 min-w-0 px-4 lg:px-8">
          <Link
            href={`/docs/${collection.id}`}
            className="inline-flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity lg:hidden"
            style={{ color: "var(--primary)" }}
          >
            <span>←</span>
            <span>
              {t("docsPage.backToCollection", { title: collection.title })}
            </span>
          </Link>

          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--primary)" }}
          >
            {doc.title}
          </h1>

          {doc.description && (
            <p
              className="text-xl mb-8"
              style={{ color: "var(--text)", opacity: 0.8 }}
            >
              {doc.description}
            </p>
          )}

          <MarkdownContent html={htmlContent} />

          {/* 上一篇/下一篇 */}
          <div className="grid grid-cols-2 gap-6 mb-12">
            <div className="text-left">
              {prev && (
                <Link
                  href={`/docs/${collection.id}/${encodeURIComponent(prev.id)}`}
                  className="block p-4 rounded-lg card hover:translate-x-1 transition-all"
                >
                  <div
                    className="text-sm mb-1"
                    style={{ color: "var(--text)", opacity: 0.6 }}
                  >
                    {t("docsPage.prevDoc")}
                  </div>
                  <div
                    className="font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    {prev.title}
                  </div>
                </Link>
              )}
            </div>
            <div className="text-right">
              {next && (
                <Link
                  href={`/docs/${collection.id}/${encodeURIComponent(next.id)}`}
                  className="block p-4 rounded-lg card hover:-translate-x-1 transition-all"
                >
                  <div
                    className="text-sm mb-1"
                    style={{ color: "var(--text)", opacity: 0.6 }}
                  >
                    {t("docsPage.nextDoc")}
                  </div>
                  <div
                    className="font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    {next.title}
                  </div>
                </Link>
              )}
            </div>
          </div>

          {/* 评论区 */}
          <GiscusComments />
        </div>

        {/* 右侧 - 文章目录 - 靠右停靠 */}
        <div className="lg:w-72 flex-shrink-0 hidden xl:block">
          {isAutoHideEnabled ? (
            <div className="sticky top-4 pr-4">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">
                  {t("common.toc")}
                </h3>
                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                  <TableOfContents content={htmlContent} />
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-24 pr-4">
              <div className="card">
                <h3 className="text-lg font-semibold mb-4">
                  {t("common.toc")}
                </h3>
                <div className="max-h-[calc(100vh-10rem)] overflow-y-auto">
                  <TableOfContents content={htmlContent} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
