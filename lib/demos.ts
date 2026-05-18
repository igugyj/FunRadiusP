import fs from "fs";
import path from "path";

const demosDirectory = path.join(process.cwd(), "content", "demos");

export interface Demo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
  published: boolean;
  hasDemoHtml: boolean;
  hasShowHtml: boolean;
  assets: string[];
}

export function getDemos(): Demo[] {
  if (!fs.existsSync(demosDirectory)) {
    return [];
  }

  const dirnames = fs.readdirSync(demosDirectory);
  const demos = dirnames
    .map((dirname) => {
      const demoDir = path.join(demosDirectory, dirname);
      if (!fs.statSync(demoDir).isDirectory()) return null;

      const metaPath = path.join(demoDir, "meta.json");
      const demoHtmlPath = path.join(demoDir, "demo.html");
      const indexHtmlPath = path.join(demoDir, "index.html");
      const showHtmlPath = path.join(demoDir, "show.html");

      let meta: any = {};
      if (fs.existsSync(metaPath)) {
        try {
          const metaContent = fs.readFileSync(metaPath, "utf8");
          meta = JSON.parse(metaContent);
        } catch (error) {
          console.error(`Error reading meta.json for demo ${dirname}:`, error);
        }
      }

      const assets: string[] = [];
      const assetsDir = path.join(demoDir, "assets");
      if (fs.existsSync(assetsDir) && fs.statSync(assetsDir).isDirectory()) {
        const readAssets = (dir: string, relativePath: string = "") => {
          const files = fs.readdirSync(dir);
          files.forEach((file) => {
            const filePath = path.join(dir, file);
            const relative = path.join(relativePath, file);
            if (fs.statSync(filePath).isDirectory()) {
              readAssets(filePath, relative);
            } else {
              assets.push(relative);
            }
          });
        };
        readAssets(assetsDir);
      }

      return {
        id: dirname,
        title: meta.title || dirname,
        description: meta.description || "",
        tags: meta.tags || [],
        author: meta.author || "",
        date: meta.date || new Date().toISOString(),
        published: meta.published !== false,
        hasDemoHtml:
          fs.existsSync(demoHtmlPath) || fs.existsSync(indexHtmlPath),
        hasShowHtml: fs.existsSync(showHtmlPath),
        assets,
      };
    })
    .filter((demo): demo is Demo => demo !== null && demo.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return demos;
}

export function getDemoById(id: string): Demo | null {
  const demos = getDemos();
  return demos.find((demo) => demo.id === id) || null;
}

export function getDemoHtmlContent(
  id: string,
  type: "demo" | "show" = "demo",
): string | null {
  const demoDir = path.join(demosDirectory, id);
  const htmlPath = path.join(
    demoDir,
    type === "show"
      ? "show.html"
      : fs.existsSync(path.join(demoDir, "demo.html"))
        ? "demo.html"
        : "index.html",
  );

  if (!fs.existsSync(htmlPath)) return null;

  try {
    return fs.readFileSync(htmlPath, "utf8");
  } catch (error) {
    console.error(`Error reading HTML for demo ${id}:`, error);
    return null;
  }
}
