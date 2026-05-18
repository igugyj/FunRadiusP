import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDocCollection, getDocCollections } from "../../../lib/docs";
import CollectionPageClient from "../../../components/features/CollectionPageClient";
import { buildMetadata, getDocCollectionNotFoundMetadata } from "../../../lib/i18n/metadata";

interface CollectionPageProps {
  params: Promise<{ collection: string }>;
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const { collection } = await params;
  const docCollection = getDocCollection(collection);

  if (!docCollection) {
    return getDocCollectionNotFoundMetadata(collection);
  }

  return buildMetadata(`/docs/${collection}`, docCollection.title, docCollection.description);
}

export async function generateStaticParams() {
  const collections = getDocCollections();
  return collections.map((collection) => ({
    collection: collection.id,
  }));
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { collection } = await params;
  const docCollection = getDocCollection(collection);
  if (!docCollection) notFound();

  return (
    <CollectionPageClient
      collection={collection}
      docCollection={docCollection}
    />
  );
}