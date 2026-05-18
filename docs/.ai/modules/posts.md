# 文章系统模块

## 模块概述

文章系统是 FunRadiusP 的核心模块，负责管理和展示博客文章。

### 功能特性

- 支持 Markdown 格式文章
- 文章分类和标签管理
- 文章归档（按年份）
- 文章列表和详情页
- 文章元数据管理

## 目录结构

```
content/
└── posts/              # 文章内容目录
    └── [post-id]/      # 文章文件夹
        └── index.md    # 文章内容文件
```

## 其他内容模块

除了文章系统，FunRadiusP 还包含以下内容模块：

| 模块 | 文档 | 说明 |
|------|------|------|
| 随笔系统 | [moments.md](./moments.md) | 简短、图文并茂的内容 |
| 文档系统 | [docs.md](./docs.md) | 结构化文档展示 |
| Demo系统 | [demos.md](./demos.md) | 交互式 Demo 展示 |

## 文章文件格式

### Frontmatter

每篇文章的 `index.md` 文件包含 frontmatter 部分，用于存储文章元数据：

```yaml
---
title: 文章标题
published: 2025-04-02  # 发布日期
description: 文章描述  # 文章摘要
category: technology   # 分类（英文）
tags: [Next.js, React, TypeScript]  # 标签（英文）
draft: false           # 是否为草稿
player:                # 音乐播放器配置（可选）
  source: "netease"   # 音源类型："netease" 或 "local"
  link: "2085549628" # 网易云歌曲ID、完整URL或本地文件路径
  bottom: "40px"      # 位置配置（可选）
  left: "40px"
  autoPlay: false     # 是否自动播放（可选，默认自动播放）
---
```

### 内容部分

Frontmatter 之后是文章的 Markdown 内容：

```markdown
# 文章标题

文章内容...

## 二级标题

更多内容...

```

## 核心函数

### getPosts()

**功能**: 获取所有文章列表

**返回值**: `Post[]` 文章数组

**使用示例**:

```typescript
import { getPosts } from '@/lib/posts';

const posts = getPosts();
```

### getPostById(id: string)

**功能**: 根据 ID 获取单篇文章

**参数**:
- `id`: 文章 ID（文件夹名称）

**返回值**: `Post` 文章对象

**使用示例**:

```typescript
import { getPostById } from '@/lib/posts';

const post = getPostById('hello-world');
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

### getPostsByYear(year: string)

**功能**: 根据年份获取文章列表

**参数**:
- `year`: 年份（字符串格式，如 "2025"）

**返回值**: `Post[]` 文章数组

**使用示例**:

```typescript
import { getPostsByYear } from '@/lib/posts';

const posts = getPostsByYear('2025');
```

## 类型定义

### Post 接口

```typescript
interface Post {
  id: string;          // 文章 ID
  title: string;       // 文章标题
  content: string;     // 文章内容（HTML）
  published: string;   // 发布日期
  description: string; // 文章描述
  category: string;    // 分类
  tags: string[];      // 标签
  draft: boolean;      // 是否为草稿
  player: any;         // 音乐播放器配置
  image: string | undefined; // 文章封面图片
}
```

### 音乐播放器配置

播放器配置是可选的，仅在文章需要背景音乐时添加。

**网易云音乐配置**:
```yaml
player:
  source: "netease"
  link: "2085549628"  # 歌曲 ID
  bottom: "40px"
  left: "40px"
```

**本地歌曲配置**:
```yaml
player:
  source: "local"
  link: "Starting.mp3"  # 相对路径（自动处理 assets 目录）
  bottom: "40px"
  left: "40px"
```

**配置参数说明**:
- `source`: 音源类型，`netease`（网易云音乐）或 `local`（本地歌曲）
- `link`:
  - 网易云：歌曲 ID（纯数字）或完整播放器 URL
  - 本地：相对路径（自动处理 assets 目录）
- `top`/`bottom`/`left`/`right`: 位置配置（可选），默认 `bottom: 40px, left: 40px`
- `autoPlay`: 是否自动播放（可选），默认自动播放，设置为 `false` 时不自动播放

## 页面实现

### 文章列表页

**路径**: `app/articles/page.tsx`

**功能**: 显示文章列表，支持分页

**关键逻辑**:
- 使用 `getPosts()` 获取所有文章
- 使用 `paginate()` 函数进行分页
- 使用 `searchParams` 获取页码

### 文章详情页

**路径**: `app/posts/[slug]/page.tsx`

**功能**: 显示单篇文章详情

**关键逻辑**:
- 使用 `params` 获取文章 ID
- 使用 `getPostById()` 获取文章详情
- 使用 `markdownToHtml()` 渲染文章内容
- 集成评论系统

### 归档页面

**路径**: `app/archive/page.tsx`

**功能**: 按年份显示文章归档

**关键逻辑**:
- 使用 `getPosts()` 获取所有文章
- 按年份分组
- 使用 `searchParams` 获取选中的年份

## Markdown 处理

### markdownToHtml()

**功能**: 将 Markdown 转换为 HTML

**参数**:
- `content`: Markdown 内容

**返回值**: `string` HTML 内容

**使用示例**:

```typescript
import { markdownToHtml } from '@/lib/markdown';

const html = await markdownToHtml(markdownContent);
```

### 支持的 Markdown 特性

- 标题
- 列表（有序和无序）
- 代码块（支持语法高亮）
- 链接
- 图片
- 表格
- 引用
- 粗体和斜体
- 分隔线

## 性能优化

1. **缓存策略**: 文章数据在构建时缓存
2. **静态生成**: 文章页面在构建时预渲染
3. **代码分割**: 按需加载文章内容
4. **图片优化**: 自动优化文章中的图片

## 最佳实践

1. **文章 ID**: 使用简短、描述性的文件夹名称作为文章 ID
2. **分类和标签**: 使用英文名称，避免 URL 编码问题
3. **内容结构**: 合理使用标题层级，保持内容结构清晰
4. **图片管理**: 图片应放在文章文件夹中，使用相对路径引用
5. **元数据**: 完整填写 frontmatter，提高 SEO 效果

## 常见问题

### 1. 文章不显示

- 检查 `draft` 是否设置为 `false`
- 检查文件路径是否正确
- 检查 frontmatter 格式是否正确

### 2. 图片不显示

- 检查图片路径是否正确
- 确保图片文件存在
- 使用相对路径引用图片

### 3. 代码高亮不生效

- 确保代码块使用正确的语言标记
- 检查 `rehype-highlight` 配置是否正确

