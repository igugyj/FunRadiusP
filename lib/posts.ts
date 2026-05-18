import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export interface Post {
  id: string;
  title: string;
  published: string;
  description: string;
  category: string;
  tags: string[];
  draft: boolean;
  image: string | undefined;
  player: any;
  content: string;
}

// 处理图片路径，将相对路径转换为绝对路径
function processImagePath(image: string | undefined, postId: string): string | undefined {
  if (!image) return undefined;

  try {
    // 如果是绝对路径（http://, https://, /），直接返回
    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("/")
    ) {
      return image;
    }

    // 对于纯静态博客，图片会在构建后复制到 output/posts 目录
    // 先尝试在 content/posts/${postId} 目录下查找（支持 assets 子目录）
    const postContentPath = path.join(
      process.cwd(),
      "content",
      "posts",
      postId,
      image,
    );
    if (fs.existsSync(postContentPath)) {
      return `/posts/${postId}/${image}`;
    }

    // 尝试在 content/posts/${postId}/assets 目录下查找
    const postAssetsPath = path.join(
      process.cwd(),
      "content",
      "posts",
      postId,
      "assets",
      image,
    );
    if (fs.existsSync(postAssetsPath)) {
      return `/posts/${postId}/assets/${image}`;
    }

    // 尝试在 public/images 目录下查找
    const publicImagePath = path.join(process.cwd(), "public", "images", image);
    if (fs.existsSync(publicImagePath)) {
      return `/images/${image}`;
    }

    // 如果都找不到，返回原始路径
    return image;
  } catch (error) {
    console.error(`Error processing image path ${image}:`, error);
    return undefined;
  }
}

export function getPosts(): Post[] {
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
          title: data.title || '',
          published: data.published || new Date().toISOString(),
          description: data.description || '',
          category: data.category || '',
          tags: data.tags || [],
          draft: data.draft || false,
          image: processImagePath(data.image, filename),
          player: data.player,
          content: content || '',
        };
      } catch (error) {
        console.error(`Error processing post ${filename}:`, error);
        return null;
      }
    })
    .filter((post): post is Post => post !== null && !post.draft)
    .sort(
      (a, b) =>
        new Date(b.published).getTime() - new Date(a.published).getTime(),
    );

  return posts;
}

export function getPostById(id: string): Post | null {
  const filePath = path.join(postsDirectory, id, "index.md");
  if (!fs.existsSync(filePath)) return null;

  try {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      id,
      title: data.title || '',
      published: data.published || new Date().toISOString(),
      description: data.description || '',
      category: data.category || '',
      tags: data.tags || [],
      draft: data.draft || false,
      image: processImagePath(data.image, id),
      player: data.player,
      content: content || '',
    };
  } catch (error) {
    console.error(`Error processing post ${id}:`, error);
    return null;
  }
}

export function getPostsByCategory(category: string): Post[] {
  const posts = getPosts();
  return posts.filter((post) => (post.category || "") === category);
}

export function getPostsByTag(tag: string): Post[] {
  const posts = getPosts();
  return posts.filter((post) => (post.tags || []).includes(tag));
}

export function getCategories(): string[] {
  const posts = getPosts();
  const categories = new Set(posts.map((post) => post.category || ""));
  return Array.from(categories);
}

export function getTags(): string[] {
  const posts = getPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    (post.tags || []).forEach((tag) => tags.add(tag));
  });
  return Array.from(tags);
}

export function getPostsGroupedByYear(): Record<string, Post[]> {
  const posts = getPosts();
  const grouped: Record<string, Post[]> = {};

  posts.forEach((post) => {
    try {
      const year = new Date(post.published || new Date()).getFullYear().toString();
      if (!grouped[year]) {
        grouped[year] = [];
      }
      grouped[year].push(post);
    } catch (error) {
      console.error(`Error processing post ${post.id} date:`, error);
    }
  });

  return grouped;
}
