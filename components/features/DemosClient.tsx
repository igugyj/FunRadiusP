"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface Demo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
}

interface DemosClientProps {
  demos: Demo[];
}

export default function DemosClient({ demos }: DemosClientProps) {
  const { t, language } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        {t("demosPage.title")}
      </h1>

      {demos.length === 0 ? (
        <div className="card p-6 text-center">
          <p className="text-gray-500">{t("demosPage.noDemos")}</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {demos.map((demo) => (
            <Link key={demo.id} href={`/demos/${demo.id}`} className="block">
              <div className="card p-6 hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-2 text-primary">
                  {demo.title}
                </h2>
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
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{demo.author}</span>
                  <span>
                    {new Date(demo.date).toLocaleDateString(
                      language === "zh" ? "zh-CN" : "en-US"
                    )}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
