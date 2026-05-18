"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface Demo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  hasShowHtml?: boolean;
}

interface DemoDetailPageClientProps {
  demo?: Demo | null;
  htmlContent?: string | null;
}

export default function DemoDetailPageClient({
  demo,
  htmlContent,
}: DemoDetailPageClientProps) {
  const { t } = useLanguage();

  if (!demo) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">{t("demosPage.notFound")}</h1>
        <Link href="/demos" className="text-primary hover:underline">
          {t("demosPage.backToList")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/demos"
          className="text-primary hover:underline flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {t("demosPage.backToList")}
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4 text-primary">{demo.title}</h1>
        <p className="text-gray-600 mb-4">{demo.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {demo.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={`/demos/${demo.id}/${demo.hasShowHtml ? "show.html" : "demo.html"}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          {t("demosPage.openFullPage")}
        </a>
      </div>

      {htmlContent ? (
        <div className="card overflow-hidden">
          <iframe
            srcDoc={htmlContent}
            title={demo.title}
            className="w-full border-0"
            style={{ minHeight: "600px" }}
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      ) : (
        <div className="card p-6 text-center">
          <p className="text-gray-500">{t("demosPage.noHtmlContent")}</p>
        </div>
      )}
    </div>
  );
}
