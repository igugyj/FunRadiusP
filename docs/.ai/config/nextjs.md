# Next.js 配置文档

## 配置概述

Next.js 配置文件位于项目根目录的 `next.config.js`，用于配置 Next.js 的行为和功能。

## 核心配置

### 基本配置

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
module.exports = nextConfig;
```

### 关键配置项

| 配置项 | 值 | 说明 |
|-------|-----|------|
| `trailingSlash` | `true` | 确保路由以斜杠结尾，提高静态导出的兼容性 |
| `images.unoptimized` | `true` | 禁用图片优化，适合静态导出场景 |
| `output` | 已移除 | 移除了 `'export'` 配置，避免静态渲染错误 |

## 路由配置

### 路由类型

| 路由类型 | 实现方式 | 示例路径 |
|---------|---------|---------|
| 静态路由 | 文件夹结构 | `/about/` |
| 动态路由 | `[slug]` 文件夹 | `/posts/[slug]/` |
| 嵌套路由 | 嵌套文件夹 | `/categories/[slug]/` |
| 并行路由 | `@folder` 文件夹 | 用于布局和内容分离 |

### 路由参数处理

在 Next.js 16 中，`params` 和 `searchParams` 是 Promise 类型，需要使用 `await` 解包：

```typescript
// 处理动态参数
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // 处理逻辑
}

// 处理查询参数
export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1");
  // 处理逻辑
}
```

### 静态路由生成

使用 `generateStaticParams` 函数在构建时生成静态路由：

```typescript
export async function generateStaticParams() {
  const posts = getPosts();
  return posts.map((post) => ({
    slug: post.id,
  }));
}
```

## 构建配置

### 构建命令

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

### 构建输出

构建完成后，Next.js 会生成以下文件：

| 目录/文件 | 说明 |
|----------|------|
| `.next/` | 构建输出目录 |
| `.next/static/` | 静态资源 |
| `.next/server/` | 服务器代码 |
| `.next/export/` | 静态导出文件（如果启用） |

## 环境变量

### 配置文件

| 文件名 | 说明 | 环境 |
|-------|------|------|
| `.env.local` | 本地环境变量 | 本地开发 |
| `.env.development` | 开发环境变量 | 开发模式 |
| `.env.production` | 生产环境变量 | 生产模式 |

### 示例配置

```env
# .env.local
# 评论系统配置
GISCUS_REPO=your-repo
GISCUS_REPO_ID=your-repo-id
GISCUS_CATEGORY=your-category
GISCUS_CATEGORY_ID=your-category-id

# 其他环境变量
```

## 性能配置

### 缓存策略

Next.js 自动处理静态资源缓存，包括：
- 静态文件缓存
- 构建输出缓存
- 浏览器缓存

### 代码分割

Next.js 自动进行代码分割，按路由和组件分割代码，减少初始加载时间。

### 预加载

Next.js 自动预加载关键资源，包括：
- 路由预加载
- 图片预加载
- 字体预加载

## 安全配置

### 内容安全策略 (CSP)

可以在 `next.config.js` 中配置 CSP：

```javascript
const nextConfig = {
  headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://giscus.app;",
          },
        ],
      },
    ];
  },
};
```

### XSS 防护

- 使用 `dangerouslySetInnerHTML` 时确保内容可信
- 对用户输入进行验证和转义
- 使用安全的 Markdown 解析器

## 常见问题

### 1. 构建错误

- 检查 TypeScript 类型错误
- 确认所有依赖都已正确安装
- 检查文件路径和导入语句

### 2. 路由错误

- 检查路由路径是否正确
- 确认 `generateStaticParams` 是否正确生成路由
- 检查动态路由参数处理

### 3. 性能问题

- 优化图片大小和格式
- 减少不必要的依赖
- 合理使用代码分割

### 4. 静态导出问题

- 确保所有页面都可以静态生成
- 避免使用动态数据获取
- 检查 `next.config.js` 配置
