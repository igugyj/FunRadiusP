"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface Doc {
  id: string;
  title: string;
  description: string;
}

interface DocCollection {
  id: string;
  icon: string;
  title: string;
  description: string;
  docs: Doc[];
}

interface DocsClientProps {
  collections: DocCollection[];
}

export default function DocsClient({ collections }: DocsClientProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-6xl mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8" style={{ color: "var(--primary)" }}>
        {t("docsPage.title")}
      </h1>

      {collections.length === 0 ? (
        <div className="card text-center py-12">
          <p style={{ color: "var(--text)", opacity: 0.7 }}>
            {t("docsPage.noCollections")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/docs/${collection.id}`}
              className="card hover:translate-y-[-4px] transition-all duration-300 block"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{collection.icon}</span>
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold mb-2" style={{ color: "var(--primary)" }}>
                    {collection.title}
                  </h2>
                  <p className="text-sm mb-3" style={{ color: "var(--text)", opacity: 0.8 }}>
                    {collection.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text)", opacity: 0.6 }}>
                    <span>{t("docsPage.docCount", { count: collection.docs.length })}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
