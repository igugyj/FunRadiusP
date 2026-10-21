// Cloudflare Worker：Umami 只读查询 + 数据上报转发
// 部署：`wrangler deploy` 或直接在 CF Dashboard 粘贴本文件（免费版 10 万次/天）
// 请求：GET  /?path=/posts/xxx/ → {"views": 123}
//       GET  /                  → {"views": 123}（全站总量）
//       POST /api/send          → 转发数据上报到 gateway.umami.is
//                                  （前端把 data-host-url 指到这里，绕开跟踪保护拦截）
//
// 配置（必填，源码内不保存任何真实 ID，统一在
//       Cloudflare Dashboard → Workers → 你的 Worker → Settings → Variables 设置）：
//   WEBSITE_ID      Umami Website ID            例：your-website-id
//   SHARE_ID        Umami 分享链接 ID            例：your-share-id
//   ALLOWED_ORIGINS 允许跨域的站点来源，逗号分隔  例：https://your-domain.example
//   任一未设置 → 真实请求一律返回 503（响应里列出缺失项）
//
// 本地开发（Origin 为 localhost/127.0.0.1）：CORS 照常放行，但只回示例数据 —
//   GET  → {"views":128,"demo":true}（不查 Umami）
//   POST → {"demo":true} 应答后丢弃（不转发 gateway）
//   不需要任何配置，也不做真实操作，避免开发流量污染统计 / 消耗配额。

const CLOUD = "https://cloud.umami.is";
const GATEWAY = "https://gateway.umami.is";

// 本地示例模式的来源（内置放行，不参与真实统计）
const DEV_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
];

const REQUIRED_ENV = ["WEBSITE_ID", "SHARE_ID", "ALLOWED_ORIGINS"];
const ENV_HINT =
  "Set them in Cloudflare Dashboard → Worker → Settings → Variables";

// 缺失的必填配置项（空串 / 全空白都算缺失）
function missingEnv(env) {
  return REQUIRED_ENV.filter((key) => !(env?.[key] || "").trim());
}

function normalizeOrigin(value) {
  return (value || "").trim().replace(/\/+$/, "");
}

// 跨域来源白名单：CORS 放行与上报 Origin 校验共用同一份名单
function allowedOrigins(env) {
  const fromEnv = String(env?.ALLOWED_ORIGINS || "")
    .split(",")
    .map((item) => normalizeOrigin(item))
    .filter(Boolean);
  return new Set([...DEV_ORIGINS, ...fromEnv]);
}

// 按请求来源生成 CORS 头：白名单内回显具体 Origin，名单外不给 ACAO（浏览器拦截）
function corsHeaders(request, env) {
  const origin = normalizeOrigin(request.headers.get("origin"));
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
  if (origin && allowedOrigins(env).has(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }
  return headers;
}

// 无 Origin（curl、服务端脚本）放行，跨站滥用由 payload.website 校验兜底
function isOriginAllowed(request, env) {
  const origin = normalizeOrigin(request.headers.get("origin"));
  return !origin || allowedOrigins(env).has(origin);
}

// 本地开发来源：CORS 放行，但只回示例数据，不触发任何真实 Umami 操作
const DEMO_VIEWS = 128;

function isDevOrigin(origin) {
  try {
    const host = new URL(origin).hostname;
    return host === "localhost" || host === "127.0.0.1" || host === "::1";
  } catch {
    return false;
  }
}

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
  const shareId = (env.SHARE_ID || "").trim();
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

function json(body, status, cors, noCache = false) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...cors,
      "Content-Type": "application/json",
      // 只缓存成功结果（示例数据、配置错误与上游错误都不缓存）
      "Cache-Control":
        status === 200 && !noCache ? "public, max-age=180" : "no-store",
    },
  });
}

// 必填配置缺失：拒绝服务并明确指出缺哪几项（curl 直接可见，便于排查）
function configError(missing, cors) {
  return json(
    { error: `missing env: ${missing.join(", ")}`, hint: ENV_HINT },
    503,
    cors,
  );
}

// 把统计上报转发到官方 gateway：让浏览器看到的是向 worker 域名发请求，
// 从而绕开 Firefox/广告拦截器对 gateway.umami.is 的跟踪器封锁
async function proxySend(request, env, cors) {
  const websiteId = (env.WEBSITE_ID || "").trim();

  // Origin 校验：非白名单来源直接拒绝（CORS 只能约束浏览器，这里补上服务端侧检查）
  if (!isOriginAllowed(request, env)) {
    return json({ error: "forbidden origin" }, 403, cors);
  }

  let raw;
  try {
    raw = await request.text();
  } catch {
    return json({ error: "bad body" }, 400, cors);
  }

  // 防滥用：只转发打到本站的上报，避免 worker 被当成公共中继给别人的站灌数据
  try {
    const parsed = JSON.parse(raw);
    const target = parsed?.payload?.website;
    if (target !== undefined && target !== websiteId) {
      return json({ error: "website mismatch" }, 403, cors);
    }
  } catch {
    return json({ error: "invalid json" }, 400, cors);
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
        ...cors,
        "Content-Type": res.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return json({ error: String(error?.message || error) }, 502, cors);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cors = corsHeaders(request, env);
    const origin = normalizeOrigin(request.headers.get("origin"));
    const devMode = isDevOrigin(origin);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // 数据上报转发（必须排在边缘缓存之前，POST 不进缓存）
    if (
      request.method === "POST" &&
      url.pathname.replace(/\/+$/, "") === "/api/send"
    ) {
      // 本地开发：应答成功但不转发，统计不入库（无需配置）
      if (devMode) return json({ demo: true }, 200, cors, true);

      const missing = missingEnv(env);
      if (missing.length) return configError(missing, cors);
      return proxySend(request, env, cors);
    }

    if (request.method !== "GET") {
      return json({ views: 0, error: "method not allowed" }, 405, cors);
    }

    // 本地开发：直接回示例数据，不查 Umami、不进边缘缓存（无需配置）
    if (devMode) {
      return json({ views: DEMO_VIEWS, demo: true }, 200, cors, true);
    }

    // 真实查询前校验必填配置（必须排在边缘缓存之前，避免缓存 503）
    const missing = missingEnv(env);
    if (missing.length) return configError(missing, cors);

    // 浏览量结果缓存到 CF 边缘（同一 URL 每 3 分钟只回源一次）。
    // 缓存 key 带上 Origin：不同来源拿到的 ACAO 不同，必须分开存
    const cache = caches.default;
    const cacheUrl = new URL(request.url);
    if (origin) cacheUrl.searchParams.set("__origin", origin);
    const cacheKey = new Request(cacheUrl.toString(), { method: "GET" });

    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    try {
      const path = (url.searchParams.get("path") || "").trim();

      const websiteId = (env.WEBSITE_ID || "").trim();
      const { base, info } = await getShare(env);

      // 官方写法：PostgREST 风格的 eq. 前缀；不传 path 即全站总量
      const query = new URLSearchParams({
        startAt: "0",
        endAt: String(Date.now()),
      });
      if (path) query.set("path", path.startsWith("eq.") ? path : `eq.${path}`);

      const statsRes = await fetch(
        `${base}/websites/${websiteId}/stats?${query}`,
        {
          headers: {
            accept: "application/json",
            "x-umami-share-token": info.token,
            "x-umami-share-context": "1",
          },
        },
      );
      if (!statsRes.ok) throw new Error(`stats ${statsRes.status}`);

      const views = readPageviews(await statsRes.json());
      if (views === null) throw new Error("bad stats payload");

      const response = json({ views }, 200, cors);
      ctx.waitUntil(cache.put(cacheKey, response.clone()));
      return response;
    } catch (error) {
      // 失败不缓存，客户端会隐藏该段
      return json({ views: 0, error: String(error?.message || error) }, 502, cors);
    }
  },
};
