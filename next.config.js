/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: "export", // 开启纯静态导出
  trailingSlash: true, // 路径统一带/，避免路由异常
  distDir: "output",
};

module.exports = nextConfig;
