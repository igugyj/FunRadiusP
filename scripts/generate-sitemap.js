const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const outputDir = path.join(process.cwd(), "output");
const postsDir = path.join(process.cwd(), "content", "posts");
const docsDir = path.join(process.cwd(), "content", "docs");

function normalizeUrl(url) {
  url = url.replace(/([^:])(\/+)/g, "$1/");
  return url.replace(/\/+$/, "");
}

const siteUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",
);

function url(pathname) {
  return `${siteUrl}${pathname}`;
}

function getPosts() {
  if (!fs.existsSync(postsDir)) return [];
  return fs.readdirSync(postsDir)
    .map((id) => {
      const fp = path.join(postsDir, id, "index.md");
      if (!fs.existsSync(fp)) return null;
      try {
        const { data } = matter(fs.readFileSync(fp, "utf8"));
        return { id, published: data.published, draft: data.draft };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter((p) => !p.draft);
}

function getDocData() {
  if (!fs.existsSync(docsDir)) return { collections: [], docs: [] };
  const collections = [];
  const docs = [];
  const dirs = fs.readdirSync(docsDir).filter((d) =>
    fs.statSync(path.join(docsDir, d)).isDirectory()
  );
  for (const id of dirs) {
    const metaPath = path.join(docsDir, id, "meta.json");
    let meta = { published: true };
    if (fs.existsSync(metaPath)) {
      try { meta = { ...meta, ...JSON.parse(fs.readFileSync(metaPath, "utf8")) }; } catch {}
    }
    if (meta.published === false) continue;
    collections.push(id);
    const items = fs.readdirSync(path.join(docsDir, id)).filter((f) => f.endsWith(".md"));
    for (const item of items) {
      try {
        const { data } = matter(fs.readFileSync(path.join(docsDir, id, item), "utf8"));
        if (data.draft) continue;
        docs.push({ collection: id, slug: item.replace(/\.md$/, "") });
      } catch {}
    }
  }
  return { collections, docs };
}

function generateSitemap() {
  const urls = [];

  urls.push({ loc: url(""), priority: 1.0, changefreq: "daily" });

  const staticPages = [
    "/about", "/information", "/journey",
    "/articles", "/archive", "/categories", "/tags", "/docs", "/friends",
  ];
  for (const p of staticPages) {
    urls.push({ loc: url(p), priority: 0.8, changefreq: "weekly" });
  }

  const posts = getPosts();
  for (const post of posts) {
    urls.push({
      loc: url(`/posts/${post.id}`),
      lastmod: post.published,
      priority: 0.7,
      changefreq: "monthly",
    });
  }

  const cats = new Set(posts.map((p) => {
    const fp = path.join(postsDir, p.id, "index.md");
    try {
      const { data } = matter(fs.readFileSync(fp, "utf8"));
      return data.category;
    } catch { return null; }
  }).filter(Boolean));
  for (const c of cats) {
    urls.push({ loc: url(`/categories/${c}`), priority: 0.5, changefreq: "weekly" });
  }

  const tags = new Set();
  for (const p of posts) {
    const fp = path.join(postsDir, p.id, "index.md");
    try {
      const { data } = matter(fs.readFileSync(fp, "utf8"));
      if (data.tags) data.tags.forEach((t) => tags.add(t));
    } catch {}
  }
  for (const t of tags) {
    urls.push({ loc: url(`/tags/${t}`), priority: 0.5, changefreq: "weekly" });
  }

  const years = new Set(posts.map((p) => {
    try { return new Date(p.published).getFullYear().toString(); } catch { return null; }
  }).filter(Boolean));
  for (const y of years) {
    urls.push({ loc: url(`/archive/${y}`), priority: 0.5, changefreq: "yearly" });
  }

  const pageSize = 5;
  const totalPages = Math.ceil(posts.length / pageSize);
  for (let i = 2; i <= totalPages; i++) {
    urls.push({ loc: url(`/articles/${i}`), priority: 0.6, changefreq: "weekly" });
  }

  const { collections, docs } = getDocData();
  for (const c of collections) {
    urls.push({ loc: url(`/docs/${c}`), priority: 0.7, changefreq: "weekly" });
  }
  for (const d of docs) {
    urls.push({ loc: url(`/docs/${d.collection}/${d.slug}`), priority: 0.6, changefreq: "monthly" });
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${u.loc}/</loc>
    ${u.lastmod ? `    <lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ""}
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outPath = path.join(outputDir, "sitemap.xml");
  fs.writeFileSync(outPath, sitemap);
  console.log(`Sitemap generated: ${outPath} (${urls.length} URLs)`);
}

generateSitemap();
