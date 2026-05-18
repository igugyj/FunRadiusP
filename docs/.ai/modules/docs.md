# 文档系统模块

## 模块概述

文档系统模块是 FunRadiusP 的重要组成部分，提供结构化文档展示和管理功能，支持文档集组织、目录导航和文档阅读。

### 功能特性

- 支持文档集（Collection）组织文档
- 支持嵌套目录结构
- 支持文档排序
- 支持文档草稿状态
- 自动生成文档目录导航
- 上一篇/下一篇导航
- Markdown 渲染支持
- 相对路径图片支持

## 目录结构

```
content/docs/
├── collection-1/        # 文档集 1
│   ├── meta.json        # 文档集元数据
│   ├── introduction.md  # 文档 1
│   ├── getting-started.md # 文档 2
│   └── assets/          # 资源文件
│       └── image.png
└── collection-2/        # 文档集 2
    ├── meta.json
    └── ...
```

## 类型定义

```typescript
export interface Doc {
  id: string;
  title: string;
  description: string;
  collection: string;
  order: number;
  draft: boolean;
  content: string;
  filePath: string;
}

export interface DocCollection {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
  docs: Doc[];
}
```

## 文档格式

### 文档集元数据 (meta.json)

```json
{
  "title": "文档集标题",
  "description": "文档集描述",
  "icon": "",
  "order": 1,
  "published": true
}
```

**字段说明**:
- `title`: 文档集标题
- `description`: 文档集描述
- `icon`: 文档集图标，使用 emoji 或图片
- `order`: 排序序号
- `published`: 是否发布

### 文档文件 (index.md)

```markdown
---
title: 文档标题
description: 文档描述
order: 1
draft: false
---

# 文档标题

这里是文档内容...

## 二级标题

更多内容...
```

**Frontmatter 字段**:
- `title`: 文档标题
- `description`: 文档描述
- `order`: 排序序号
- `draft`: 是否为草稿（true 的话不显示）

## 核心 API

### getDocCollections()

**路径**: `lib/docs.ts

**功能**: 获取所有文档集

**返回值**: `DocCollection[]`

**使用示例**:

```typescript
import { getDocCollections } from '@/lib/docs';

const collections = getDocCollections();
```

### getDocCollection(id: string)

**路径**: `lib/docs.ts

**功能**: 根据 ID 获取单个文档集

**参数**:
- `id`: 文档集 ID

**返回值**: `DocCollection | null`

**使用示例**:

```typescript
import { getDocCollection } from '@/lib/docs';

const collection = getDocCollection('my-collection');
```

### getDoc(collectionId: string, docId: string)

**路径**: `lib/docs.ts

**功能**: 获取特定文档集的特定文档

**参数**:
- `collectionId`: 文档集 ID
- `docId`: 文档 ID

**返回值**: `Doc | null`

**使用示例**:

```typescript
import { getDoc } from '@/lib/docs';

const doc = getDoc('my-collection', 'introduction');
```

### getPrevNextDocs(collection: DocCollection, currentDocId: string)

**路径**: `lib/docs.ts

**功能**: 获取上一篇/下一篇文档

**参数**:
- `collection`: 文档集对象
- `currentDocId`: 当前文档 ID

**返回值**: 
```typescript
{
  prev: Doc | null;
  next: Doc | null;
}
```

**使用示例**:

```typescript
import { getDocCollection, getPrevNextDocs } from '@/lib/docs';

const collection = getDocCollection('my-collection');
if (collection) {
  const { prev, next } = getPrevNextDocs(collection, 'introduction');
}
```

## 相关组件

### DocsClient 组件

**路径**: `components/features/DocsClient.tsx

**功能**: 文档列表页面的客户端组件

### DocPageClient 组件

**路径**: `components/features/DocPageClient.tsx

**功能**: 文档详情页面的客户端组件

### CollectionPageClient 组件

**路径**: `components/features/CollectionPageClient.tsx

**功能**: 文档集页面的客户端组件

## 最佳实践

### 1. 文档组织

- 将相关的文档组织在同一个文档集中
- 使用合理的目录结构
- 为每个文档集提供清晰的描述

### 2. 文档排序

- 使用 order 字段控制文档显示顺序
- 文档按 order 从小到大排列
- 默认 order 为 999

### 3. 草稿状态

- 使用 draft: true 隐藏未完成的文档
- 草稿文档不会在列表中显示
- 草稿文档不会被包含在静态生成中

### 4. 图片使用

- 将图片放在 assets 子目录中
- 使用相对路径引用图片
- 图片会被自动复制到 output 目录

## 常见问题

### 1. 文档不显示

- 检查 draft 是否设置为 false
- 确认文档集的 published 是否为 true
- 检查文档文件是否在正确的位置

### 2. 图片不显示

- 检查图片路径是否正确
- 确认图片文件存在
- 使用相对路径引用图片

