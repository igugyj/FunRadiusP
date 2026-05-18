# 随笔系统模块

## 模块概述

随笔系统模块是 FunRadiusP 的重要组成部分，提供简短、图文并茂的内容展示功能，类似于朋友圈或微博。

### 功能特性

- 支持 Markdown 内容
- 支持多图片展示
- 自动图片查看器
- 内容折叠效果
- 按时间倒序排列
- 支持草稿状态
- 图片路径自动处理

## 目录结构

```
content/moments/
├── moment-1/          # 随笔 1
│   ├── index.md      # 随笔内容
│   ├── photo1.jpg    # 图片 1
│   ├── photo2.jpg    # 图片 2
│   └── assets/        # 可选的资源目录
│       └── ...
└── moment-2/          # 随笔 2
    └── index.md
```

## 类型定义

```typescript
export interface Moment {
  id: string;
  time: string;
  content: string;
  photos: string[];
  draft: boolean;
}
```

## 随笔格式

### 内容文件 (index.md)

```markdown
---
time: 2024-01-15T14:30:00Z
draft: false
photos:
  - photo1.jpg
  - assets/photo2.png
---

今天天气真好！

出去逛了一圈，拍了一些照片。

这是第一篇随笔。
```

**Frontmatter 字段**:
- `time`: 发布时间，ISO 8601 格式
- `draft`: 是否为草稿（true 的话不显示）
- `photos`: 图片列表，支持相对路径

## 图片路径处理

系统会自动处理图片路径，支持：

1. **直接在随笔目录下的图片**: `photo.jpg` → `/moments/moment-id/photo.jpg`
2. **在 assets 子目录下的图片**: `assets/photo.jpg` → `/moments/moment-id/assets/photo.jpg`
3. **网络图片**: 直接使用 URL
4. **绝对路径**: 直接使用

## 核心 API

### getMoments()

**路径**: `lib/moments.ts

**功能**: 获取所有随笔（过滤草稿）

**返回值**: `Moment[]`，按时间倒序排列

**使用示例**:

```typescript
import { getMoments } from '@/lib/moments';

const moments = getMoments();
```

### getMomentById(id: string)

**路径**: `lib/moments.ts

**功能**: 根据 ID 获取单个随笔

**参数**:
- `id`: 随笔 ID

**返回值**: `Moment | null`

**使用示例**:

```typescript
import { getMomentById } from '@/lib/moments';

const moment = getMomentById('my-moment');
```

## 相关组件

### MomentsClient 组件

**路径**: `components/features/MomentsClient.tsx

**功能**: 随笔列表页面的客户端组件

### MomentsDetailPageClient 组件

**路径**: `components/features/MomentsDetailPageClient.tsx

**功能**: 随笔详情页面的客户端组件

### MomentsPageWithPaginationClient 组件

**路径**: `components/features/MomentsPageWithPaginationClient.tsx

**功能**: 带分页的随笔列表页面的客户端组件

### ImageViewer 组件

**路径**: `components/ui/ImageViewer.tsx

**功能**: 图片查看器组件

## 最佳实践

### 1. 图片管理

- 建议将图片放在随笔目录下或 assets 子目录中
- 使用描述性的文件名
- 支持 JPG、PNG、WebP 等格式

### 2. 内容长度

- 随笔内容建议简短，不超过 500 字
- 可以使用 Markdown 格式
- 支持 Emoji 增加趣味性

### 3. 时间格式

- 使用 ISO 8601 格式（YYYY-MM-DDTHH:mm:ssZ）
- 按时间倒序显示
- 最新的随笔在最前面

### 4. 草稿状态

- 使用 draft: true 隐藏未完成的随笔
- 草稿随笔不会在列表中显示
- 可以随时发布草稿

## 常见问题

### 1. 随笔不显示

- 检查 draft 是否设置为 false
- 确认文件是否在正确的位置
- 检查 index.md 文件是否存在

### 2. 图片不显示

- 检查图片路径是否正确
- 确认图片文件存在
- 使用相对路径引用图片
- 查看构建后图片是否被正确复制

### 3. 图片查看器不工作

- 确认 MarkdownContent 组件被正确使用
- 检查是否正确集成了 ImageViewer 组件

