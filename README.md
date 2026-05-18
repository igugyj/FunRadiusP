<p align="center">
  <img src="public/FunRadiusP.svg" alt="FunRadiusP" width="320" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT" />
  <img src="https://img.shields.io/badge/static_export-✓-brightgreen" alt="Static Export" />
</p>

<p align="center">
  <a href="https://pg25-lsae.eu.org/">Live Demo</a> ·
  <a href="https://pg25-lsae.eu.org/docs/deployment/">部署教程</a>
</p>

---

## 简介

FunRadiusP 是一个基于 **Next.js 16** + **TypeScript** + **Tailwind CSS** 的静态博客系统。全站导出为静态 HTML，可部署到任何静态托管平台。

### 特性

- ⚡ **完全静态导出** — 零运行时，部署到任何静态托管（Cloudflare Pages / GitHub Pages / Vercel）
- 🌐 **国际化** — 内置 6 语言支持（中/英/日/韩/法/德），客户端切换
- 📝 **Markdown 内容** — 文章、文档、随笔、Demo 均以 Markdown 管理
- 🎨 **主题定制** — 可配置主色调、背景、组件透明度、季节性粒子特效
- 🗂️ **内容即文件** — `content/` 下创建文件夹和 Markdown 即可发布
- 💬 **Giscus 评论** — 基于 GitHub Discussions
- 🤖 **Live2D 看板娘** — 可选的交互式看板娘
- 📡 **SEO 友好** — 自动生成 RSS、Sitemap，支持 IndexNow 推送

## 快速开始

```bash
git clone https://github.com/igugyj/FunRadiusP.git
cd FunRadiusP
npm install
cp .env.example .env.local
npm run dev
```

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 → localhost:3000 |
| `npm run build` | 构建静态网站到 `output/` |
| `npm run deploy` | 构建 + 提交 URL 到 IndexNow |
| `npm run lint` | 代码检查 |

## 内容管理

内容存放在 `content/` 目录下，按类型分类：

| 目录 | 内容 |
|------|------|
| `content/posts/` | 博客文章 |
| `content/docs/` | 文档笔记 |
| `content/moments/` | 随笔（图文） |
| `content/demos/` | 交互式 Demo |
| `content/spec/` | 静态页面（关于/项目等） |

每个目录下直接创建文件夹和 Markdown 文件即可发布内容。本项目的 `content/` 使用了 Git 子模块实现内容与代码分离，但你可以直接使用普通文件夹，无需任何子模块配置。

> 详细内容格式说明见[部署教程](https://pg25-lsae.eu.org/docs/deployment/)。

## 配置

复制 `.env.example` 为 `.env.local` 并按需修改。核心配置项：

| 变量 | 说明 |
|------|------|
| `NEXT_PUBLIC_SITE_URL` | 网站 URL（必填） |
| `NEXT_PUBLIC_DEFAULT_LANGUAGE` | 默认语言：zh / en |
| `NEXT_PUBLIC_DEFAULT_PRIMARY_COLOR` | 主题色 |
| `NEXT_PUBLIC_PARTICLES_ENABLED` | 粒子特效开关 |
| `INDEXNOW_KEY` | IndexNow API Key（可选） |

完整配置项见 [`.env.example`](.env.example)。

## 部署

构建产物在 `output/` 目录，可直接部署到：

- **Cloudflare Pages** — 推荐。设置构建命令为 `npm run deploy`，输出目录为 `output`
- **GitHub Pages** — 使用 GitHub Actions
- **Vercel** — 配置输出目录为 `output`
- **Netlify** — 配置发布目录为 `output`

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Next.js 16 (App Router) |
| 语言 | TypeScript 5 |
| 样式 | Tailwind CSS 4 |
| 内容 | Markdown + Frontmatter (unified/remark/rehype) |
| 评论 | Giscus |
| 特效 | natural-falling-js, Live2D |
| 构建 | 全静态导出 |

## 致谢

感谢所有开源项目和贡献者。完整致谢列表见 [CREDITS.md](CREDITS.md)。

## License

[MIT](LICENSE)
