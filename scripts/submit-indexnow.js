const fs = require("fs");
const path = require("path");
const https = require("https");
const crypto = require("crypto");

require("dotenv").config({ path: ".env.local" });
require("dotenv").config();

const outputDir = path.join(process.cwd(), "output");
const cachePath = path.join(process.cwd(), ".indexnow-cache.json");
const KEY = process.env.INDEXNOW_KEY || "c323c6da4b4949cf9b4f87cdcc7586e3";

function sitemapHash() {
  const f = path.join(outputDir, "sitemap.xml");
  return fs.existsSync(f) ? crypto.createHash("md5").update(fs.readFileSync(f)).digest("hex") : null;
}

function getSitemapUrls() {
  const f = path.join(outputDir, "sitemap.xml");
  if (!fs.existsSync(f)) return [];
  const locs = [];
  const re = /<loc>(.*?)<\/loc>/g;
  let m;
  while ((m = re.exec(fs.readFileSync(f, "utf8"))) !== null) locs.push(m[1]);
  return locs;
}

function readCache() {
  try { return JSON.parse(fs.readFileSync(cachePath, "utf8")); } catch { return {}; }
}

function writeCache(state) {
  fs.writeFileSync(cachePath, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2));
}

function postJson(url, body) {
  const d = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(d) },
    }, (res) => {
      let c = "";
      res.on("data", (x) => c += x);
      res.on("end", () => resolve({ status: res.statusCode, body: c }));
    });
    req.on("error", reject);
    req.write(d);
    req.end();
  });
}

async function submitIndexNow(urls, host) {
  const body = { host, key: KEY, urlList: urls };
  for (const ep of ["https://api.indexnow.org/indexnow", "https://www.bing.com/indexnow"]) {
    try {
      const r = await postJson(ep, body);
      console.log(`  IndexNow ${ep.replace(/.*\//, "")} → ${r.status}`);
      if (r.status === 200 || r.status === 202) return true;
    } catch (e) { console.log(`  IndexNow error: ${e.message}`); }
  }
  return false;
}

async function submitToBing(urls) {
  let i = 0;
  let size = 50;
  while (i < urls.length) {
    const batch = urls.slice(i, i + size);
    try {
      const r = await postJson(
        `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${KEY}`,
        { siteUrl: "https://pg25-lsae.eu.org", urlList: batch },
      );
      console.log(`  Bing API (${batch.length} URLs, pos ${i + 1}) → ${r.status}`);
      if (r.status === 200) { i += size; size = 50; }
      else if (r.status === 400 && r.body) {
        const e = JSON.parse(r.body);
        const m = e.Message || "";
        const q = m.match(/Quota remaining for today: (\d+)/);
        if (q && parseInt(q[1]) > 0) { size = parseInt(q[1]); }
        else { console.log(`  → ${m}`); break; }
      } else break;
    } catch (e) { console.log(`  Bing API error: ${e.message}`); break; }
  }
  return i > 0 ? i : false;
}

async function main() {
  const hash = sitemapHash();
  if (!hash) { console.log("No sitemap."); return; }

  const cache = readCache();
  if (cache.sitemapHash === hash && !cache.pending) {
    console.log("Sitemap unchanged, no pending URLs. Skipping.");
    return;
  }

  const keyFile = path.join(outputDir, `${KEY}.txt`);
  if (!fs.existsSync(keyFile) && !process.env.INDEXNOW_KEY) { console.warn(`Key file missing: ${keyFile}`); return; }

  const host = (process.env.NEXT_PUBLIC_SITE_URL || "https://yourdomain.com")
    .replace(/^https?:\/\//, "").replace(/\/+$/, "");
  const urls = getSitemapUrls();
  if (urls.length === 0) { console.log("No URLs."); return; }

  const startFrom = cache.pending || 0;
  const remaining = urls.slice(startFrom);
  console.log(`${remaining.length} pending URLs (starting at ${startFrom + 1}/${urls.length})`);

  // IndexNow: must submit ALL URLs at once
  if (startFrom === 0 && await submitIndexNow(urls, host)) {
    console.log("✓ All URLs accepted by IndexNow");
    writeCache({ sitemapHash: hash });
    return;
  }

  // Bing API: submit batch by batch
  console.log("Using Bing API...");
  const count = await submitToBing(remaining);
  if (count) {
    const done = startFrom + count;
    if (done >= urls.length) {
      console.log(`✓ All ${done} URLs submitted to Bing`);
      writeCache({ sitemapHash: hash });
    } else {
      console.log(`→ ${done}/${urls.length} submitted, resume tomorrow`);
      writeCache({ sitemapHash: hash, pending: done });
    }
  } else {
    console.warn("Bing API rejected.");
    if (startFrom > 0) writeCache({ sitemapHash: hash, pending: startFrom });
  }
}

main().catch((e) => console.warn(`Error: ${e.message}`));
