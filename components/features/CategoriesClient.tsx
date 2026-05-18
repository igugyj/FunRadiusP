"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n";

interface CategoryWithCount {
  category: string;
  count: number;
}

interface CategoriesClientProps {
  categoriesWithCount: CategoryWithCount[];
}

export default function CategoriesClient({ categoriesWithCount }: CategoriesClientProps) {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">
        {t("categoriesPage.title")}
      </h1>

      <div className="card overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-3 px-4 text-left">
                {t("categoriesPage.category")}
              </th>
              <th className="py-3 px-4 text-right">
                {t("categoriesPage.postCount")}
              </th>
            </tr>
          </thead>
          <tbody>
            {categoriesWithCount.map(({ category, count }) => (
              <tr
                key={category}
                className="border-b border-gray-200 hover:bg-gray-50"
              >
                <td className="py-3 px-4">
                  <Link
                    href={`/categories/${category}`}
                    className="text-primary hover:underline"
                  >
                    {category}
                  </Link>
                </td>
                <td className="py-3 px-4 text-right">{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
