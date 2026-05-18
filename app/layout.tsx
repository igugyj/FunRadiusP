import type { Metadata } from "next";
import "./globals.css";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import BackToTop from "../components/ui/BackToTop";
import Live2DWidget from "../components/widgets/Live2DWidget";
import AnchorHandler from "../components/ui/AnchorHandler";
import CodeBlockCopy from "../components/ui/CodeBlockCopy";
import Particles from "../components/widgets/Particles";
import StructuredData from "../components/ui/StructuredData";
import OpacityHandler from "../components/ui/OpacityHandler";
import { ImageViewerProvider } from "../components/ui/ImageViewer";
import { LanguageProvider } from "../lib/i18n";
import { getRootMetadata } from "../lib/i18n/metadata";

const defaultLang = process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || "zh";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com";

export const metadata: Metadata = getRootMetadata();

export const links = [
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css",
    integrity:
      "sha384-wcIxkf4k558AjM3Yz3BBFQUbk/zgIYC2R0QpeeYb+TwlBVMrlgLqwRjRtGZiK7ww",
    crossorigin: "anonymous",
  },
  {
    rel: "alternate",
    type: "application/rss+xml",
    title: "RSS Feed",
    href: "/rss.xml",
  },
  {
    rel: "alternate",
    hrefLang: "zh",
    href: siteUrl,
  },
  {
    rel: "alternate",
    hrefLang: "en",
    href: siteUrl,
  },
  {
    rel: "alternate",
    hrefLang: "es",
    href: siteUrl,
  },
  {
    rel: "alternate",
    hrefLang: "ja",
    href: siteUrl,
  },
  {
    rel: "alternate",
    hrefLang: "de",
    href: siteUrl,
  },
  {
    rel: "alternate",
    hrefLang: "fr",
    href: siteUrl,
  },
  {
    rel: "alternate",
    hrefLang: "x-default",
    href: siteUrl,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={defaultLang === "en" ? "en" : defaultLang}>
      <body>
        <LanguageProvider>
          <ImageViewerProvider>
            <OpacityHandler />
            <StructuredData type="website" />
            {process.env.NEXT_PUBLIC_PARTICLES_ENABLED === "true" && (
              <Particles />
            )}
            <Header />
            <main
              className="container mx-auto px-4 py-8 relative z-10"
              style={{ paddingTop: "96px" }}
            >
              {children}
            </main>
            <Footer />
            <BackToTop />
            <Live2DWidget />
            <AnchorHandler />
            <CodeBlockCopy />
          </ImageViewerProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
