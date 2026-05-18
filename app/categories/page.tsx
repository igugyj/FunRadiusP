import type { Metadata } from "next";
import { getCategories, getPostsByCategory } from "../../lib/posts";
import CategoriesClient from "../../components/features/CategoriesClient";
import { generatePageMetadata } from "../../lib/i18n/metadata";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/categories",
    titleKey: "categoriesPage.title",
    descriptionKey: "categoriesPage.description",
  });
}

export default function CategoriesPage() {
  const categories = getCategories();
  const categoriesWithCount = categories.map((category) => ({
    category,
    count: getPostsByCategory(category).length,
  }));
  return <CategoriesClient categoriesWithCount={categoriesWithCount} />;
}