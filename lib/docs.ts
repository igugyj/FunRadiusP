import fs from "fs";
import path from "path";
import matter from "gray-matter";

const docsDirectory = path.join(process.cwd(), "content", "docs");

export interface Doc {
  id: string;
  title: string;
  description: string;
  collection: string;
  order: number;
  draft: boolean;
  content: string;
  filePath: string;
}

export interface DocCollection {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
  docs: Doc[];
}

function getDocCollectionsPath() {
  if (!fs.existsSync(docsDirectory)) {
    return [];
  }
  const dirs = fs.readdirSync(docsDirectory);
  return dirs.filter((dir) =>
    fs.statSync(path.join(docsDirectory, dir)).isDirectory(),
  );
}

function parseCollectionMeta(collectionId: string) {
  const metaPath = path.join(docsDirectory, collectionId, "meta.json");
  if (fs.existsSync(metaPath)) {
    try {
      const content = fs.readFileSync(metaPath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      console.error(`Error reading meta.json for ${collectionId}:`, error);
    }
  }
  return {
    title: collectionId,
    description: "",
    icon: "📚",
    order: 999,
    published: true,
  };
}

function getAllDocsInCollection(collectionId: string): Doc[] {
  const collectionPath = path.join(docsDirectory, collectionId);
  const docs: Doc[] = [];

  function scanDir(currentPath: string, relativePath: string = "") {
    if (!fs.existsSync(currentPath)) return;

    const items = fs.readdirSync(currentPath);
    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        scanDir(itemPath, path.join(relativePath, item));
      } else if (item.endsWith(".md")) {
        try {
          const fileContents = fs.readFileSync(itemPath, "utf8");
          const { data, content } = matter(fileContents);

          const docId = path.join(relativePath, item.replace(/\.md$/, ""));
          docs.push({
            id: docId,
            title: data.title || item.replace(/\.md$/, ""),
            description: data.description || "",
            collection: collectionId,
            order: data.order || 999,
            draft: data.draft || false,
            content: content || "",
            filePath: itemPath,
          });
        } catch (error) {
          console.error(`Error processing doc ${item}:`, error);
        }
      }
    }
  }

  scanDir(collectionPath);
  return docs
    .filter((doc) => !doc.draft)
    .sort((a, b) => a.order - b.order);
}

export function getDocCollections(): DocCollection[] {
  const collectionIds = getDocCollectionsPath();
  const collections: DocCollection[] = [];

  for (const id of collectionIds) {
    const meta = parseCollectionMeta(id);
    const docs = getAllDocsInCollection(id);

    if (docs.length > 0 && meta.published !== false) {
      collections.push({
        id,
        title: meta.title,
        description: meta.description,
        icon: meta.icon,
        order: meta.order || 999,
        published: meta.published !== false,
        docs,
      });
    }
  }

  return collections.sort((a, b) => a.order - b.order);
}

export function getDocCollection(id: string): DocCollection | null {
  const collections = getDocCollections();
  return collections.find((c) => c.id === id) || null;
}

export function getDoc(collectionId: string, docId: string): Doc | null {
  const collection = getDocCollection(collectionId);
  if (!collection) return null;

  return collection.docs.find((d) => d.id === docId) || null;
}

export function getPrevNextDocs(
  collection: DocCollection,
  currentDocId: string,
) {
  const docs = collection.docs;
  const currentIndex = docs.findIndex((d) => d.id === currentDocId);

  return {
    prev: currentIndex > 0 ? docs[currentIndex - 1] : null,
    next: currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null,
  };
}
