# FunRadiusP AI 上下文文档索引

## ⚠️ 重要说明：纯静态项目

**本项目是一个纯静态网站，基于 Next.js 静态导出功能构建。**

### 必须遵守的原则

1. **务必使用纯静态导出**
   - 配置了 `output: "export"`
   - 所有页面在构建时预渲染为静态 HTML
   - 不使用任何服务端渲染 (SSR)
   - 所有文件路径和网址必须使用英文，内容则不限制语言，一般使用中文

2. **不得使用任何有前后端设计的组件**
   - ❌ 不要创建 API 路由（app/api/）
   - ❌ 不要使用需要后端支持的功能
   - ❌ 不要使用 searchParams（除非配合 generateStaticParams）
   - ✅ 所有数据从 Markdown 文件读取
   - ✅ 使用 generateStaticParams 生成动态路由
   - ✅ 使用第三方服务（如 Giscus）实现评论等功能

3. **构建和部署**
   - 构建产物输出到 `output/` 目录
   - 可以部署到任何静态托管服务（Cloudflare Pages, Vercel, Netlify, GitHub Pages 等）
   - 不需要后端服务器或数据库
4. **任务完成后必须进行的操作**：
   - 检查项目是否存在冗余文件、模块、包体、目录，如果有，删除它们
   - 将本次更改写入相应的 AI 开发文档中

---

## 项目类型

这是一个静态网站，基于 Next.js 静态导出功能构建。

## 文档结构

本索引文件用于指导 AI 读取 FunRadiusP 项目的上下文信息，按优先级从高到低排列。

### 核心文档（高优先级）

| 文档路径                                               | 优先级 | 内容描述                             |
| ------------------------------------------------------ | ------ | ------------------------------------ |
| [core/project-overview.md](./core/project-overview.md) | 1      | 项目概述、技术栈、项目结构和关键功能 |
| [core/architecture.md](./core/architecture.md)         | 2      | 架构设计、数据流、路由架构和性能优化 |
| [core/quick-start.md](./core/quick-start.md)           | 3      | 快速开始指南、环境要求和基本命令     |

### 更新日志（高优先级）

| 文档路径                                   | 优先级 | 内容描述                 |
| ------------------------------------------ | ------ | ------------------------ |
| [changelog.md](./changelog.md)             | 0      | 最新更新记录和变更历史   |

### 模块文档（中优先级）

| 文档路径                                         | 优先级 | 内容描述                          |
| ------------------------------------------------ | ------ | --------------------------------- |
| [modules/posts.md](./modules/posts.md)           | 4      | 文章系统、Markdown 处理和文章管理 |
| [modules/moments.md](./modules/moments.md)       | 5      | 随笔系统、图片和内容展示          |
| [modules/docs.md](./modules/docs.md)             | 6      | 文档系统、文档集和文档阅读        |
| [modules/demos.md](./modules/demos.md)           | 7      | 演示系统、Demo 展示和交互         |
| [modules/i18n.md](./modules/i18n.md)             | 8      | 国际化系统、多语言支持            |
| [modules/categories.md](./modules/categories.md) | 9      | 分类系统、分类页面和分类路由      |
| [modules/tags.md](./modules/tags.md)             | 10     | 标签系统、标签页面和标签路由      |
| [modules/pages.md](./modules/pages.md)           | 11     | 页面管理、静态页面和动态页面      |
| [modules/components.md](./modules/components.md) | 12     | 组件系统、服务器组件和客户端组件  |

### 配置文档（低优先级）

| 文档路径                                                 | 优先级 | 内容描述                         |
| -------------------------------------------------------- | ------ | -------------------------------- |
| [config/nextjs.md](./config/nextjs.md)                   | 13     | Next.js 配置、路由配置和构建配置 |
| [config/tailwind.md](./config/tailwind.md)               | 14     | Tailwind CSS 配置和样式管理      |
| [config/markdown.md](./config/markdown.md)               | 15     | Markdown 配置和插件管理          |
| [config/markdown-engine.md](./config/markdown-engine.md) | 16     | Markdown 引擎配置和性能优化      |

### 最佳实践（参考级）

| 文档路径                                                                       | 优先级 | 内容描述                         |
| ------------------------------------------------------------------------------ | ------ | -------------------------------- |
| [best-practices/development.md](./best-practices/development.md)               | 17     | 开发最佳实践、代码规范和调试技巧 |
| [best-practices/deployment.md](./best-practices/deployment.md)                 | 18     | 部署最佳实践、CI/CD 和环境配置   |
| [best-practices/performance.md](./best-practices/performance.md)               | 19     | 性能优化最佳实践和缓存策略       |
| [best-practices/naming-conventions.md](./best-practices/naming-conventions.md) | 20     | 路径命名规范和项目结构规范       |
| [best-practices/friends-guide.md](./best-practices/friends-guide.md) | 21     | 友链页面指导文档       |

## 读取建议

1. **顺序读取**：按照优先级从高到低顺序读取文档
2. **重点关注**：核心文档包含项目的基础信息，是理解项目的关键
3. **模块文档**：按需读取，根据具体任务选择相关模块
4. **配置文档**：遇到配置问题时参考
5. **最佳实践**：作为开发和优化的参考
6. **更新日志**：查看最新变更记录，了解项目现状

## 文档更新

- 当项目结构发生变化时，更新 [core/project-overview.md](./core/project-overview.md)
- 当架构设计变更时，更新 [core/architecture.md](./core/architecture.md)
- 当模块功能新增或修改时，更新对应模块文档
- 当配置项变更时，更新配置文档
- **每次任务完成后，必须更新 [changelog.md](./changelog.md)，记录本次变更**

## 项目根目录

**根目录路径名称与项目无关**

- 项目根目录：`d:\programing\react\pblog`
- 文档目录：`d:\programing\react\pblog\docs\.ai`
- 源代码目录：`d:\programing\react\pblog\app`、`d:\programing\react\pblog\components`、`d:\programing\react\pblog\lib`
- 内容目录：`d:\programing\react\pblog\content`

## 重要文件路径

| 文件路径             | 功能描述      |
| -------------------- | ------------- |
| `app/layout.tsx`     | 根布局组件    |
| `app/page.tsx`       | 首页组件      |
| `lib/posts.ts`       | 文章数据处理  |
| `lib/moments.ts`     | 随笔数据处理  |
| `lib/docs.ts`        | 文档数据处理  |
| `lib/demos.ts`       | Demo 数据处理 |
| `lib/markdown.ts`    | Markdown 处理 |
| `lib/i18n/context.tsx` | 国际化上下文  |
| `next.config.js`     | Next.js 配置  |
| `tailwind.config.js` | Tailwind 配置 |
| `components/layout/Header.tsx` | 导航栏组件 |
| `components/widgets/Live2DWidget.tsx` | Live2D 看板娘组件 |
| `components/ui/OpacityHandler.tsx` | 组件透明度假理器 |
| `content/posts/`      | 文章内容      |
| `content/moments/`    | 随笔内容      |
| `content/docs/`       | 文档内容      |
| `content/demos/`      | Demo 内容      |
| `content/spec/`       | 特殊页面内容  |
| `scripts/build-all-redirects.js` | 重定向构建整合脚本 |
| `scripts/generate-html-redirect.js` | 重定向页面生成核心模块 |
| `scripts/build-auto-redirects.js` | 自动重定向构建脚本 |
| `scripts/build-custom-redirects.js` | 自定义重定向构建脚本 |
| `scripts/copy-post-images.js` | 生产环境复制图片脚本 |
| `scripts/copy-post-images-dev.js` | 开发环境复制图片脚本 |
| `scripts/copy-demos.js` | 生产环境复制 demo 脚本 |
| `scripts/copy-demos-dev.js` | 开发环境复制 demo 脚本 |
| `scripts/serve-static.js` | 静态网站预览服务器 |
| `redirect-config.json` | 重定向系统配置 |
| `redirect-custom.json` | 自定义重定向映射 |
| `.redirects/` | 重定向映射表（已 gitignore） |
