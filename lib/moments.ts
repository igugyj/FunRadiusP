import fs from "fs";
import path from "path";
import matter from "gray-matter";

const momentsDirectory = path.join(process.cwd(), "content", "moments");

export interface Moment {
  id: string;
  time: string;
  content: string;
  photos: string[];
  draft: boolean;
}

// 处理图片路径
function processPhotoPath(photo: string, momentId: string): string {
  try {
    if (!photo) return photo;

    if (
      photo.startsWith("http://") ||
      photo.startsWith("https://") ||
      photo.startsWith("/")
    ) {
      return photo;
    }

    const momentContentPath = path.join(
      process.cwd(),
      "content",
      "moments",
      momentId,
      photo,
    );
    if (fs.existsSync(momentContentPath)) {
      return `/moments/${momentId}/${photo}`;
    }

    const momentAssetsPath = path.join(
      process.cwd(),
      "content",
      "moments",
      momentId,
      "assets",
      photo,
    );
    if (fs.existsSync(momentAssetsPath)) {
      return `/moments/${momentId}/assets/${photo}`;
    }

    return photo;
  } catch (error) {
    console.error(`Error processing photo path ${photo}:`, error);
    return photo;
  }
}

export function getMoments(): Moment[] {
  if (!fs.existsSync(momentsDirectory)) {
    return [];
  }

  try {
    const filenames = fs.readdirSync(momentsDirectory);
    const moments = filenames
      .map((filename) => {
        const filePath = path.join(momentsDirectory, filename, "index.md");
        if (!fs.existsSync(filePath)) return null;

        try {
          const fileContents = fs.readFileSync(filePath, "utf8");
          const { data, content } = matter(fileContents);

          const rawPhotos = data.photos || [];
          const photos = Array.isArray(rawPhotos)
            ? rawPhotos.map((photo) => processPhotoPath(photo, filename))
            : [];

          return {
            id: filename,
            time: data.time || new Date().toISOString(),
            content: content || "",
            photos,
            draft: data.draft || false,
          };
        } catch (error) {
          console.error(`Error processing moment ${filename}:`, error);
          return null;
        }
      })
      .filter((moment): moment is Moment => moment !== null && !moment.draft)
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return moments;
  } catch (error) {
    console.error("Error reading moments:", error);
    return [];
  }
}

export function getMomentById(id: string): Moment | null {
  try {
    const filePath = path.join(momentsDirectory, id, "index.md");
    if (!fs.existsSync(filePath)) return null;

    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    const rawPhotos = data.photos || [];
    const photos = Array.isArray(rawPhotos)
      ? rawPhotos.map((photo) => processPhotoPath(photo, id))
      : [];

    return {
      id,
      time: data.time || new Date().toISOString(),
      content: content || "",
      photos,
      draft: data.draft || false,
    };
  } catch (error) {
    console.error(`Error processing moment ${id}:`, error);
    return null;
  }
}
