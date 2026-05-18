# FunRadiusP 快速开始指南

## 环境要求

### 系统要求
- **操作系统**: Windows, macOS, Linux
- **Node.js**: 18.17 或更高版本
- **包管理器**: npm, yarn, 或 pnpm

### 硬件要求
- **CPU**: 至少 2 核心
- **内存**: 至少 4GB
- **磁盘空间**: 至少 500MB

## 安装步骤

### 1. 克隆项目

```bash
# 使用 git 克隆项目
git clone <repository-url> FunRadiusP
cd FunRadiusP
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 使用 yarn
yarn install

# 使用 pnpm
pnpm install
```

### 3. 配置环境

**创建 .env.local 文件**（如果需要）：

```env
# 默认语言（可选，默认 en）
NEXT_PUBLIC_DEFAULT_LANGUAGE=zh

# 评论系统配置
GISCUS_REPO=your-repo
GISCUS_REPO_ID=your-repo-id
GISCUS_CATEGORY=your-category
GISCUS_CATEGORY_ID=your-category-id

# 其他环境变量
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看博客。

## 基本命令

| 命令 | 功能 | 说明 |
|------|------|------|
| `npm run dev` | 启动开发服务器 | 开发模式，支持热更新 |
| `npm run build` | 构建生产版本 | 生成静态文件 |
| `npm start` | 启动生产服务器 | 预览生产版本 |
| `npx tsc --noEmit` | 类型检查 | 检查 TypeScript 类型错误 |
| `npm run lint` | 代码检查 | 检查代码规范 |

## 项目结构概览

### 主要目录

| 目录 | 功能 | 重要性 |
|------|------|--------|
| `app/` | Next.js 页面 | 核心 |
| `components/` | React 组件 | 核心 |
| `content/` | 内容文件 | 核心 |
| `lib/` | 工具函数 | 核心 |
| `docs/` | 文档 | 参考 |

### 重要文件

| 文件 | 功能 | 位置 |
|------|------|------|
| 根布局 | 网站整体布局 | `app/layout.tsx` |
| 首页 | 网站首页 | `app/page.tsx` |
| 文章处理 | 文章数据获取 | `lib/posts.ts` |
| 随笔处理 | 随笔数据获取 | `lib/moments.ts` |
| 文档处理 | 文档数据获取 | `lib/docs.ts` |
| Demo处理 | Demo数据获取 | `lib/demos.ts` |
| 国际化 | 语言管理 | `lib/i18n/` |
| Markdown 处理 | Markdown 渲染 | `lib/markdown.ts` |
| 配置文件 | Next.js 配置 | `next.config.js` |

## 开发流程

### 1. 添加新文章

1. **创建文章文件夹**：在 `content/posts/` 下创建新的文件夹，例如 `content/posts/my-new-post/`

2. **创建 index.md 文件**：在文件夹中创建 `index.md` 文件，包含以下 frontmatter：

```markdown
---
title: 文章标题
published: 2025-04-02
description: 文章描述
category: technology
tags: [Next.js, React, TypeScript]
draft: false
---

文章内容...
```

3. **编写文章内容**：使用 Markdown 语法编写文章内容

### 2. 添加随笔

1. **创建随笔文件夹**：在 `content/moments/` 下创建新的文件夹，例如 `content/moments/my-moment/`

2. **创建 index.md 文件**：

```markdown
---
time: 2024-01-15T14:30:00Z
draft: false
photos:
  - photo1.jpg
  - assets/photo2.png
---

今天天气真好！
```

3. **添加图片**：将图片放在随笔文件夹或 assets 子目录中

### 3. 添加文档

1. **创建文档集文件夹**：在 `content/docs/` 下创建新的文件夹，例如 `content/docs/my-collection/`

2. **创建 meta.json 文件**：

```json
{
  "title": "文档集标题",
  "description": "文档集描述",
  "icon": "📚",
  "order": 1,
  "published": true
}
```

3. **添加文档文件**：在文档集文件夹中添加 Markdown 文件

### 4. 添加 Demo

1. **创建 Demo 文件夹**：在 `content/demos/` 下创建新的文件夹，例如 `content/demos/my-demo/`

2. **创建 meta.json 文件**：

```json
{
  "title": "Demo 标题",
  "description": "Demo 描述",
  "tags": ["标签1", "标签2"],
  "author": "作者",
  "date": "2024-01-15",
  "published": true
}
```

3. **创建 demo.html 文件**：

```html
<!DOCTYPE html>
<html>
<head>
  <title>Demo</title>
</head>
<body>
  <h1>Hello Demo!</h1>
</body>
</html>
```

### 5. 添加分类

在文章的 frontmatter 中指定 `category` 字段，使用英文分类名称：

```yaml
category: technology
```

### 6. 添加标签

在文章的 frontmatter 中指定 `tags` 字段，使用英文标签名称：

```yaml
tags: [Next.js, React, TypeScript]
```

### 7. 配置国际化

1. **在翻译文件中添加内容**：编辑 `lib/i18n/translations/[lang].json`

2. **使用 t() 函数**：在组件中使用 `useLanguage` Hook

```typescript
'use client';
import { useLanguage } from '@/lib/i18n';

function MyComponent() {
  const { t } = useLanguage();
  return <div>{t('common.home')}</div>;
}
```

### 8. 修改特殊页面

特殊页面的内容位于 `content/spec/` 目录：

| 页面 | 目录 | 说明 |
|------|------|------|
| 关于页面 | `content/spec/about/` | 个人信息和社交媒体 |
| 信息页面 | `content/spec/information/` | 站点信息和资源 |
| 历程页面 | `content/spec/journey/` | 个人历程和时间线 |
| 项目页面 | `content/spec/projects/` | 项目列表和链接 |

## 调试技巧

### 1. 查看开发服务器日志

开发服务器的日志会显示在终端中，包括：
- 请求日志
- 错误信息
- 编译警告

### 2. 检查类型错误

```bash
npx tsc --noEmit
```

### 3. 检查构建错误

```bash
npm run build
```

### 4. 清除缓存

如果遇到奇怪的问题，可以尝试清除缓存：

```bash
# 清除 Next.js 缓存
rm -rf .next

# 清除 npm 缓存
npm cache clean --force
```

## 常见问题

### 1. 页面显示 404

- 检查路由是否正确
- 确认 `generateStaticParams` 是否正确生成静态参数
- 检查文件路径是否正确

### 2. 中文显示乱码

- 确保文件使用 UTF-8 编码
- 检查 `fs.readFileSync` 是否指定了 `'utf8'` 编码

### 3. 样式不生效

- 清除 `.next` 缓存文件夹
- 重新启动开发服务器
- 检查 Tailwind 配置是否正确

### 4. Markdown 不渲染

- 确认 `markdownToHtml` 函数被正确调用
- 检查 Markdown 语法是否正确
- 查看控制台是否有错误信息

### 5. 国际化不工作

- 确认 `LanguageProvider` 包裹了整个应用
- 检查翻译文件是否正确
- 确认使用的是客户端组件

### 6. 图片不显示

- 检查图片路径是否正确
- 确认图片文件存在
- 查看构建后图片是否被正确复制

## 下一步

- [模块文档](../modules/)：了解各个模块的详细实现
- [配置文档](../config/)：了解项目配置选项
- [最佳实践](../best-practices/)：了解开发和部署最佳实践

