# 分类系统模块

## 模块概述

分类系统是 FunRadiusP 的重要模块，用于对文章进行分类管理和展示。

### 功能特性

- 分类列表页面
- 分类详情页面
- 按分类筛选文章
- 分类静态路由生成

## 目录结构

```
app/
└── categories/          # 分类页面目录
    ├── page.tsx         # 分类列表页面
    └── [slug]/          # 分类详情页面（动态路由）
        └── page.tsx     # 分类详情页面组件
```

## 核心函数

### getCategories()

**功能**: 获取所有分类列表

**返回值**: `string[]` 分类名称数组

**使用示例**:

```typescript
import { getCategories } from '@/lib/posts';

const categories = getCategories();
```

### getPostsByCategory(category: string)

**功能**: 根据分类获取文章列表

**参数**:
- `category`: 分类名称

**返回值**: `Post[]` 文章数组

**使用示例**:

```typescript
import { getPostsByCategory } from '@/lib/posts';

const posts = getPostsByCategory('technology');
```

## 页面实现

### 分类列表页面

**路径**: `app/categories/page.tsx`

**功能**: 显示所有分类列表

**关键逻辑**:
- 使用 `getCategories()` 获取所有分类
- 为每个分类生成链接
- 显示每个分类下的文章数量

**代码示例**:

```typescript
import Link from 'next/link';
import { getCategories, getPostsByCategory } from '@/lib/posts';

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">分类</h1>

      <div className="card p-8">
        <ul className="space-y-4">
          {categories.map((category) => {
            const posts = getPostsByCategory(category);
            return (
              <li key={category}>
                <Link
                  href={`/categories/${category}`}
                  className="text-primary hover:underline"
                >
                  {category}
                </Link>
                <span className="text-muted ml-2">({posts.length})</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
```

### 分类详情页面

**路径**: `app/categories/[slug]/page.tsx`

**功能**: 显示特定分类下的文章列表

**关键逻辑**:
- 使用 `params` 获取分类名称
- 使用 `getPostsByCategory()` 获取该分类下的文章
- 静态生成所有分类的路由

**代码示例**:

```typescript
import { notFound } from 'next/navigation';
import { getCategories, getPostsByCategory } from '@/lib/posts';
import { formatDate } from '@/lib/utils';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    slug: category,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const categories = getCategories();
  const category = categories.find((cat) => cat === slug);

  if (!category) {
    notFound();
  }

  const posts = getPostsByCategory(category);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">分类：{category}</h1>

      {posts.length === 0 ? (
        <p className="text-center text-muted">该分类下暂无文章</p>
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

分类详情页面使用 `generateStaticParams` 函数在构建时生成所有分类的静态路由：

```typescript
export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    slug: category, // 直接使用分类名称作为 slug
  }));
}
```

### 路由参数处理

在 Next.js 16 中，`params` 是 Promise 类型，需要使用 `await` 解包：

```typescript
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // 处理逻辑
}
```

## 分类命名规范

### 推荐规范

1. **使用英文**：分类名称使用英文，避免 URL 编码问题
2. **简洁明了**：分类名称应该简洁、描述性强
3. **大小写一致**：建议使用小写字母，单词之间用连字符分隔
4. **避免特殊字符**：避免使用特殊字符和空格

### 示例

- ✅ `technology`（技术）
- ✅ `programming`（编程）
- ✅ `life`（生活）
- ❌ `技术`（中文，会导致 URL 编码）
- ❌ `Programming Languages`（包含空格）

## 性能优化

1. **静态生成**：分类页面在构建时预渲染
2. **缓存策略**：分类数据在构建时缓存
3. **代码分割**：按需加载分类页面

## 最佳实践

1. **分类数量**：保持分类数量合理，避免过多分类
2. **分类层级**：目前只支持一级分类，建议保持分类结构扁平
3. **文章归类**：每篇文章应该只属于一个分类
4. **命名一致性**：分类名称应该与内容主题一致

## 常见问题

### 1. 分类页面 404

- 检查分类名称是否正确
- 确认 `generateStaticParams` 是否正确生成路由
- 检查 `getCategories()` 是否返回该分类

### 2. 分类链接无法访问

- 检查链接生成是否正确
- 确认分类名称是否使用英文
- 检查路由参数处理是否正确

### 3. 分类下文章不显示

- 检查文章的 `category` 字段是否与分类名称匹配
- 确认文章的 `draft` 字段是否为 `false`
- 检查 `getPostsByCategory()` 函数是否正常工作
