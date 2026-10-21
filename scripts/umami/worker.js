// Cloudflare Worker：Umami 浏览量只读代理
// 部署：`wrangler deploy` 或直接在 CF Dashboard 粘贴本文件（免费版 10 万次/天）
// 请求：GET /?path=/posts/xxx/  → {"views": 123}
//       GET /                    → {"views": 123}（全站总量）
//
// 环境变量（可选，不填用下面的默认值）：
//   WEBSITE_ID  Umami Website ID
//   SHARE_ID    Umami 分享链接 ID

const CLOUD = "https://cloud.umami.is";
const DEFAULT_WEBSITE_ID = "65b451cc-ec3a-4f05-ac2f-6de0346fa635";
const DEFAULT_SHARE_ID = "CDyghiUc0dKFC3kk";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

// 分享 token 与地区前缀的缓存（同一 isolate 内复用，避免每次请求都去换 token）
const TOKEN_TTL = 5 * 60 * 1000;
let shareCache = { at: 0, shareId: "", base: "", info: null };

// 分享页会 307 到 /analytics/{region}/share/{id}，据此推断 API 前缀（带地区段）
async function resolveBase(shareId) {
  try {
    const res = await fetch(`${CLOUD}/share/${shareId}`, {
      redirect: "manual",
    });
    const location = res.headers.get("location") || "";
    const matched = location.match(/\/analytics\/([^/]+)\//);
    if (matched) return `${CLOUD}/analytics/${matched[1]}/api`;
  } catch {
    // 走默认地区
  }
  return `${CLOUD}/analytics/us/api`;
}

async function getShare(env) {
  const shareId = env.SHARE_ID || DEFAULT_SHARE_ID;
  if (
    shareCache.info &&
    shareCache.shareId === shareId &&
    Date.now() - shareCache.at < TOKEN_TTL
  ) {
    return shareCache;
  }

  const base = await resolveBase(shareId);
  const res = await fetch(`${base}/share/${shareId}`, {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(`share ${res.status}`);

  const info = await res.json();
  if (!info?.token) throw new Error("share token missing");

  shareCache = { at: Date.now(), shareId, base, info };
  return shareCache;
}

// pageviews 可能是数字，也可能是 {value: n}
function readPageviews(payload) {
  const raw = payload?.pageviews;
  if (typeof raw === "number") return raw;
  if (typeof raw?.value === "number") return raw.value;
  return null;
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=180",
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }
    if (request.method !== "GET") {
      return json({ views: 0, error: "method not allowed" }, 405);
    }

    // 浏览量结果缓存到 CF 边缘，进一步压低请求数（同一 URL 每 3 分钟只回源一次）
    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
      const url = new URL(request.url);
      const path = (url.searchParams.get("path") || "").trim();

      const websiteId = env.WEBSITE_ID || DEFAULT_WEBSITE_ID;
      const { base, info } = await getShare(env);

      // 官方写法：PostgREST 风格的 eq. 前缀；不传 path 即全站总量
      const query = new URLSearchParams({
        startAt: "0",
        endAt: String(Date.now()),
      });
      if (path) query.set("path", path.startsWith("eq.") ? path : `eq.${path}`);

      const statsRes = await fetch(`${base}/websites/${websiteId}/stats?${query}`, {
        headers: {
          accept: "application/json",
          "x-umami-share-token": info.token,
          "x-umami-share-context": "1",
        },
      });
      if (!statsRes.ok) throw new Error(`stats ${statsRes.status}`);

      const views = readPageviews(await statsRes.json());
      if (views === null) throw new Error("bad stats payload");

      const response = json({ views });
      ctx.waitUntil(cache.put(request, response.clone()));
      return response;
    } catch (error) {
      // 失败不缓存，客户端会隐藏该段
      return json({ views: 0, error: String(error?.message || error) }, 502);
    }
  },
};
