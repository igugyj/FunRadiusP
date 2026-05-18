import type { Metadata } from "next";
import zhTranslations from "./translations/zh.json";
import enTranslations from "./translations/en.json";
import esTranslations from "./translations/es.json";
import jaTranslations from "./translations/ja.json";
import deTranslations from "./translations/de.json";
import frTranslations from "./translations/fr.json";

export type Language = "zh" | "en" | "es" | "ja" | "de" | "fr";

interface Translations {
  [key: string]: any;
}

const translations: Record<Language, Translations> = {
  zh: zhTranslations,
  en: enTranslations,
  es: esTranslations,
  ja: jaTranslations,
  de: deTranslations,
  fr: frTranslations,
};

const defaultLang = (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "zh") as Language;
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "FunRadiusP";
const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "个人博客，记录学习、生活和思考";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com").replace(/\/+$/, "");
const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Your Name";
const defaultImage = `${siteUrl}/og-image.svg`;

// Ensure path ends with trailing slash (matching trailingSlash: true in next.config)
function withSlash(path: string): string {
  return path === "" || path.endsWith("/") ? path : `${path}/`;
}

function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let value = obj;
  for (const key of keys) {
    if (value && typeof value === "object") {
      value = value[key];
    } else {
      return path;
    }
  }
  return typeof value === "string" ? value : path;
}

function t(lang: Language, key: string): string {
  return getNestedValue(translations[lang], key);
}

export function formatTranslation(key: string, params: Record<string, string | number> = {}): string {
  let value = t(defaultLang, key);
  if (Object.keys(params).length > 0) {
    value = value.replace(/\{(\w+)\}/g, (_, paramKey) => {
      return params[paramKey]?.toString() || `{${paramKey}}`;
    });
  }
  return value;
}

export function buildMetadata(path: string, title: string, description: string, ogType: "website" | "article" = "website"): Metadata {
  const fullUrl = `${siteUrl}${withSlash(path)}`;
  const alternates: Record<string, string> = {};
  (Object.keys(translations) as Language[]).forEach((lang) => {
    alternates[lang] = fullUrl;
  });

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: {
      canonical: fullUrl,
      languages: alternates,
    },
    openGraph: {
      type: ogType,
      locale: defaultLang,
      url: fullUrl,
      siteName,
      title: `${title} | ${siteName}`,
      description,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteName}`,
      description,
      images: [defaultImage],
    },
  };
}

export interface PageMetadataOptions {
  path: string;
  titleKey: string;
  descriptionKey: string;
}

export function generatePageMetadata(options: PageMetadataOptions): Metadata {
  const { path, titleKey, descriptionKey } = options;

  const title = t(defaultLang, titleKey);
  const description = t(defaultLang, descriptionKey);

  return buildMetadata(path, title, description);
}

// Helper functions for common dynamic pages
export function getArchiveYearMetadata(year: string): Metadata {
  const title = formatTranslation("archive.year", { year });
  const description = formatTranslation("archivePage.yearPosts", { year });
  return buildMetadata(`/archive/${year}`, title, description);
}

export function getArticlesPageMetadata(page: string): Metadata {
  const title = formatTranslation("articlesPage.title");
  const description = formatTranslation("articlesPage.description");
  const fullTitle = page === "1" ? title : `${title} - ${page}`;
  return buildMetadata(`/articles/${page}`, fullTitle, description);
}

export function getCategoryMetadata(category: string): Metadata {
  const title = formatTranslation("categories.pageTitle", { category });
  const description = formatTranslation("categoriesPage.description");
  return buildMetadata(`/categories/${category}`, title, description);
}

export function getTagMetadata(tag: string): Metadata {
  const title = formatTranslation("tags.pageTitle", { tag });
  const description = formatTranslation("tagsPage.description");
  return buildMetadata(`/tags/${tag}`, title, description);
}

export function getMomentsPageMetadata(page: string): Metadata {
  const title = formatTranslation("momentsPage.pageTitle");
  const description = formatTranslation("momentsPage.description");
  const fullTitle = page === "1" ? title : `${title} - ${page}`;
  return buildMetadata(`/moments/page/${page}`, fullTitle, description);
}

export function getRootMetadata(): Metadata {
  const isEnglish = defaultLang === "en";
  const keywords = isEnglish
    ? ["blog", "personal blog", "tech blog", "learning", "life", "programming", "web development", "React", "Next.js"]
    : ["博客", "个人博客", "技术博客", "学习", "生活", "思考"];
  
  const alternates: Record<string, string> = {};
  (Object.keys(translations) as Language[]).forEach((lang) => {
    alternates[lang] = siteUrl;
  });

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: siteDescription,
    keywords,
    authors: [{ name: authorName, url: siteUrl }],
    creator: authorName,
    publisher: authorName,
    alternates: {
      canonical: siteUrl,
      languages: alternates,
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: defaultLang,
      url: `${siteUrl}/`,
      siteName,
      title: siteName,
      description: siteDescription,
      images: [
        {
          url: defaultImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description: siteDescription,
      images: [defaultImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION || "",
    },
    icons: {
      icon: "/favicon.png",
      apple: "/favicon.png",
    },
  };
}

// Helper functions for detail pages
export function getMomentDetailMetadata(slug: string, momentData: {
  time: string;
  content: string;
  photos: string[];
}): { baseMetadata: Metadata; photoAlt: string; authorName: string; siteUrl: string; defaultImage: string; photoAltOpenGraph: string } {
  const formattedTime = momentData.time;
  const title = formatTranslation("momentsPage.detailTitle", { time: formattedTime });
  const description = momentData.content.substring(0, 100);
  const photoAltOpenGraph = formatTranslation("momentsPage.photoAltOpenGraph");
  
  return {
    baseMetadata: buildMetadata(`/moments/detail/${slug}`, title, description, "article"),
    photoAlt: formatTranslation("momentsPage.photoAlt", { index: 1 }),
    photoAltOpenGraph,
    authorName,
    siteUrl,
    defaultImage,
  };
}

export function getMomentNotFoundMetadata(slug: string): Metadata {
  const title = formatTranslation("momentsPage.notFound");
  return buildMetadata(`/moments/detail/${slug}`, title, "");
}

export function getPostNotFoundMetadata(slug: string): Metadata {
  const title = formatTranslation("posts.notFound");
  return buildMetadata(`/posts/${slug}`, title, "");
}

export function getDemoNotFoundMetadata(slug: string): Metadata {
  const title = formatTranslation("demosPage.notFound");
  return buildMetadata(`/demos/${slug}`, title, "");
}

export function getDocNotFoundMetadata(collection: string, slug: string): Metadata {
  const title = formatTranslation("docsPage.notFound");
  return buildMetadata(`/docs/${collection}/${slug}`, title, "");
}

export function getDocCollectionNotFoundMetadata(collection: string): Metadata {
  const title = formatTranslation("docsPage.notFound");
  return buildMetadata(`/docs/${collection}`, title, "");
}

export function getMomentDetailMetaHelper(momentData: {
  time: string;
  content: string;
  photos: string[];
}): {
  description: string;
  siteUrl: string;
  defaultImage: string;
  photoAltOpenGraph: string;
  authorName: string;
} {
  return {
    description: momentData.content.substring(0, 100),
    siteUrl,
    defaultImage,
    photoAltOpenGraph: formatTranslation("momentsPage.photoAltOpenGraph"),
    authorName,
  };
}
