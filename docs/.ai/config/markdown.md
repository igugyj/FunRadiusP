# Markdown 配置文档

## 配置概述

FunRadiusP 使用 unified 工具链处理 Markdown 文件，将 Markdown 转换为 HTML 并支持代码高亮等功能。

## 核心依赖

| 依赖包 | 版本 | 用途 |
|-------|------|------|
| unified | 最新 | 内容处理管道 |
| remark-parse | 最新 | Markdown 解析器 |
| remark-rehype | 最新 | Markdown 到 HTML 转换 |
| rehype-stringify | 最新 | HTML 字符串化 |
| rehype-highlight | 最新 | 代码高亮 |
| gray-matter | 最新 | 解析 frontmatter |

## 配置文件

Markdown 处理逻辑位于 `lib/markdown.ts` 文件中。

### 核心函数

```typescript
// lib/markdown.ts
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
```

## 功能特性

### 1. 基本 Markdown 支持

- **标题**: `# 一级标题`, `## 二级标题`
- **列表**: 有序列表和无序列表
- **链接**: `[链接文本](链接地址)`
- **图片**: `![图片描述](图片地址)`
- **粗体和斜体**: `**粗体**`, `*斜体*`
- **引用**: `> 引用文本`
- **代码块**: 使用三个反引号 ```
- **分隔线**: `---`

### 2. 代码高亮

支持多种编程语言的代码高亮：

```javascript
// JavaScript 代码
function hello() {
  console.log('Hello, world!');
}
```

```typescript
// TypeScript 代码
interface User {
  name: string;
  age: number;
}
```

```python
# Python 代码
def hello():
    print('Hello, world!')
```

### 3. Frontmatter 支持

文章文件支持 YAML frontmatter：

```yaml
---
title: 文章标题
published: 2025-04-02
description: 文章描述
category: technology
tags: [Next.js, React, TypeScript]
draft: false
---
```

### 4. Callout 支持

支持多种 Callout 类型，使用 GitHub Flavored Markdown 语法：

```markdown
> [!NOTE]
> 这是一个注意事项

> [!TIP]
> 这是一个提示

> [!IMPORTANT]
> 这是重要信息

> [!WARNING]
> 这是警告信息

> [!CAUTION]
> 这是警示信息

> [!QUOTE]
> 这是引用

> [!SUCCESS]
> 这是成功信息

> [!FAILURE]
> 这是失败信息

> [!REFERENCES]
> 这是参考文献
```

支持的 Callout 类型：
- `NOTE` - 注意事项（蓝色）
- `TIP` - 提示（绿色）
- `IMPORTANT` - 重要信息（蓝色）
- `WARNING` - 警告（黄色）
- `CAUTION` - 警示（红色）
- `QUOTE` - 引用（蓝色）
- `SUCCESS` - 成功（绿色）
- `FAILURE` - 失败（红色）
- `REFERENCES` - 参考文献（蓝色）

## 使用方法

### 1. 处理文章内容

```typescript
import { markdownToHtml } from '@/lib/markdown';
import { readFileSync } from 'fs';
import { join } from 'path';

const markdownContent = readFileSync(
  join(process.cwd(), 'content', 'posts', 'hello-world', 'index.md'),
  'utf8'
);

const htmlContent = await markdownToHtml(markdownContent);
```

### 2. 处理特殊页面

```typescript
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
    <div dangerouslySetInnerHTML={{ __html: content }} />
  );
}
```

## 扩展配置

### 添加更多插件

可以通过添加更多 unified 插件来扩展 Markdown 功能：

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm'; // GitHub Flavored Markdown
import rehypeSlug from 'rehype-slug'; // 添加锚点
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // 添加标题链接

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm) // 支持 GitHub Flavored Markdown
    .use(remarkRehype)
    .use(rehypeHighlight)
    .use(rehypeSlug) // 添加锚点
    .use(rehypeAutolinkHeadings) // 添加标题链接
    .use(rehypeStringify)
    .process(markdown);

  return result.toString();
}
```

### 支持的扩展插件

| 插件 | 功能 | 安装命令 |
|------|------|----------|
| remark-gfm | GitHub Flavored Markdown | `npm install remark-gfm` |
| rehype-slug | 添加标题锚点 | `npm install rehype-slug` |
| rehype-autolink-headings | 添加标题链接 | `npm install rehype-autolink-headings` |
| remark-math | 数学公式支持 | `npm install remark-math` |
| rehype-katex | KaTeX 数学公式渲染 | `npm install rehype-katex` |
| remark-images | 图片处理 | `npm install remark-images` |

## 最佳实践

### 1. Markdown 编写规范

- **标题层级**: 合理使用标题层级，保持内容结构清晰
- **代码块**: 为代码块指定语言，启用代码高亮
- **链接**: 使用描述性的链接文本，提高可访问性
- **图片**: 添加图片描述，提高可访问性
- **格式一致性**: 保持 Markdown 格式的一致性

### 2. 性能优化

- **缓存**: 缓存 Markdown 处理结果，避免重复处理
- **懒加载**: 按需处理 Markdown 内容
- **图片优化**: 优化图片大小和格式

### 3. 安全考虑

- **XSS 防护**: 确保 Markdown 内容不包含恶意代码
- **输入验证**: 验证用户输入的 Markdown 内容
- **安全的解析器**: 使用安全的 Markdown 解析器

## 常见问题

### 1. Markdown 不渲染

- 检查 Markdown 语法是否正确
- 确认 `markdownToHtml` 函数是否正确调用
- 查看浏览器控制台是否有错误

### 2. 代码高亮不生效

- 确保代码块使用正确的语言标记
- 检查 `rehype-highlight` 配置是否正确
- 确认依赖包是否已正确安装

### 3. 图片不显示

- 检查图片路径是否正确
- 确保图片文件存在
- 使用相对路径引用图片

### 4. Frontmatter 解析错误

- 检查 YAML 语法是否正确
- 确保 frontmatter 格式正确
- 检查 `gray-matter` 配置是否正确
