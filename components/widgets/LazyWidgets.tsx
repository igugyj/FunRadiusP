"use client";

import dynamic from "next/dynamic";

// 动态分包：Live2D / 粒子动画不进首屏 bundle
const Live2DWidget = dynamic(() => import("./Live2DWidget"), { ssr: false });

const Particles = dynamic(() => import("./Particles"), { ssr: false });

export default function LazyWidgets() {
  return (
    <>
      <Live2DWidget />
      {process.env.NEXT_PUBLIC_PARTICLES_ENABLED === "true" && <Particles />}
    </>
  );
}
