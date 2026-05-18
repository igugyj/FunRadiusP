# 标签系统模块

## 模块概述

标签系统是 FunRadiusP 的重要模块，用于对文章进行标签管理和展示。

### 功能特性

- 标签云页面
- 标签详情页面
- 按标签筛选文章
- 标签静态路由生成

## 目录结构

```
app/
└── tags/                # 标签页面目录
    ├── page.tsx         # 标签云页面
    └── [slug]/          # 标签详情页面（动态路由）
        └── page.tsx     # 标签详情页面组件
```

## 核心函数

### getTags()

**功能**: 获取所有标签列表

**返回值**: `string[]` 标签名称数组

**使用示例**:

```typescript
import { getTags } from '@/lib/posts';

const tags = getTags();
```

### getPostsByTag(tag: string)

**功能**: 根据标签获取文章列表

**参数**:
- `tag`: 标签名称

**返回值**: `Post[]` 文章数组

**使用示例**:

```typescript
import { getPostsByTag } from '@/lib/posts';

const posts = getPostsByTag('Next.js');
```

## 页面实现

### 标签云页面

**路径**: `app/tags/page.tsx`

**功能**: 显示所有标签的标签云

**关键逻辑**:
- 使用 `getTags()` 获取所有标签
- 为每个标签生成链接
- 根据标签使用频率调整字体大小

**代码示例**:

```typescript
import Link from 'next/link';
import { getTags, getPostsByTag } from '@/lib/posts';
import { getTagSize } from '@/lib/utils';

export default function TagsPage() {
  const tags = getTags();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">标签云</h1>

      <div className="card p-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {tags.map((tag) => {
            const posts = getPostsByTag(tag);
            const sizeClass = getTagSize(posts.length);

            return (
              <Link
                key={tag}
                href={`/tags/${tag}`}
                className={`${sizeClass} font-medium text-primary hover:text-dark transition-colors`}
              >
                {tag} ({posts.length})
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
```

### 标签详情页面

**路径**: `app/tags/[slug]/page.tsx`

**功能**: 显示特定标签下的文章列表

**关键逻辑**:
- 使用 `params` 获取标签名称
- 使用 `getPostsByTag()` 获取该标签下的文章
- 静态生成所有标签的路由

**代码示例**:

```typescript
import { notFound } from 'next/navigation';
import { getTags, getPostsByTag } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

interface TagPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const tags = getTags();
  return tags.map((tag) => ({
    slug: tag,
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { slug } = await params;
  const tags = getTags();
  const tag = tags.find((t) => t === slug);

  if (!tag) {
    notFound();
  }

  const posts = getPostsByTag(tag);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">标签：{tag}</h1>

      {posts.length === 0 ? (
        <p className="text-center text-muted">该标签下暂无文章</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
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
      )}
    </div>
  );
}
```

## 路由处理

### 静态路由生成

标签详情页面使用 `generateStaticParams` 函数在构建时生成所有标签的静态路由：

```typescript
export async function generateStaticParams() {
  const tags = getTags();
  return tags.map((tag) => ({
    slug: tag, // 直接使用标签名称作为 slug
  }));
}
```

### 路由参数处理

在 Next.js 16 中，`params` 是 Promise 类型，需要使用 `await` 解包：

```typescript
export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // 处理逻辑
}
```

## 标签命名规范

### 推荐规范

1. **使用英文**：标签名称使用英文，避免 URL 编码问题
2. **简洁明了**：标签名称应该简洁、描述性强
3. **大小写一致**：建议使用首字母大写的驼峰命名或 Pascal 命名
4. **避免特殊字符**：避免使用特殊字符和空格

### 示例

- ✅ `Next.js`（框架名称）
- ✅ `React`（库名称）
- ✅ `TypeScript`（语言名称）
- ❌ `next-js`（建议使用官方名称）
- ❌ `前端开发`（中文，会导致 URL 编码）

## 性能优化

1. **静态生成**：标签页面在构建时预渲染
2. **缓存策略**：标签数据在构建时缓存
3. **代码分割**：按需加载标签页面

## 最佳实践

1. **标签数量**：每篇文章建议使用 3-5 个标签
2. **标签关联性**：标签应该与文章内容直接相关
3. **标签一致性**：使用一致的标签命名规范
4. **避免过度标签**：避免使用过多的标签，保持标签系统的简洁性

## 常见问题

### 1. 标签页面 404

- 检查标签名称是否正确
- 确认 `generateStaticParams` 是否正确生成路由
- 检查 `getTags()` 是否返回该标签

### 2. 标签链接无法访问

- 检查链接生成是否正确
- 确认标签名称是否使用英文
- 检查路由参数处理是否正确

### 3. 标签下文章不显示

- 检查文章的 `tags` 数组是否包含该标签
- 确认文章的 `draft` 字段是否为 `false`
- 检查 `getPostsByTag()` 函数是否正常工作
