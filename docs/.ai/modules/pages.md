# 页面管理模块

## 模块概述

页面管理模块负责 FunRadiusP 的所有页面实现，包括静态页面和动态页面。

### 功能特性

- 静态页面管理
- 动态页面管理
- 页面布局和结构
- 页面路由和导航

## 目录结构

```
app/
├── layout.tsx        # 根布局组件
├── page.tsx          # 首页
├── about/            # 关于页面
├── archive/          # 归档页面
├── articles/         # 文章列表页面
├── categories/       # 分类页面
├── demos/            # Demo 页面
├── docs/             # 文档页面
├── information/      # 信息页面
├── journey/          # 历程页面
├── moments/          # 随笔页面
├── posts/            # 文章详情页面
├── projects/         # 项目页面
└── tags/             # 标签页面
```

## 页面类型

### 1. 静态页面

**定义**: 内容固定，不需要动态参数的页面

**示例页面**:
- 首页 (`app/page.tsx`)
- 关于页面 (`app/about/page.tsx`)
- 信息页面 (`app/information/page.tsx`)
- 历程页面 (`app/journey/page.tsx`)
- 项目页面 (`app/projects/page.tsx`)

**实现示例**:

```typescript
// app/about/page.tsx
import { markdownToHtml } from '@/lib/markdown';
import { readFileSync } from 'fs';
import { join } from 'path';

export default async function AboutPage() {
  const markdownContent = readFileSync(
    join(process.cwd(), 'content', 'spec', 'about', 'index.md'),
    'utf8'
  );
  const content = await markdownToHtml(markdownContent);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">关于我</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
```

### 2. 动态页面

**定义**: 需要动态参数的页面，使用动态路由

**示例页面**:
- 文章详情页 (`app/posts/[slug]/page.tsx`)
- 分类详情页 (`app/categories/[slug]/page.tsx`)
- 标签详情页 (`app/tags/[slug]/page.tsx`)
- 随笔详情页 (`app/moments/[id]/page.tsx`)
- 文档详情页 (`app/docs/[collection]/[doc]/page.tsx`)
- Demo详情页 (`app/demos/[id]/page.tsx`)

**实现示例**:

```typescript
// app/posts/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import GiscusComments from '@/components/GiscusComments';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostById(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <article className="card p-8">
        <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
        <p className="text-muted mb-6">
          {post.published} · {post.readingTime}
        </p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
      <GiscusComments />
    </div>
  );
}
```

### 3. 带查询参数的页面

**定义**: 使用 URL 查询参数的页面

**示例页面**:
- 文章列表页 (`app/articles/page.tsx`)
- 归档页面 (`app/archive/page.tsx`)

**实现示例**:

```typescript
// app/articles/page.tsx
import { getPosts } from '@/lib/posts';
import { formatDate } from '@/lib/utils';
import Pagination from '@/components/Pagination';

const PAGE_SIZE = 5;

export default async function ArticlesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams;
  const page = parseInt(params?.page || "1");
  const posts = getPosts();

  // 分页逻辑
  const totalPosts = posts.length;
  const totalPages = Math.ceil(totalPosts / PAGE_SIZE);
  const startIndex = (page - 1) * PAGE_SIZE;
  const paginatedPosts = posts.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">文章列表</h1>

      <div className="space-y-6">
        {paginatedPosts.map((post) => (
          <article key={post.id} className="card p-6">
            <h2 className="text-xl font-bold mb-2">
              <a href={`/posts/${post.id}`} className="hover:text-primary">
                {post.title}
              </a>
            </h2>
            <p className="text-muted mb-4">
              {post.published} · {post.readingTime}
            </p>
            <p className="mb-4">{post.description}</p>
            <a
              href={`/posts/${post.id}`}
              className="text-primary hover:underline"
            >
              阅读更多
            </a>
          </article>
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        baseUrl="/articles"
      />
    </div>
  );
}
```

## 新增页面

### 随笔页面

**路径**: `app/moments/page.tsx`

**功能**: 显示随笔列表

**相关文档**: [moments.md](./moments.md)

### 文档页面

**路径**: `app/docs/page.tsx`

**功能**: 显示文档列表和文档集

**相关文档**: [docs.md](./docs.md)

### Demo页面

**路径**: `app/demos/page.tsx`

**功能**: 显示 Demo 列表

**相关文档**: [demos.md](./demos.md)

## 布局管理

### 根布局

**路径**: `app/layout.tsx`

**功能**: 定义网站的整体布局，包括导航栏、页脚和国际化 Provider

**实现示例**:

```typescript
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/lib/i18n';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <LanguageProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8">
              {children}
            </main>
            <Footer />
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}
```

### 页面布局最佳实践

1. **响应式设计**: 使用 Tailwind CSS 的响应式类确保页面在不同设备上都能正常显示
2. **一致的结构**: 保持页面结构一致，提高用户体验
3. **合理的间距**: 使用适当的间距确保页面内容清晰易读
4. **语义化 HTML**: 使用语义化的 HTML 标签，提高 SEO 和可访问性
5. **国际化支持**: 确保页面支持多语言切换

## 导航系统

### 导航栏

**路径**: `components/Header.tsx`

**功能**: 提供网站的主要导航链接

**实现示例**:

```typescript
import Link from 'next/link';
import LanguageToggle from '@/components/i18n/LanguageToggle';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            FunRadiusP
          </Link>
          <nav>
            <ul className="flex space-x-6 items-center">
              <li>
                <Link href="/" className="hover:text-primary">首页</Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-primary">文章</Link>
              </li>
              <li>
                <Link href="/moments" className="hover:text-primary">随笔</Link>
              </li>
              <li>
                <Link href="/docs" className="hover:text-primary">文档</Link>
              </li>
              <li>
                <Link href="/demos" className="hover:text-primary">Demo</Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary">分类</Link>
              </li>
              <li>
                <Link href="/tags" className="hover:text-primary">标签</Link>
              </li>
              <li>
                <Link href="/archive" className="hover:text-primary">归档</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">关于</Link>
              </li>
              <li>
                <LanguageToggle />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
```

### 面包屑导航

**功能**: 显示当前页面的导航路径，提高用户体验

**实现示例**:

```typescript
import Link from 'next/link';

export default function Breadcrumb({ items }: { items: { text: string; href?: string }[] }) {
  return (
    <nav className="text-sm mb-6">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <Link href={item.href} className="text-muted hover:text-primary">
                {item.text}
              </Link>
            ) : (
              <span className="text-primary">{item.text}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2 text-muted">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

## 性能优化

1. **静态生成**: 尽可能使用静态生成，提高页面加载速度
2. **代码分割**: 按需加载页面组件，减少初始加载时间
3. **图片优化**: 使用适当的图片格式和大小，提高加载速度
4. **缓存策略**: 合理使用缓存，减少重复请求
5. **国际化优化**: 确保翻译文件按需加载

## 最佳实践

1. **页面结构**: 保持页面结构清晰，遵循语义化 HTML 原则
2. **响应式设计**: 确保页面在不同设备上都能正常显示
3. **性能优化**: 优化页面加载速度，提高用户体验
4. **SEO 优化**: 合理使用标题、meta 标签等，提高 SEO 效果
5. **可访问性**: 确保页面符合可访问性标准，便于所有用户使用
6. **国际化**: 确保页面支持多语言，使用 `useLanguage` Hook

## 常见问题

### 1. 页面不显示

- 检查页面文件是否存在
- 确认页面文件路径是否正确
- 检查页面组件是否正确导出

### 2. 路由错误

- 检查路由路径是否正确
- 确认动态路由参数是否正确处理
- 检查 `generateStaticParams` 是否正确生成路由

### 3. 样式问题

- 检查 Tailwind CSS 类是否正确
- 确认全局样式是否正确加载
- 检查浏览器开发者工具中的样式问题

### 4. 性能问题

- 优化页面加载速度
- 减少不必要的组件渲染
- 合理使用缓存策略

### 5. 国际化问题

- 确认 `LanguageProvider` 是否正确包裹应用
- 检查翻译文件是否正确配置
- 确认使用客户端组件进行语言切换

