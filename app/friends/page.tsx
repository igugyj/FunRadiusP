import type { Metadata } from "next";
import FriendsPageClient from "@/components/features/FriendsPageClient";
import { generatePageMetadata } from "@/lib/i18n/metadata";

export function generateMetadata(): Metadata {
  return generatePageMetadata({
    path: "/friends",
    titleKey: "friends.pageTitle",
    descriptionKey: "friends.description",
  });
}

export default function FriendsPage() {
  return <FriendsPageClient />;
}
