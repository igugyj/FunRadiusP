import { getPosts } from "../lib/posts";
import { getMoments } from "../lib/moments";
import StructuredData from "../components/ui/StructuredData";
import HomeHero from "../components/features/HomeHero";
import LatestContent from "../components/features/LatestContent";

export default function Home() {
  const posts = getPosts();
  const moments = getMoments();

  const latestPost = posts.length > 0 ? posts[0] : null;
  const latestMoment = moments.length > 0 ? moments[0] : null;

  let latest: { type: "post" | "moment"; title: string; href: string; date: string } | null = null;

  const postTime = latestPost ? new Date(latestPost.published).getTime() : 0;
  const momentTime = latestMoment ? new Date(latestMoment.time).getTime() : 0;

  if (latestPost && (!latestMoment || postTime >= momentTime)) {
    latest = {
      type: "post",
      title: latestPost.title,
      href: `/posts/${latestPost.id}`,
      date: latestPost.published,
    };
  } else if (latestMoment) {
    latest = {
      type: "moment",
      title: latestMoment.content.substring(0, 80) + (latestMoment.content.length > 80 ? "..." : ""),
      href: `/moments/detail/${latestMoment.id}`,
      date: latestMoment.time,
    };
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-96px)]">
      <StructuredData type="blog" />
      <HomeHero />
      {latest && (
        <div className="max-w-xl mx-auto mt-auto mb-8 px-4 w-full">
          <LatestContent item={latest} />
        </div>
      )}
    </div>
  );
}
