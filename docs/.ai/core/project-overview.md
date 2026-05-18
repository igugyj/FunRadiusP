# FunRadiusP 项目概述

## 项目基本信息

### 项目名称

FunRadiusP - 基于 Next.js 的静态博客系统

### 项目位置

- **根目录**: `d:\programing\react\pblog`
- **类型**: 静态博客网站
- **技术栈**: Next.js 16.2.2 + TypeScript + Tailwind CSS

### 项目类型说明

**本项目是一个纯静态网站，具有以下特点：

1. **静态生成 (SSG)
   - 使用 Next.js 的静态生成功能
   - 所有页面在构建时预渲染为静态 HTML
   - 使用 `generateStaticParams` 生成动态路由的静态页面

2. **无服务端依赖**
   - 不需要数据库或后端服务器
   - 所有数据从 Markdown 文件读取
   - 可以部署到任何静态托管服务（Vercel, Netlify, GitHub Pages 等）

3. **构建输出**
   - 运行 `npm run build` 生成静态文件
   - 输出目录为 `output/`（配置了 `distDir: 'output'）
   - 所有资源（CSS, JS, 图片）都被打包为静态文件
   - 使用 `postbuild` 脚本复制文章图片到 `output/posts/` 目录

4. **动态功能处理**
   - 不使用 API 路由（已删除）
   - 评论系统使用第三方服务（Giscus）
   - 分页使用静态生成的动态路由（`/articles/[page]`）
   - 所有图片使用静态路径处理

## 技术栈

| 技术             | 版本               | 用途                       |
| ---------------- | ------------------ | -------------------------- |
| Next.js          | 16.2.2 (Turbopack) | 前端框架，使用 App Router  |
| TypeScript       | 最新               | 类型安全的 JavaScript 超集 |
| Tailwind CSS     | 最新               | 实用优先的 CSS 框架       |
| unified          | 最新               | Markdown 处理工具链       |
| remark-parse     | 最新               | Markdown 解析              |
| remark-rehype    | 最新               | Markdown 到 HTML 转换      |
| rehype-stringify | 最新               | HTML 字符串化              |
| rehype-highlight | 最新               | 代码高亮                  |

## 项目结构

```
pblog/
├── app/                                    # Next.js App Router 页面
│   ├── about/                             # 关于页面
│   ├── archive/                           # 文章归档页面
│   ├── articles/                        # 文章列表页面
│   ├── categories/                      # 分类页面
│   ├── demos/                        # Demo 列表页面
│   ├── docs/                        # 文档列表页面
│   ├── information/                   # 信息页面
│   ├── journey/                   # 历程页面
│   ├── moments/                    # 随笔页面
│   ├── posts/                     # 文章详情页面
│   ├── projects/                  # 项目页面
│   ├── tags/                      # 标签页面
│   ├── globals.css                   # 全局样式
│   ├── layout.tsx                  # 根布局
│   └── page.tsx                    # 首页
├── components/                          # React 组件
│   ├── features/                # 业务功能组件（带 Client 后缀）
│   ├── i18n/                  # 国际化相关组件
│   ├── layout/                # 布局相关组件
│   ├── ui/                     # UI 基础组件
│   └── widgets/              # 小部件组件
├── content/                          # 内容文件
│   ├── posts/                 # 文章内容
│   ├── moments/              # 随笔内容
│   ├── docs/                 # 文档内容
│   ├── demos/               # Demo 内容
│   └── spec/               # 特殊页面内容
├── lib/                               # 工具函数
│   ├── i18n/                  # 国际化工具
│   ├── markdown.ts            # Markdown 处理函数
│   ├── posts.ts              # 文章数据获取
│   ├── moments.ts            # 随笔数据获取
│   ├── docs.ts                # 文档数据获取
│   ├── demos.ts               # Demo 数据获取
│   └── utils.ts              # 通用工具函数
├── scripts/                         # 构建脚本
│   ├── copy-post-images.js      # 生产环境复制图片
│   ├── copy-post-images-dev.js  # 开发环境复制图片
│   ├── copy-demos.js        # 生产环境复制 demo
│   ├── copy-demos-dev.js    # 开发环境复制 demo
│   └── serve-static.js     # 静态网站预览服务器
└── docs/                           # 文档
    └── .ai/                   # AI 上下文信息
```

## 关键功能

### 1. 文章系统

- 支持 Markdown 格式文章
- 文章分类和标签
- 文章归档（按年份）
- 文章详情页和列表页
- 支持多种 Callout 类型
- 支持音乐播放器配置

### 2. 随笔系统

- 支持 Markdown 格式随笔
- 支持多图片展示
- 自动图片查看器
- 内容折叠效果

### 3. 文档系统

- 文档集管理
- 文档阅读页面
- 目录导航
- 支持相对路径图片
- 国际化支持

### 4. Demo 系统

- Demo 列表页面
- Demo 详情页面
- iframe 嵌入展示
- 支持独立访问
- 支持 meta.json 配置

### 5. 分类系统

- 分类详情页面
- 按分类筛选文章

### 6. 标签系统

- 标签云页面
- 标签详情页面
- 按标签筛选文章

### 7. 国际化系统

- 支持 6 种语言：中文、英文、西班牙语、日语、德语、法语
- 语言切换组件
- 翻译文件管理
- 浏览器语言检测
- localStorage 保存用户偏好

### 8. 技术特性

- 完全静态生成
- 响应式设计
- 代码高亮
- 评论系统（Giscus）
- 回到顶部按钮
- 目录导航
- 四季飘落特效（使用 natural-falling-effect 库）
  - 支持花瓣、落叶、下雨、下雪
  - 可自动根据季节切换
  - 环境变量配置支持
- Live2D 看板娘
  - 基于 oh-my-live2d 框架
  - 支持多模型切换
  - 模型配置在环境变量中
- 主题颜色自定义
- 导航栏优化
  - 默认隐藏，鼠标移动到顶部 100px 范围内时下拉显示
  - 桌面端菜单布局：首页、文章、关于直接显示，其余在"更多"下拉菜单
  - 移动端汉堡菜单
  - 自动隐藏可配置
- 锚点跳转优化
  - 全局 `AnchorHandler` 组件处理
  - CSS `scroll-padding-top` 原生支持
- 代码块复制功能
- 访客问候语功能
- 音乐播放器
- 图片查看器
- 主题切换（亮色/暗色）

## 重要配置

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  output: "export", // 开启纯静态导出
  distDir: "output",
};
module.exports = nextConfig;
```

### 环境变量

复制 `.env.example` 为 `.env.local` 并进行配置：

- **网站基础配置**：`NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_SITE_NAME` 等
- **Giscus 配置**：`NEXT_PUBLIC_GISCUS_REPO` 等
- **Live2D 配置**：`NEXT_PUBLIC_LIVE2D_MODELS` 等
- **粒子特效配置**：`NEXT_PUBLIC_PARTICLES_ENABLED` 等
- **主题颜色配置**：`NEXT_PUBLIC_DEFAULT_PRIMARY_COLOR`
- **导航栏配置**：`NEXT_PUBLIC_HEADER_AUTO_HIDE_ENABLED`
- **默认语言配置**：`NEXT_PUBLIC_DEFAULT_LANGUAGE`

### 路由处理

- **参数类型**: `params` 和 `searchParams` 是 Promise 类型，需要使用 `await` 解包
- **静态路由**: 使用 `generateStaticParams` 生成静态路由
- **文件编码**: 所有文件使用 UTF-8 编码读取

## 开发命令

| 命令             | 功能                     |
| ---------------- | ------------------------ |
| `npm run dev`     | 启动开发服务器           |
| `npm run build`   | 构建生产版本             |
| `npm start`       | 预览静态网站（生产构建） |

## 重要说明

### 纯静态项目要求

**本项目是一个纯静态网站，务必使用纯静态导出，不得使用任何有前后端设计的组件。**

具体要求：
- ❌ 不创建 API 路由（app/api/）
- ❌ 不使用需要后端支持的功能
- ❌ 不使用 searchParams（除非配合 generateStaticParams）
- ✅ 所有数据从 Markdown 文件读取
- ✅ 使用 generateStaticParams 生成动态路由
- ✅ 使用第三方服务（如 Giscus）实现评论等功能

### 图片处理

- **开发环境**：图片自动复制到 `public/posts/`、`public/moments/`、`public/docs/`
- **生产环境**：图片自动复制到 `output/posts/` 等目录
- 支持文章/随笔/文档文件夹下的图片和 assets 子目录下的图片

### 静态网站预览

构建完成后，可以使用 `npm start` 启动一个简单的 HTTP 服务器来预览静态网站。

## 已知问题

暂无

## 开发规范

### 文档管理规范

1. **README 文件使用规范**
   - 不要把项目详情写在 README 里面
   - 不要把更新的内容写到 README
   - README 应该只包含项目的基本介绍、安装和使用说明

2. **AI 开发文档更新规范**
   - 任务完成之后，都要对 AI 开发文档进行相应的变更
   - 确保文档与代码同步更新
   - 请根据当前任务优先级确定上下文信息

3. **上下文信息获取规范**
   - 在开始任务前，先读取 `docs/.ai/index.md` 获取上下文信息
   - 按照文档优先级从高到低顺序读取相关文档
   - 根据当前任务的具体需求选择合适的文档进行参考

### 代码开发规范

- 遵循项目的现有代码风格和架构模式
- 使用 TypeScript 进行类型检查
- 使用 Tailwind CSS 进行样式开发
- 遵循 Next.js App Router 的最佳实践
- 组件按功能分类到相应目录
- 业务功能组件使用 Client 后缀并放在 `components/features/` 目录

