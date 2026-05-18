# 路径规范文档

## 概述

本文档定义了 FunRadiusP 项目中所有路径的命名规范，确保项目结构的一致性和可维护性。

## 路径命名原则

### 1. 所有路径必须使用英文
- **网页路径**: 所有 URL 路径必须使用英文
- **本地文件路径**: 所有文件和文件夹名称必须使用英文
- **代码中的路径引用**: 所有代码中的路径引用必须使用英文

### 2. 路径命名规则
- **小写字母**: 路径使用小写字母
- **连字符分隔**: 多个单词使用连字符 `-` 分隔
- **避免特殊字符**: 不使用中文、空格或特殊字符
- **语义化**: 路径名称应具有明确的语义

## 当前项目路径结构

### 网页路径（URL）

| 路径 | 页面名称 | 说明 |
|------|---------|------|
| `/` | 首页 | 网站首页 |
| `/articles/` | 文章列表 | 文章列表页面 |
| `/archive/` | 文章归档 | 按年份归档的文章 |
| `/categories/` | 分类列表 | 所有分类 |
| `/categories/[slug]/` | 分类详情 | 特定分类下的文章 |
| `/tags/` | 标签列表 | 所有标签 |
| `/tags/[slug]/` | 标签详情 | 特定标签下的文章 |
| `/about/` | 关于我 | 关于页面 |
| `/projects/` | 我的项目 | 项目展示页面 |
| `/information/` | 信息 | 联系信息页面 |
| `/journey/` | 历程 | 个人历程时间线 |
| `/posts/[slug]/` | 文章详情 | 单篇文章详情 |

### 本地文件路径

#### 应用程序结构
```
app/
├── about/
│   └── page.tsx
├── archive/
│   └── page.tsx
├── articles/
│   └── page.tsx
├── categories/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── information/
│   └── page.tsx
├── journey/
│   └── page.tsx
├── posts/
│   └── [slug]/
│       └── page.tsx
├── projects/
│   └── page.tsx
├── tags/
│   ├── page.tsx
│   └── [slug]/
│       └── page.tsx
├── globals.css
├── layout.tsx
└── page.tsx
```

#### 组件结构
```
components/
├── BackToTop.tsx
├── Footer.tsx
├── GiscusComments.tsx
├── Header.tsx
├── MediaPlayer.tsx
├── Pagination.tsx
└── TableOfContents.tsx
```

#### 工具函数结构
```
lib/
├── markdown.ts
├── posts.ts
└── utils.ts
```

#### 内容文件结构
```
content/
├── posts/
│   └── [post-id]/
│       └── index.md
└── spec/
    ├── about/
    │   └── index.md
    ├── information/
    │   └── index.md
    ├── journey/
    │   └── index.md
    └── projects/
        └── index.md
```

## 路径使用规范

### 1. 导入路径
```typescript
// 正确的导入路径示例
import { markdownToHtml } from "@/lib/markdown";
import Header from "@/components/Header";
import { getPosts } from "@/lib/posts";

// 避免使用相对路径
import { markdownToHtml } from "../../lib/markdown"; // 不推荐
```

### 2. 链接路径
```typescript
// 正确的链接路径示例
<Link href="/articles">文章</Link>
<Link href="/categories/tech">技术分类</Link>
<Link href="/posts/hello-world">Hello World</Link>

// 确保路径以斜杠结尾（根据 next.config.js 配置）
<Link href="/about/">关于</Link>
```

### 3. 动态路径
```typescript
// 动态路由参数使用英文
export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    slug: category, // 直接使用英文分类名称
  }));
}
```

## 分类和标签命名

### 分类命名规范
- 使用英文单词
- 使用小写字母
- 使用连字符分隔多个单词
- 示例：`tech`, `life`, `programming`, `web-development`

### 标签命名规范
- 使用英文单词
- 使用小写字母
- 使用连字符分隔多个单词
- 示例：`react`, `nextjs`, `typescript`, `web-development`

## 迁移指南

### 从中文路径迁移到英文路径

1. **重命名文件夹和文件**
   ```bash
   # 示例：将中文文件夹重命名为英文
   mv app/分类 app/categories
   mv app/标签 app/tags
   ```

2. **更新导入路径**
   ```typescript
   // 更新所有导入路径
   import { getCategories } from "@/lib/posts";
   ```

3. **更新链接**
   ```typescript
   // 更新所有链接路径
   <Link href="/categories">分类</Link>
   ```

4. **更新路由配置**
   ```typescript
   // 更新 generateStaticParams 函数
   export async function generateStaticParams() {
     return categories.map((category) => ({
       slug: category, // 使用英文分类名称
     }));
   }
   ```

## 注意事项

1. **URL 编码**: 英文路径避免了 URL 编码问题，提高 SEO 效果
2. **大小写敏感**: 服务器可能对路径大小写敏感，建议统一使用小写
3. **斜杠结尾**: 根据 `next.config.js` 配置，确保路径以斜杠结尾
4. **静态生成**: 确保所有路径都能正确生成静态页面
5. **内容语言**: 路径使用英文，但页面内容可以保持中文

## 违反规范的后果

1. **URL 编码问题**: 中文路径会导致 URL 编码，影响用户体验
2. **SEO 问题**: 搜索引擎对英文路径的索引效果更好
3. **兼容性问题**: 某些服务器和浏览器对中文路径支持不佳
4. **维护困难**: 不一致的路径命名会增加维护成本

## 总结

- ✅ 所有路径必须使用英文
- ✅ 路径名称应具有明确的语义
- ✅ 使用小写字母和连字符分隔
- ✅ 避免特殊字符和空格
- ✅ 保持路径命名的一致性
- ✅ 页面内容可以保持中文，仅路径使用英文
