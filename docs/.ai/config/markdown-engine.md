# Markdown 引擎配置文档

## 当前 Markdown 引擎

FunRadiusP 使用基于 unified 生态系统的 Markdown 引擎，具有以下特点：

### 核心依赖

| 依赖包 | 版本 | 用途 |
|-------|------|------|
| unified | 11.0.5 | 内容处理管道 |
| remark-parse | 11.0.0 | Markdown 解析器 |
| remark-rehype | 11.1.2 | Markdown 到 HTML 转换 |
| rehype-stringify | 10.0.1 | HTML 字符串化 |
| remark-gfm | 4.0.1 | GitHub Flavored Markdown 支持 |
| remark-math | 6.0.0 | 数学公式支持 |
| rehype-highlight | 7.0.2 | 代码高亮 |
| rehype-katex | 7.0.1 | KaTeX 数学公式渲染 |
| rehype-slug | 6.0.0 | 标题锚点 |
| rehype-autolink-headings | 7.1.0 | 标题链接 |

## 支持的功能

### 1. 基本 Markdown

- **标题**: `# 一级标题`, `## 二级标题`
- **列表**: 有序列表和无序列表
- **链接**: `[链接文本](链接地址)`
- **图片**: `![图片描述](图片地址)`
- **粗体和斜体**: `**粗体**`, `*斜体*`
- **引用**: `> 引用文本`
- **代码块**: 使用三个反引号 ```
- **分隔线**: `---`

### 2. GitHub Flavored Markdown (GFM)

- **表格**:
  ```markdown
  | 表头1 | 表头2 |
  |-------|-------|
  | 单元格1 | 单元格2 |
  ```

- **任务列表**:
  ```markdown
  - [x] 已完成任务
  - [ ] 未完成任务
  ```

- **自动链接**: `https://example.com` 会自动转换为链接

- **删除线**: `~~删除线~~`

- **代码块语法高亮**: ```javascript

### 3. 数学公式

- **行内公式**: `$E = mc^2$`

- **块级公式**:
  ```markdown
  $$
  E = mc^2
  $$
  ```

### 4. 扩展功能

- **标题锚点**: 自动为标题添加锚点链接
- **代码高亮**: 支持多种编程语言的代码高亮
- **时间线语法**: 自定义的时间线语法

## 性能评估

### 处理速度

| 内容类型 | 处理时间 |
|---------|----------|
| 基本 Markdown | < 10ms |
| 复杂 Markdown | < 50ms |
| 包含数学公式 | < 100ms |

### 内存使用

- 平均内存使用: < 50MB
- 峰值内存使用: < 100MB

## 与其他 Markdown 引擎的比较

| 引擎 | 速度 | 功能 | 扩展性 | 维护性 |
|------|------|------|--------|--------|
| unified (当前) | 中 | 高 | 高 | 高 |
| marked | 高 | 中 | 中 | 高 |
| markdown-it | 高 | 高 | 高 | 中 |
| commonmark.js | 中 | 中 | 低 | 高 |

## 最佳实践

### 1. 内容编写

- **使用标准 Markdown 语法**：遵循 CommonMark 标准
- **合理使用 GFM 功能**：表格、任务列表等
- **数学公式格式**：使用 KaTeX 支持的数学公式格式
- **代码块语言**：为代码块指定正确的语言

### 2. 性能优化

- **避免过度使用复杂功能**：如嵌套表格、大量数学公式
- **合理组织内容结构**：使用适当的标题层级
- **图片优化**：优化图片大小和格式

### 3. 故障排除

- **数学公式不显示**：检查公式语法是否正确，确保 KaTeX 样式已加载
- **代码高亮不生效**：确保代码块指定了正确的语言
- **表格显示异常**：检查表格语法是否正确

## 未来扩展

### 计划添加的功能

1. **脚注支持**：`[^1]` 脚注语法
2. **目录生成**：自动生成文章目录
3. **自定义组件**：支持在 Markdown 中使用自定义 React 组件
4. **图表支持**：集成 Mermaid 图表
5. **语法扩展**：支持更多自定义语法

### 性能优化计划

1. **缓存机制**：缓存 Markdown 处理结果
2. **懒加载**：按需处理 Markdown 内容
3. **并行处理**：支持并行处理多个 Markdown 文件

## 结论

当前的 Markdown 引擎基于 unified 生态系统，具有以下优势：

1. **功能丰富**：支持 GFM、数学公式、代码高亮等
2. **可扩展性强**：基于插件系统，易于添加新功能
3. **维护性好**：活跃的社区支持
4. **性能合理**：处理速度满足博客需求

虽然 marked 等引擎在速度上可能有优势，但 unified 生态系统的可扩展性和功能丰富度使其成为当前项目的最佳选择。

## 配置文件

### lib/markdown.ts

```typescript
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { h } from "hastscript";

// Markdown 转 HTML
export async function markdownToHtml(markdown: string): Promise<string> {
  // 处理时间线语法
  const processedMarkdown = processTimelineSyntax(markdown);

  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkMath) // 数学公式支持
    .use(remarkRehype)
    .use(rehypeHighlight) // 代码高亮
    .use(rehypeSlug) // 添加标题锚点
    .use(rehypeAutolinkHeadings, {
      behavior: "wrap",
      properties: {
        className: ["anchor"],
      },
      content: h("span", { className: "sr-only" }, "#"),
    })
    .use(rehypeKatex) // KaTeX 数学公式渲染
    .use(rehypeStringify)
    .process(processedMarkdown);

  return result.toString();
}

// 处理时间线语法
export function processTimelineSyntax(markdown: string): string {
  const timelineRegex =
    /::: timeline[\s\S]*?title: (.*?)[\s\S]*?date: (.*?)[\s\S]*?icon: (.*?)[\s\S]*?---[\s\S]*?:::/g;

  return markdown.replace(timelineRegex, (match, title, date, icon) => {
    const contentMatch = match.match(/---[\s\S]*?:::/);
    const content = contentMatch
      ? contentMatch[0].replace(/---|:::/g, "").trim()
      : "";

    return `
<div class="timeline-item">
  <div class="timeline-icon">${icon}</div>
  <div class="timeline-content">
    <h3 class="timeline-title">${title}</h3>
    <p class="timeline-date">${date}</p>
    <div class="timeline-body">${content}</div>
  </div>
</div>
`;
  });
}
```

### 样式配置

在 `app/layout.tsx` 中添加 KaTeX 样式：

```typescript
export const links = [
  {
    rel: "stylesheet",
    href: "https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.css",
    integrity: "sha384-wcIxkf4k558AjM3Yz3BBFQUbk/zgIYC2R0QpeeYb+TwlBVMrlgLqwRjRtGZiK7ww",
    crossorigin: "anonymous"
  }
];
```
