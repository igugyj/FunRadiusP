// Cloudflare Worker：Umami 只读查询 + 数据上报转发
// 部署：`wrangler deploy` 或直接在 CF Dashboard 粘贴本文件（免费版 10 万次/天）
// 请求：GET  /?path=/posts/xxx/ → {"views": 123}
//       GET  /                  → {"views": 123}（全站总量）
//       POST /api/send          → 转发数据上报到 gateway.umami.is
//                                  （前端把 data-host-url 指到这里，绕开跟踪保护拦截）
//
// 环境变量（可选，不填用下面的默认值）：
//   WEBSITE_ID  Umami Website ID
//   SHARE_ID    Umami 分享链接 ID

const CLOUD = "https://cloud.umami.is";
const GATEWAY = "https://gateway.umami.is";
const DEFAULT_WEBSITE_ID = "65b451cc-ec3a-4f05-ac2f-6de0346fa635";
const DEFAULT_SHARE_ID = "CDyghiUc0dKFC3kk";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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
      // 只缓存成功结果，错误响应不缓存
      ...(status === 200
        ? { "Cache-Control": "public, max-age=180" }
        : { "Cache-Control": "no-store" }),
    },
  });
}

// 把统计上报转发到官方 gateway：让浏览器看到的是向 worker 域名发请求，
// 从而绕开 Firefox/广告拦截器对 gateway.umami.is 的跟踪器封锁
async function proxySend(request, env) {
  const websiteId = env.WEBSITE_ID || DEFAULT_WEBSITE_ID;

  let raw;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "bad body" }, 400);
  }

  // 防滥用：只转发打到本站的上报，避免 worker 被当成公共中继给别人的站灌数据
  try {
    const parsed = JSON.parse(raw);
    const target = parsed?.payload?.website;
    if (target !== undefined && target !== websiteId) {
      return json({ error: "website mismatch" }, 403);
    }
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  try {
    const headers = {
      "content-type": "application/json",
      accept: "application/json",
      "user-agent": request.headers.get("user-agent") || "",
    };
    // umami 脚本用该头做上报缓存衔接，透传
    const umamiCache = request.headers.get("x-umami-cache");
    if (umamiCache) headers["x-umami-cache"] = umamiCache;

    const res = await fetch(`${GATEWAY}/api/send`, {
      method: "POST",
      headers,
      body: raw,
    });

    const text = await res.text();
    return new Response(text, {
      status: res.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": res.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return json({ error: String(error?.message || error) }, 502);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // 数据上报转发（必须排在边缘缓存之前，POST 不进缓存）
    if (
      request.method === "POST" &&
      url.pathname.replace(/\/+$/, "") === "/api/send"
    ) {
      return proxySend(request, env);
    }

    if (request.method !== "GET") {
      return json({ views: 0, error: "method not allowed" }, 405);
    }

    // 浏览量结果缓存到 CF 边缘，进一步压低请求数（同一 URL 每 3 分钟只回源一次）
    const cache = caches.default;
    const cached = await cache.match(request);
    if (cached) return cached;

    try {
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
