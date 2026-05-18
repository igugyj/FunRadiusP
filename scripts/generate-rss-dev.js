const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const RSS = require("rss");

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const postsDirectory = path.join(process.cwd(), "content", "posts");
const outputDirectory = path.join(process.cwd(), "public");

function normalizeUrl(url) {
  url = url.replace(/([^:])(\/+)/g, "$1/");
  return url.replace(/\/+$/, "");
}

const siteUrl = normalizeUrl(
  process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com",
);
const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "FunRadiusP";
const siteDescription =
  process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "个人博客，记录学习、生活和思考";
const authorName = process.env.NEXT_PUBLIC_AUTHOR_NAME || "Your Name";

function processImagePath(image, postId) {
  if (!image) return undefined;

  try {
    if (image.startsWith("http://") || image.startsWith("https://")) {
      return normalizeUrl(image);
    }
    if (image.startsWith("/")) {
      return normalizeUrl(`${siteUrl}${image}`);
    }

    const postContentPath = path.join(postsDirectory, postId, image);
    if (fs.existsSync(postContentPath)) {
      return normalizeUrl(`${siteUrl}/posts/${postId}/${image}`);
    }

    const postAssetsPath = path.join(postsDirectory, postId, "assets", image);
    if (fs.existsSync(postAssetsPath)) {
      return normalizeUrl(`${siteUrl}/posts/${postId}/assets/${image}`);
    }

    const publicImagePath = path.join(process.cwd(), "public", "images", image);
    if (fs.existsSync(publicImagePath)) {
      return normalizeUrl(`${siteUrl}/images/${image}`);
    }

    return normalizeUrl(`${siteUrl}${image}`);
  } catch (error) {
    console.error(`Error processing image path ${image}:`, error);
    return undefined;
  }
}

function getPosts() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDirectory);
  const posts = filenames
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename, "index.md");
      if (!fs.existsSync(filePath)) return null;

      try {
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data, content } = matter(fileContents);

        return {
          id: filename,
          title: data.title || "",
          published: data.published || new Date().toISOString(),
          description: data.description || "",
          category: data.category || "",
          tags: data.tags || [],
          draft: data.draft || false,
          image: processImagePath(data.image, filename),
          content: content || "",
        };
      } catch (error) {
        console.error(`Error processing post ${filename}:`, error);
        return null;
      }
    })
    .filter((post) => post !== null && !post.draft)
    .sort(
      (a, b) =>
        new Date(b.published).getTime() - new Date(a.published).getTime(),
    );

  return posts;
}

function generateRSS() {
  const posts = getPosts();

  const feed = new RSS({
    title: siteName,
    description: siteDescription,
    feed_url: `${siteUrl}/rss.xml`,
    site_url: siteUrl,
    image_url: `${siteUrl}/favicon.png`,
    managingEditor: authorName,
    webMaster: authorName,
    copyright: `${new Date().getFullYear()} ${authorName}`,
    language: "zh-CN",
    pubDate: new Date().toUTCString(),
    ttl: 60,
  });

  posts.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description,
      url: `${siteUrl}/posts/${post.id}`,
      guid: `${siteUrl}/posts/${post.id}`,
      categories: [post.category, ...(post.tags || [])],
      author: authorName,
      date: new Date(post.published).toUTCString(),
      enclosure: post.image
        ? {
            url: post.image,
          }
        : undefined,
    });
  });

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true });
  }

  const rssPath = path.join(outputDirectory, "rss.xml");
  fs.writeFileSync(rssPath, feed.xml({ indent: true }));

  console.log(`RSS feed generated at ${rssPath}`);
}

generateRSS();
