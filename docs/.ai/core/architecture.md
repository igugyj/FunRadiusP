# FunRadiusP 架构文档

## 架构概览

FunRadiusP 采用 Next.js App Router 架构，使用 Server Components 和 Client Components 的组合来实现高性能的静态博客。

### 核心架构原则

1. **服务器优先**：大部分页面使用服务器组件，直接在服务器端渲染
2. **静态生成**：所有页面在构建时预渲染，提高性能和 SEO
3. **组件化**：高度模块化的组件设计，便于复用和维护
4. **类型安全**：使用 TypeScript 提供完整的类型定义

## 核心架构模式

### 1. 服务器组件 (Server Components)

大部分页面组件都是服务器组件，直接在服务器端渲染，提供更好的性能和 SEO。

**服务器组件示例**:

```typescript
// app/posts/[slug]/page.tsx
export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostById(slug);
  // 服务器端处理逻辑
  return (
    <div>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  );
}
```

### 2. 客户端组件 (Client Components)

需要交互功能的组件使用 `'use client'` 指令标记为客户端组件。

**客户端组件示例**:

```typescript
// components/TableOfContents.tsx
'use client';
import { useState, useEffect } from 'react';

export default function TableOfContents({ content }: { content: string }) {
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    // 客户端交互逻辑
    const handleScroll = () => {
      // 处理滚动事件
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="toc">
      {/* 目录内容 */}
    </div>
  );
}
```

### 3. 上下文管理 (Context)

使用 React Context 管理全局状态，特别是国际化。

**国际化 Context 示例**:

```typescript
// lib/i18n/context.tsx
'use client';
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // 语言状态管理
}
```

## 模块架构

### 1. 文章模块 (Posts)

```
content/posts/[id]/index.md
    ↓
lib/posts.ts (getPosts, getPostById)
    ↓
app/posts/[slug]/page.tsx
    ↓
渲染到页面
```

### 2. 随笔模块 (Moments)

```
content/moments/[id]/index.md
    ↓
lib/moments.ts (getMoments, getMomentById)
    ↓
app/moments/[id]/page.tsx
    ↓
渲染到页面
```

### 3. 文档模块 (Docs)

```
content/docs/[collection]/[doc].md
    ↓
lib/docs.ts (getDocCollections, getDoc)
    ↓
app/docs/[collection]/[doc]/page.tsx
    ↓
渲染到页面
```

### 4. 演示模块 (Demos)

```
content/demos/[id]/demo.html
    ↓
lib/demos.ts (getDemos, getDemoById)
    ↓
app/demos/[id]/page.tsx
    ↓
iframe 嵌入展示
```

### 5. 国际化模块 (i18n)

```
lib/i18n/translations/[lang].json
    ↓
lib/i18n/context.tsx (LanguageProvider, useLanguage)
    ↓
components/i18n/LanguageToggle.tsx
    ↓
用户界面
```

## 数据流

### 1. 文章数据流

```
content/posts/[id]/index.md
    ↓
lib/posts.ts (getPosts, getPostById)
    ↓
app/posts/[slug]/page.tsx
    ↓
渲染到页面
```

### 2. 静态重定向系统

```
content/posts/[id]/index.md
    ↓
scripts/build-auto-redirects.js (SHA-256 → Base62 短码)
    ↓
scripts/generate-html-redirect.js (生成 <meta refresh> 页面)
    ↓
output/p/{短码}/index.html → /posts/{文章文件夹}/

redirect-custom.json (自定义映射)
    ↓
scripts/build-custom-redirects.js
    ↓
scripts/generate-html-redirect.js
    ↓
public/{短码}/index.html → 用户指定目标

scripts/build-all-redirects.js (整合 + 冲突检测)
    ↓
.redirects/redirect-map.json (合并映射表)
```

### 3. 分类和标签数据流

```
content/posts/[id]/index.md (包含 category 和 tags)
    ↓
lib/posts.ts (getCategories, getTags)
    ↓
app/categories/[slug]/page.tsx 或 app/tags/[slug]/page.tsx
    ↓
generateStaticParams 生成静态路由
    ↓
渲染到页面
```

### 3. Markdown 处理流程

```
Markdown 文件
    ↓
gray-matter 解析 frontmatter
    ↓
unified + remark-parse 解析 Markdown
    ↓
remark-rehype 转换为 HTML AST
    ↓
rehype-stringify 生成 HTML
    ↓
rehype-highlight 代码高亮
    ↓
渲染到页面
```

### 4. 国际化数据流

```
用户语言偏好 (localStorage)
    ↓
检测浏览器语言
    ↓
LanguageProvider 管理状态
    ↓
useLanguage Hook 提供翻译
    ↓
t() 函数替换文本
```

## 路由架构

### 路由类型

| 路由类型 | 路径 | 实现方式 |
|---------|------|---------|
| 静态路由 | `/about/`, `/information/` | 静态页面 |
| 动态路由 | `/posts/[slug]` | 动态参数 + 静态生成 |
| 动态路由 | `/moments/[id]` | 动态参数 + 静态生成 |
| 动态路由 | `/docs/[collection]/[doc]` | 动态参数 + 静态生成 |
| 动态路由 | `/demos/[id]` | 动态参数 + 静态生成 |
| 动态路由 | `/categories/[slug]` | 动态参数 + 静态生成 |
| 动态路由 | `/tags/[slug]` | 动态参数 + 静态生成 |
| 带查询参数 | `/articles/?page=1` | 服务器组件 + 异步 searchParams |
| 短链接重定向 | `/p/{短码}` | 构建时生成 `<meta refresh>` 静态页面 |
| 自定义重定向 | `/{自定义短码}` | 构建时生成 `<meta refresh>` 静态页面 |

### 静态路由生成

使用 `generateStaticParams` 函数在构建时生成所有可能的静态路由：

```typescript
// app/categories/[slug]/page.tsx
export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    slug: category, // 直接使用分类名称
  }));
}
```

### 路由参数处理

在 Next.js 16 中，`params` 和 `searchParams` 是 Promise 类型，需要使用 `await` 解包：

```typescript
// 处理动态参数
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
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

## 状态管理

FunRadiusP 不使用复杂的状态管理库，主要依赖：

1. **服务器端状态**: 通过文件系统读取和函数调用获取
2. **客户端状态**: 使用 React Hooks (useState, useEffect) 管理简单状态
3. **URL 状态**: 使用 searchParams 和 params 管理路由状态
4. **Context 状态**: 使用 React Context 管理国际化状态

### 国际化状态管理

```typescript
// lib/i18n/context.tsx
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  availableLanguages: Language[];
}
```

## 性能优化

### 1. 静态生成
- 所有页面在构建时预渲染
- 使用 `generateStaticParams` 生成静态路由
- 避免运行时计算

### 2. 代码分割
- Next.js 自动进行代码分割
- 动态导入大型组件

### 3. 图片优化
- 使用 Next.js Image 组件优化图片加载
- 支持懒加载和响应式图片

### 4. 缓存策略
- 静态资源缓存
- 构建时缓存
- 浏览器缓存
- localStorage 缓存用户语言偏好

## 安全考虑

1. **XSS 防护**: 使用 `dangerouslySetInnerHTML` 时确保内容可信
2. **文件路径验证**: 验证所有文件路径，防止路径遍历攻击
3. **环境变量**: 敏感信息使用环境变量存储
4. **输入验证**: 验证用户输入，防止恶意输入
5. **CSP 安全**: 适当配置 Content Security Policy

## 扩展性设计

1. **插件系统**: Markdown 处理使用 unified 插件系统，易于扩展
2. **组件化**: 高度模块化的组件设计，便于复用和维护
3. **类型安全**: 使用 TypeScript 提供完整的类型定义
4. **配置化**: 核心功能可配置，便于适应不同需求
5. **模块化**: 各模块相互独立，易于添加新功能

## 架构演进

### 1. 初始架构
- 基于 Next.js 13 Pages Router
- 客户端渲染为主

### 2. 当前架构
- 基于 Next.js 16 App Router
- 服务器组件为主
- 静态生成
- 多语言支持
- 新增随笔、文档、Demo 模块
- 静态重定向系统（短链接 + 自定义映射）
- 构建流水线：prebuild → build → postbuild

### 3. 未来规划
- 支持更多 Markdown 扩展
- 集成更多社交功能
- 优化性能和用户体验
- 增加更多模块

