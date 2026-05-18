import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostById, getPosts, Post } from "../../../lib/posts";
import { formatDate, getPrevNextPosts } from "../../../lib/utils";
import { markdownToHtml } from "../../../lib/markdown";
import StructuredData from "../../../components/ui/StructuredData";
import MusicPlayer from "../../../components/features/MusicPlayer";
import PostPageClient from "../../../components/features/PostPageClient";
import { buildMetadata, getPostNotFoundMetadata } from "../../../lib/i18n/metadata";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostById(slug);

  if (!post) {
    return getPostNotFoundMetadata(slug);
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com").replace(/\/+$/, "");
  const image = post.image
    ? (post.image.startsWith("http://") || post.image.startsWith("https://")
        ? post.image
        : `${siteUrl}${post.image}`)
    : `${siteUrl}/favicon.png`;

  const baseMetadata = buildMetadata(`/posts/${slug}`, post.title, post.description, "article");
  return {
    ...baseMetadata,
    keywords: post.tags,
    openGraph: {
      ...baseMetadata.openGraph,
      images: [{ url: image, alt: post.title }],
      publishedTime: post.published,
      modifiedTime: post.published,
      authors: [process.env.NEXT_PUBLIC_AUTHOR_NAME || "Your Name"],
    } as any,
    twitter: {
      ...baseMetadata.twitter,
      images: [image],
    },
  };
}

export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.id,
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostById(slug);
  if (!post) notFound();

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com").replace(/\/+$/, "");
  const posts: Post[] = getPosts();
  const { prev, next } = getPrevNextPosts(posts, post.id);
  const htmlContent = await markdownToHtml(post.content, { type: 'post', id: post.id });

  const isAutoHideEnabled = process.env.NEXT_PUBLIC_HEADER_AUTO_HIDE_ENABLED !== "false";

  const formattedPost = {
    ...post,
    published: formatDate(post.published),
  };

  const formattedPrev = prev
    ? {
        ...prev,
        published: formatDate(prev.published),
      }
    : null;

  const formattedNext = next
    ? {
        ...next,
        published: formatDate(next.published),
      }
    : null;

  return (
    <>
      <StructuredData type="breadcrumb" data={{
        items: [
          { name: "Home", url: siteUrl },
          { name: "Articles", url: `${siteUrl}/articles` },
          { name: post.title, url: `${siteUrl}/posts/${slug}` },
        ],
      }} />
      <StructuredData type="article" data={post} />
      {post.player && <MusicPlayer player={post.player} />}
      <PostPageClient
        post={formattedPost}
        prev={formattedPrev}
        next={formattedNext}
        htmlContent={htmlContent}
        isAutoHideEnabled={isAutoHideEnabled}
      />
    </>
  );
}
