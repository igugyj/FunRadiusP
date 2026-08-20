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

    loadWhenIdle(() => {
      const dockedPosition =
        process.env.NEXT_PUBLIC_LIVE2D_DOCKED_POSITION || "right";
      const position = process.env.NEXT_PUBLIC_LIVE2D_POSITION
        ? JSON.parse(process.env.NEXT_PUBLIC_LIVE2D_POSITION)
        : [0, 60];
      const scale = process.env.NEXT_PUBLIC_LIVE2D_SCALE
        ? parseFloat(process.env.NEXT_PUBLIC_LIVE2D_SCALE)
        : 0.08;
      const stageHeight = process.env.NEXT_PUBLIC_LIVE2D_STAGE_HEIGHT
        ? parseInt(process.env.NEXT_PUBLIC_LIVE2D_STAGE_HEIGHT)
        : 450;

      const models: Array<{
        path: string;
        position: [number, number];
        scale: number;
        stageStyle: { height: number };
      }> = [];
      // 确保是绝对路径
      const ensureAbsolutePath = (path: string): string => {
        if (path.startsWith("/") || path.startsWith("http")) {
          return path;
        }
        return "/" + path;
      };

      try {
        const modelsJson = process.env.NEXT_PUBLIC_LIVE2D_MODELS;
        if (modelsJson) {
          const modelPaths: string[] = JSON.parse(modelsJson);
          modelPaths.forEach((path) => {
            models.push({
              path: ensureAbsolutePath(path),
              position,
              scale,
              stageStyle: {
                height: stageHeight,
              },
            });
          });
        }
      } catch (error) {
        console.error("Error parsing LIVE2D_MODELS:", error);
      }

      if (models.length === 0) {
        // 默认只加载 1 个模型，其余通过 NEXT_PUBLIC_LIVE2D_MODELS 显式配置
        models.push({
          path: ensureAbsolutePath("/live2d/chuixue_3/chuixue_3.model3.json"),
          position,
          scale,
          stageStyle: {
            height: stageHeight,
          },
        });
      }

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
