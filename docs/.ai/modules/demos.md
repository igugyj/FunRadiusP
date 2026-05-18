# 演示系统模块

## 模块概述

演示系统模块是 FunRadiusP 的重要组成部分，提供交互式 Demo 展示功能，支持 iframe 嵌入展示和独立访问。

### 功能特性

- Demo 列表展示
- iframe 嵌入展示
- 支持独立 HTML 页面访问
- meta.json 元数据配置
- 支持 assets 资源文件
- 发布状态控制
- 标签分类
- 按日期排序

## 目录结构

```
content/demos/
├── demo-1/          # Demo 1
│   ├── meta.json   # 元数据配置
│   ├── demo.html   # Demo 主页面（必需）
│   ├── show.html   # 展示页面（可选，优先使用）
│   └── assets/      # 资源文件
│       ├── style.css
│       └── script.js
└── demo-2/          # Demo 2
    └── ...
```

## 类型定义

```typescript
export interface Demo {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
  published: boolean;
  hasDemoHtml: boolean;
  hasShowHtml: boolean;
  assets: string[];
}
```

## Demo 格式

### 元数据配置 (meta.json)

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

**字段说明**:
- `title`: Demo 标题
- `description`: Demo 描述
- `tags`: 标签数组
- `author`: 作者
- `date`: 发布日期
- `published`: 是否发布（false 时不显示）

### HTML 文件

**demo.html (必需)**: 主 Demo 页面

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Demo</title>
  <link rel="stylesheet" href="assets/style.css">
</head>
<body>
  <h1>Hello Demo!</h1>
  <script src="assets/script.js"></script>
</body>
</html>
```

**show.html (可选)**: 专门用于展示的页面，优先使用

## 文件命名规范

- 使用 `demo.html` 而不是 `index.html`，避免构建后路由冲突
- 系统也兼容 `index.html`，构建时会自动重命名为 `demo.html`
- `show.html` 优先用于页面展示

## 核心 API

### getDemos()

**路径**: `lib/demos.ts

**功能**: 获取所有 Demo（过滤未发布的）

**返回值**: `Demo[]`，按日期倒序排列

**使用示例**:

```typescript
import { getDemos } from '@/lib/demos';

const demos = getDemos();
```

### getDemoById(id: string)

**路径**: `lib/demos.ts

**功能**: 根据 ID 获取单个 Demo

**参数**:
- `id`: Demo ID

**返回值**: `Demo | null`

**使用示例**:

```typescript
import { getDemoById } from '@/lib/demos';

const demo = getDemoById('my-demo');
```

### getDemoHtmlContent(id: string, type?: "demo" | "show")

**路径**: `lib/demos.ts

**功能**: 获取 Demo 的 HTML 内容

**参数**:
- `id`: Demo ID
- `type`: 类型，"demo" 或 "show"（默认 "demo"）

**返回值**: `string | null`

**使用示例**:

```typescript
import { getDemoHtmlContent } from '@/lib/demos';

const html = getDemoHtmlContent('my-demo', 'show');
```

## 相关组件

### DemosClient 组件

**路径**: `components/features/DemosClient.tsx

**功能**: Demo 列表页面的客户端组件

### DemoDetailPageClient 组件

**路径**: `components/features/DemoDetailPageClient.tsx

**功能**: Demo 详情页面的客户端组件

## 构建脚本

项目提供了自动复制 Demo 资源的脚本：

- **生产环境**: `scripts/copy-demos.js`
- **开发环境**: `scripts/copy-demos-dev.js`

这些脚本会在构建时自动将 Demo 资源复制到正确的位置。

## 最佳实践

### 1. HTML 文件

- 使用相对路径引用资源
- 确保 HTML 文件完整，包括头部和样式
- 添加必要的 meta 标签

### 2. 资源管理

- 将 CSS、JS、图片等资源放在 assets 目录中
- 使用子目录组织资源
- 确保资源路径正确

### 3. 元数据

- 完整填写 meta.json
- 使用有意义的标签
- 提供清晰的描述

### 4. 发布控制

- 使用 published: false 隐藏未完成的 Demo
- 可以随时发布草稿
- 按日期倒序显示，最新的在最前面

## 常见问题

### 1. Demo 不显示

- 检查 published 是否设置为 true
- 确认 demo.html 文件存在
- 检查 meta.json 格式是否正确

### 2. 资源文件不加载

- 检查资源路径是否正确
- 确认资源文件存在
- 使用相对路径引用资源
- 查看构建后资源是否被正确复制

### 3. iframe 显示问题

- 检查 HTML 文件是否完整
- 确认没有 CSP 限制
- 使用 show.html 提供专门的展示版本

