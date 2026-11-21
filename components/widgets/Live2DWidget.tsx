"use client";

import { useEffect } from "react";

if (typeof window !== "undefined") {
  if (!window.live2dInitialized) {
    window.live2dInitialized = false;
  }
  if (!window.live2dInstance) {
    window.live2dInstance = null;
  }
}

// 空闲时再加载，避免抢占首屏主线程
function loadWhenIdle(fn: () => void) {
  const idle = (window as any).requestIdleCallback as
    | ((cb: () => void, opts?: { timeout: number }) => void)
    | undefined;
  if (idle) {
    idle(fn, { timeout: 3000 });
  } else {
    setTimeout(fn, 3000);
  }
}

// 确保是绝对路径
function ensureAbsolutePath(path: string): string {
  if (path.startsWith("/") || path.startsWith("http")) {
    return path;
  }
  return "/" + path;
}

// 读取模型列表；未配置、解析失败或为空数组时返回空列表（此时不加载看板娘）
function getModelPaths(): string[] {
  const modelsJson = process.env.NEXT_PUBLIC_LIVE2D_MODELS;
  if (!modelsJson) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(modelsJson);
    if (!Array.isArray(parsed)) {
      console.error("NEXT_PUBLIC_LIVE2D_MODELS 应为字符串数组");
      return [];
    }
    return parsed.filter(
      (path): path is string =>
        typeof path === "string" && path.trim().length > 0,
    );
  } catch (error) {
    console.error("Error parsing LIVE2D_MODELS:", error);
    return [];
  }
}

export default function Live2DWidget() {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.live2dInitialized) {
      return;
    }
    window.live2dInitialized = true;

    // 触屏设备不加载看板娘，避免移动端性能损耗
    if (window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    // 模型列表为空则不加载看板娘
    const modelPaths = getModelPaths();
    if (modelPaths.length === 0) {
      return;
    }

    loadWhenIdle(() => {
      const dockedPosition =
        process.env.NEXT_PUBLIC_LIVE2D_DOCKED_POSITION || "right";
      const position: [number, number] = process.env.NEXT_PUBLIC_LIVE2D_POSITION
        ? JSON.parse(process.env.NEXT_PUBLIC_LIVE2D_POSITION)
        : [0, 60];
      const scale = process.env.NEXT_PUBLIC_LIVE2D_SCALE
        ? parseFloat(process.env.NEXT_PUBLIC_LIVE2D_SCALE)
        : 0.08;
      const stageHeight = process.env.NEXT_PUBLIC_LIVE2D_STAGE_HEIGHT
        ? parseInt(process.env.NEXT_PUBLIC_LIVE2D_STAGE_HEIGHT)
        : 450;

      const models = modelPaths.map((path) => ({
        path: ensureAbsolutePath(path),
        position,
        scale,
        stageStyle: {
          height: stageHeight,
        },
      }));

      if (typeof window.OML2D === "undefined") {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/oh-my-live2d@0.19.3";
        script.async = true;

        script.onload = () => {
          if (window.OML2D) {
            window.live2dInstance = window.OML2D.loadOml2d({
              dockedPosition: dockedPosition as "left" | "right",
              models,
            });
          }
        };
        document.body.appendChild(script);
      } else {
        window.live2dInstance = window.OML2D.loadOml2d({
          dockedPosition: dockedPosition as "left" | "right",
          models,
        });
      }
    });
  }, []);

  return null;
}
