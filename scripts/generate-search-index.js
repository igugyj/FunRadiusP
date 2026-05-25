const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

const root = process.cwd();

function getPosts() {
  const dir = path.join(root, "content", "posts");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .map((id) => {
      const fp = path.join(dir, id, "index.md");
      if (!fs.existsSync(fp)) return null;
      try {
        const { data } = matter(fs.readFileSync(fp, "utf8"));
        if (data.draft) return null;
        return {
          t: "p",
          a: (data.title || "").trim(),
          s: [(data.title || ""), (data.description || ""), ...(data.tags || []), (data.category || "")].filter(Boolean).join(" ").trim(),
          u: "/posts/" + id + "/",
        };
      } catch { return null; }
    })
    .filter(Boolean);
}

function getDocs() {
  const dir = path.join(root, "content", "docs");
  if (!fs.existsSync(dir)) return [];
  const collections = fs.readdirSync(dir).filter((d) => fs.statSync(path.join(dir, d)).isDirectory());
  const items = [];
  for (const cid of collections) {
    const metaPath = path.join(dir, cid, "meta.json");
    let meta = {};
    if (fs.existsSync(metaPath)) {
      try { meta = JSON.parse(fs.readFileSync(metaPath, "utf8")); } catch {}
    }
    if (meta.published === false) continue;

    function scan(p, prefix) {
      if (!fs.existsSync(p)) return;
      for (const f of fs.readdirSync(p)) {
        const fp = path.join(p, f);
        const st = fs.statSync(fp);
        if (st.isDirectory()) { scan(fp, path.join(prefix, f)); }
        else if (f.endsWith(".md")) {
          try {
            const { data } = matter(fs.readFileSync(fp, "utf8"));
            if (data.draft) continue;
            const id = path.join(prefix, f.replace(/\.md$/, ""));
            items.push({
              t: "d",
              a: (data.title || f.replace(/\.md$/, "")).trim(),
              s: [(data.title || ""), (data.description || "")].filter(Boolean).join(" ").trim(),
              u: "/docs/" + cid + "/" + id.replace(/\\/g, "/") + "/",
            });
          } catch {}
        }
      }
    }
    scan(path.join(dir, cid), "");
  }
  return items;
}

function getMoments() {
  const dir = path.join(root, "content", "moments");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .map((id) => {
      const fp = path.join(dir, id, "index.md");
      if (!fs.existsSync(fp)) return null;
      try {
        const { data, content } = matter(fs.readFileSync(fp, "utf8"));
        if (data.draft) return null;
        const snippet = (content || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").slice(0, 100).trim();
        return {
          t: "m",
          a: (data.time || id).trim(),
          s: snippet,
          u: "/moments/detail/" + id + "/",
        };
      } catch { return null; }
    })
    .filter(Boolean);
}

function getDemos() {
  const dir = path.join(root, "content", "demos");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .map((id) => {
      const fp = path.join(dir, id, "meta.json");
      if (!fs.existsSync(fp)) return null;
      try {
        const meta = JSON.parse(fs.readFileSync(fp, "utf8"));
        if (meta.published === false) return null;
        return {
          t: "e",
          a: (meta.title || id).trim(),
          s: [(meta.title || ""), (meta.description || ""), ...(meta.tags || [])].filter(Boolean).join(" ").trim(),
          u: "/demos/" + id + "/",
        };
      } catch { return null; }
    })
    .filter(Boolean);
}

const lines = [
  ...getPosts(),
  ...getDocs(),
  ...getMoments(),
  ...getDemos(),
].map((item) => JSON.stringify(item)).join("\n") + "\n";

const outPath = path.join(root, "public", "search-index.ndjson");
fs.writeFileSync(outPath, lines, "utf8");
console.log("Search index written: " + outPath + " (" + lines.length + " bytes, " + lines.split("\n").length + " entries)");
