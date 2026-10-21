// Umami 浏览量统计的唯一请求入口（客户端使用）
// 配置来自 NEXT_PUBLIC_UMAMI_* 环境变量；Website ID 或凭据缺失时整体禁用

const CLOUD_ORIGIN = "https://cloud.umami.is";

export interface UmamiConfig {
  websiteId: string;
  /** 后台生成的 API Key（可选；权限不足失败时自动回落分享链接） */
  apiKey?: string;
  /** 公开分享链接 ID（免费版 Hobby 计划的官方只读通道） */
  shareId?: string;
}

/**
 * 读取环境变量。缺少 Website ID，或 API Key 与 Share ID 都为空时返回 null，
 * 调用方据此禁用浏览量模块（不发起任何请求）。
 */
export function getUmamiConfig(): UmamiConfig | null {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID?.trim() || "";
  const apiKey = process.env.NEXT_PUBLIC_UMAMI_API_KEY?.trim() || "";
  const shareId = process.env.NEXT_PUBLIC_UMAMI_SHARE_ID?.trim() || "";

  if (!websiteId) return null;
  if (!apiKey && !shareId) return null;

  return {
    websiteId,
    apiKey: apiKey || undefined,
    shareId: shareId || undefined,
  };
}

interface ShareInfo {
  token: string;
  shareId: string;
  shareType: number;
  websiteId: string;
  parameters: Record<string, unknown>;
}

// 分享页会 307 到 /analytics/{region}/share/{id}，据此推断分享 API 前缀（带地区段）
const shareBaseCache = new Map<string, string>();
async function resolveShareBase(shareId: string): Promise<string> {
  const cached = shareBaseCache.get(shareId);
  if (cached) return cached;

  let base = `${CLOUD_ORIGIN}/analytics/us/api`; // 默认地区兜底
  try {
    const res = await fetch(`${CLOUD_ORIGIN}/share/${shareId}`);
    const matched = res.url.match(/\/analytics\/([^/]+)\//);
    if (matched) base = `${CLOUD_ORIGIN}/analytics/${matched[1]}/api`;
  } catch {
    // 网络异常时用默认地区
  }

  shareBaseCache.set(shareId, base);
  return base;
}

/** 一条可用的请求通道：请求地址前缀 + 请求头 */
interface Channel {
  baseUrl: string;
  headers: Record<string, string>;
}

/** 按优先级返回所有可用通道（API Key 优先，分享链接兜底） */
async function resolveChannels(config: UmamiConfig): Promise<Channel[]> {
  const { apiKey, shareId } = config;
  const channels: Channel[] = [];

  if (apiKey) {
    // 注意：NEXT_PUBLIC_ 值会打进前端 bundle，务必使用只读/低权限 Key
    channels.push({
      baseUrl: `${CLOUD_ORIGIN}/api`,
      headers: {
        accept: "application/json",
        authorization: `Bearer ${apiKey}`,
      },
    });
  }

  if (shareId) {
    try {
      const baseUrl = await resolveShareBase(shareId);
      const res = await fetch(`${baseUrl}/share/${shareId}`, {
        headers: { accept: "application/json" },
      });
      if (res.ok) {
        const info = (await res.json()) as ShareInfo;
        if (info?.token) {
          channels.push({
            baseUrl,
            headers: {
              accept: "application/json",
              "x-umami-share-token": info.token,
              // 官方客户端传的固定值；服务端只校验其存在
              "x-umami-share-context": "1",
            },
          });
        }
      }
    } catch {
      // 分享通道获取失败则跳过
    }
  }

  return channels;
}

// 兼容 pageviews 为数字或 {value:{...}} 两种响应结构
function readPageviews(payload: any): number | null {
  const raw = payload?.pageviews;
  if (typeof raw === "number") return raw;
  if (typeof raw?.value === "number") return raw.value;
  return null;
}

/**
 * 查询浏览量。path 传文章路径即查该页，不传即全站总量。
 * 所有通道都失败或响应无法解析时返回 null（调用方隐藏该段，而不是显示 0）。
 */
export async function fetchPageviews(path?: string): Promise<number | null> {
  const config = getUmamiConfig();
  if (!config) return null;

  const channels = await resolveChannels(config);
  if (channels.length === 0) return null;

  // path 过滤：官方写法是 PostgREST 风格的 eq. 前缀，失败再回退平铺写法
  const pathVariants = path ? [`eq.${path}`, path] : [null];

  for (const channel of channels) {
    for (const candidate of pathVariants) {
      const query = new URLSearchParams({
        startAt: "0",
        endAt: String(Date.now()),
      });
      if (candidate) query.set("path", candidate);

      try {
        const res = await fetch(
          `${channel.baseUrl}/websites/${config.websiteId}/stats?${query}`,
          { headers: channel.headers },
        );
        if (!res.ok) continue;

        const value = readPageviews(await res.json());
        if (value !== null) return value;
      } catch {
        // 该组合失败，继续尝试下一种
      }
    }
  }

  return null;
}
