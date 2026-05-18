# 组件系统模块

## 模块概述

组件系统是 FunRadiusP 的重要组成部分，负责构建用户界面的可复用部分。

### 功能特性

- 服务器组件和客户端组件分离
- 按功能分类的组件结构
- 可复用的 UI 组件
- 完整的国际化支持
- 组件状态管理

## 目录结构

```
components/
├── features/                # 业务功能组件（带 Client 后缀）
│   ├── ArchiveClient.tsx
│   ├── GitHubCard.tsx # GitHub 卡片组件
│   ├── ArchiveYearPageClient.tsx
│   ├── ArticlesPageClient.tsx
│   ├── CategoriesClient.tsx
│   ├── CategoryPageClient.tsx
│   ├── CollectionPageClient.tsx
│   ├── DemoDetailPageClient.tsx
│   ├── DemosClient.tsx
│   ├── DocPageClient.tsx
│   ├── DocsClient.tsx
│   ├── FriendsPageClient.tsx
│   ├── GiscusComments.tsx
│   ├── MomentsClient.tsx
│   ├── MomentsDetailPageClient.tsx
│   ├── MomentsPageWithPaginationClient.tsx
│   ├── MusicPlayer.tsx
│   ├── PostPageClient.tsx
│   ├── TagPageClient.tsx
│   └── TagsClient.tsx
├── i18n/                    # 国际化相关组件
│   ├── I18nText.tsx
│   ├── LanguageToggle.tsx
│   └── TranslatedText.tsx
├── layout/                # 布局相关组件
│   ├── Footer.tsx
│   └── Header.tsx
├── ui/                     # UI 基础组件
│   ├── AnchorHandler.tsx
│   ├── BackToTop.tsx
│   ├── CodeBlockCopy.tsx
│   ├── ColorPicker.tsx
│   ├── ExpandableCover.tsx
│   ├── FriendCard.tsx
│   ├── GlobalDialog.tsx
│   ├── ImageViewer.tsx
│   ├── MarkdownContent.tsx
│   ├── PageTitle.tsx
│   ├── Pagination.tsx
│   ├── ProfileCard.tsx
│   ├── SafeImage.tsx
│   ├── StructuredData.tsx
│   ├── TableOfContents.tsx
│   └── ThemeToggle.tsx
└── widgets/              # 小部件组件
    ├── Live2DWidget.tsx
    ├── Particles.tsx
    └── VisitorGreeting.tsx
```

## 组件类型

### 1. 服务器组件

**定义**: 在服务器端渲染的组件，不需要交互功能

**特点**:

- 可以直接使用 Node.js API
- 不能使用 React Hooks
- 不能使用浏览器 API
- 性能更好，适合静态内容

**示例**:

```typescript
// components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      {/* 页脚内容 */}
    </footer>
  );
}
```

### 2. 客户端组件

**定义**: 在客户端渲染的组件，需要交互功能

**特点**:

- 使用 `'use client'` 指令标记
- 可以使用 React Hooks
- 可以使用浏览器 API
- 适合需要交互的功能

**示例**:

```typescript
// components/ui/BackToTop.tsx
'use client';
import { useState, useEffect } from 'react';

export default function BackToTop() {
  // 组件逻辑
}
```

## 核心组件

### GitHubCard 组件

**路径**: `components/GitHubCard/GitHubCard.tsx`

**功能**: GitHub 用户信息卡片组件，展示用户的 GitHub 个人信息、Stars、Forks、Followers、Total Commits、Repositories、Top Languages 和 Most Popular Repositories

**实现**:

- 客户端组件，使用 `'use client'` 指令
- 从 GitHub API 实时获取用户数据
- localStorage 缓存数据（2小时有效期），避免频繁请求
- 完全支持国际化，6种语言（中文、英文、西班牙语、日语、德语、法语）
- 用户名可通过环境变量 `NEXT_PUBLIC_GITHUB_USERNAME` 配置
- 空值安全：当环境变量为空时，组件不会渲染
- 使用 CSS 变量和内联样式，支持主题切换（明暗主题和颜色切换）
- 响应式设计，适配各种屏幕尺寸
- 样式与项目主题系统保持一致，使用 `var(--primary)`、`var(--secondary)` 等 CSS 变量

### Layout 组件（布局相关）

#### Header 组件

**路径**: `components/layout/Header.tsx

**功能**: 网站导航栏，默认隐藏，鼠标移动到顶部区域时下拉显示，移出时上拉隐藏

**实现**:

- 响应式设计，支持桌面端和移动端
- 默认隐藏，鼠标移动到顶部 100px 范围内时显示
- 使用 `fixed` 定位，`transition-transform` 实现平滑动画（300ms，ease-out）
- 桌面端菜单布局：首页、文章、关于直接显示，其余在"更多"下拉菜单
- 移动端汉堡菜单
- 包含语言切换、颜色选择、主题切换按钮
- 当前页面导航项高亮显示
- 自动隐藏可配置（NEXT_PUBLIC_HEADER_AUTO_HIDE_ENABLED）
- 字体统一使用 MapleMono

#### Footer 组件

**路径**: `components/layout/Footer.tsx

**功能**: 网站页脚，显示版权信息和其他链接

### Features 组件（业务功能）

#### ArticlesPageClient 组件

**路径**: `components/features/ArticlesPageClient.tsx`

**功能**: 文章列表页面的客户端组件

#### ArchiveClient 组件

**路径**: `components/features/ArchiveClient.tsx

**功能**: 文章归档页面的客户端组件

#### ArchiveYearPageClient 组件

**路径**: `components/features/ArchiveYearPageClient.tsx

**功能**: 按年份归档页面的客户端组件

#### CategoriesClient 组件

**路径**: `components/features/CategoriesClient.tsx

**功能**: 分类列表页面的客户端组件

#### CategoryPageClient 组件

**路径**: `components/features/CategoryPageClient.tsx

**功能**: 分类详情页面的客户端组件

#### TagsClient 组件

**路径**: `components/features/TagsClient.tsx

**功能**: 标签列表页面的客户端组件

#### TagPageClient 组件

**路径**: `components/features/TagPageClient.tsx

**功能**: 标签详情页面的客户端组件

#### PostPageClient 组件

**路径**: `components/features/PostPageClient.tsx

**功能**: 文章详情页面的客户端组件

#### MomentsClient 组件

**路径**: `components/features/MomentsClient.tsx

**功能**: 随笔列表页面的客户端组件

#### MomentsDetailPageClient 组件

**路径**: `components/features/MomentsDetailPageClient.tsx

**功能**: 随笔详情页面的客户端组件

#### MomentsPageWithPaginationClient 组件

**路径**: `components/features/MomentsPageWithPaginationClient.tsx

**功能**: 带分页的随笔列表页面的客户端组件

#### DocsClient 组件

**路径**: `components/features/DocsClient.tsx

**功能**: 文档列表页面的客户端组件

#### DocPageClient 组件

**路径**: `components/features/DocPageClient.tsx

**功能**: 文档详情页面的客户端组件

#### CollectionPageClient 组件

**路径**: `components/features/CollectionPageClient.tsx

**功能**: 文档集页面的客户端组件，完全国际化

#### DemosClient 组件

**路径**: `components/features/DemosClient.tsx

**功能**: Demo 列表页面的客户端组件

#### DemoDetailPageClient 组件

**路径**: `components/features/DemoDetailPageClient.tsx

**功能**: Demo 详情页面的客户端组件

#### GiscusComments 组件

**路径**: `components/features/GiscusComments.tsx

**功能**: 评论系统组件，集成 Giscus 评论功能，支持按语言自动切换

#### MusicPlayer 组件

**路径**: `components/features/MusicPlayer.tsx

**功能**: 音乐播放器组件，支持网易云音乐和本地歌曲

**实现**:

- 客户端组件，使用 `'use client'` 指令
- 支持两种音源：网易云音乐（iframe）和本地歌曲（HTML5 audio）
- 可展开/收起设计，点击音乐图标切换显示状态
- 收起时音乐继续播放，不中断
- 主题适配，支持亮色/暗色主题，使用 CSS 变量
- 支持自定义位置配置（top/bottom/left/right）
- 默认位置：`bottom: 40px, left: 40px`

### I18n 组件（国际化相关）

#### LanguageToggle 组件

**路径**: `components/i18n/LanguageToggle.tsx

**功能**: 语言切换组件，支持 6 种语言：中文、英文、西班牙语、日语、德语、法语

**实现**:

- 国旗图标展示
- 下拉菜单选择语言
- localStorage 保存用户语言偏好
- 支持浏览器语言检测

#### I18nText 组件

**路径**: `components/i18n/I18nText.tsx

**功能**: 国际化文本组件，用于展示翻译文本

#### TranslatedText 组件

**路径**: `components/i18n/TranslatedText.tsx

**功能**: 另一个国际化文本组件

### UI 组件（基础 UI）

#### BackToTop 组件

**路径**: `components/ui/BackToTop.tsx

**功能**: 回到顶部按钮，当页面滚动到一定高度时显示

#### Pagination 组件

**路径**: `components/ui/Pagination.tsx

**功能**: 分页组件，用于文章列表等需要分页的页面

#### TableOfContents 组件

**路径**: `components/ui/TableOfContents.tsx

**功能**: 目录组件，根据文章内容生成目录

#### ThemeToggle 组件

**路径**: `components/ui/ThemeToggle.tsx

**功能**: 主题切换组件，支持亮色/暗色主题切换

#### ColorPicker 组件

**路径**: `components/ui/ColorPicker.tsx

**功能**: 主题颜色选择组件，支持 RGB 自定义主题颜色

#### AnchorHandler 组件

**路径**: `components/ui/AnchorHandler.tsx

**功能**: 全局锚点跳转处理组件

**实现**:

- 处理页面初始加载时的锚点
- 使用 CSS `scroll-padding-top` 原生支持

#### CodeBlockCopy 组件

**路径**: `components/ui/CodeBlockCopy.tsx

**功能**: 代码块复制组件，为所有 Markdown 代码块添加一键复制功能

**实现**:

- 自动为所有 `<pre>` 代码块添加复制按钮
- 按钮默认隐藏，鼠标悬停时显示
- 点击后显示绿色对勾图标，2 秒后恢复

#### MarkdownContent 组件

**路径**: `components/ui/MarkdownContent.tsx

**功能**: Markdown 内容渲染组件，统一处理所有 markdown 内容渲染，集成图片查看器

#### ImageViewer 组件

**路径**: `components/ui/ImageViewer.tsx

**功能**: 图片查看器组件，支持点击图片放大查看

**实现**:

- 全屏显示图片
- 支持 ESC 键、点击背景/图片/× 按钮关闭

#### SafeImage 组件

**路径**: `components/ui/SafeImage.tsx

**功能**: 安全图片组件

#### ExpandableCover 组件

**路径**: `components/ui/ExpandableCover.tsx

**功能**: 可展开封面图片组件

#### PageTitle 组件

**路径**: `components/ui/PageTitle.tsx

**功能**: 页面标题组件

#### ProfileCard 组件

**路径**: `components/ui/ProfileCard.tsx

**功能**: 个人信息卡片组件

#### StructuredData 组件

**路径**: `components/ui/StructuredData.tsx

**功能**: 结构化数据组件，用于 SEO

### Widgets 组件（小部件）

#### Live2DWidget 组件

**路径**: `components/widgets/Live2DWidget.tsx

**功能**: Live2D 看板娘组件，展示可爱的 Live2D 模型，支持多模型切换

**实现**:

- 基于 oh-my-live2d 框架
- 支持多模型切换，模型配置在环境变量中使用 JSON 数组格式定义
- 所有模型共用一套配置参数
- 模型路径自动处理为绝对路径，确保在所有页面正常加载
- 使用 window 全局对象存储状态，确保只初始化一次

#### Particles 组件

**路径**: `components/widgets/Particles.tsx

**功能**: 四季飘落特效组件，使用 natural-falling-effect 库实现专业的背景动画效果

**实现**:

- 支持四种特效类型：花瓣、落叶、下雨、下雪
- 支持自动根据季节选择特效类型（auto 模式）
- 通过环境变量配置

#### VisitorGreeting 组件

**路径**: `components/widgets/VisitorGreeting.tsx

**功能**: 访客问候语组件，动态显示用户的操作系统和浏览器信息

**实现**:

- 自动检测用户的操作系统（Windows、macOS、Linux、Android、iOS 等）
- 自动检测用户的浏览器（Chrome、Firefox、Safari、Edge、Opera 等）
- 显示"欢迎，来自 {OS} 的 {Browser} 的您！"
- 上下浮动动画效果（3 秒循环）
- 半透明样式（opacity: 0.7）

## 组件开发最佳实践

### 1. 组件设计原则

- **单一职责**: 每个组件应该只负责一个功能
- **可复用性**: 设计通用的、可复用的组件
- **可维护性**: 保持组件代码简洁、清晰
- **性能优化**: 避免不必要的渲染和计算

### 2. 命名规范

- **组件名称**: 使用 PascalCase（首字母大写）
- **文件名称**: 与组件名称一致，使用 `.tsx` 扩展名
- **变量名称**: 使用 camelCase（小驼峰）
- **目录分类**: 按功能分类到相应目录
  - 业务功能组件 → `features/
  - 国际化组件 → `i18n/`
  - 布局组件 → `layout/`
  - UI 基础组件 → `ui/`
  - 小部件组件 → `widgets/`

### 3. 代码组织

- **组件结构**: 保持组件结构清晰，逻辑分明
- **Props 类型**: 使用 TypeScript 定义 Props 类型
- **注释**: 为复杂组件添加适当的注释
- **分离关注点**: 将逻辑和 UI 分离

### 4. 性能优化

- **避免不必要的渲染**: 使用 `React.memo` 优化组件渲染
- **合理使用 Hooks**: 避免在渲染过程中创建新的函数和对象
- **代码分割**: 按需加载大型组件

## 组件使用示例

### 使用 Header 组件

```typescript
import Header from '@/components/layout/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
```

### 使用 Pagination 组件

```typescript
import Pagination from '@/components/ui/Pagination';

export default function ArticlesPage() {
  return (
    <div>
      {/* 内容 */}
      <Pagination
        currentPage={1}
        totalPages={10}
        baseUrl="/articles"
      />
    </div>
  );
}
```

### 使用 I18nText 组件

```typescript
import I18nText from '@/components/i18n/I18nText';

export default function SomeComponent() {
  return (
    <div>
      <I18nText k="common.home" />
    </div>
  );
}
```

## 常见问题

### 1. 组件不显示

- 检查组件是否正确导入
- 确认组件是否正确导出
- 检查组件渲染条件

### 2. 交互功能不工作

- 确认组件是否标记为客户端组件 (`'use client'`)
- 检查事件处理函数是否正确绑定
- 查看浏览器控制台是否有错误

### 3. 样式问题

- 检查 Tailwind CSS 类是否正确
- 确认样式是否被其他样式覆盖
- 检查浏览器开发者工具中的样式问题

### 4. 性能问题

- 优化组件渲染
- 避免不必要的计算和渲染
- 合理使用 React Hooks
