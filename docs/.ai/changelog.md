# 更新日志

本文件记录 FunRadiusP 项目的所有重要变更。

---

## [2026-05-01]

### 主要变更

- 性能优化：KaTeX 样式按需加载 + 自托管
  - 移除根 layout 全局外链 katex.min.css（jsDelivr，渲染阻塞）
  - 新建 MathStyles 客户端组件：检测页面存在 .katex 元素后动态注入同源 /katex/katex.min.css
  - copy-assets.js 构建时从 node_modules/katex/dist 复制 CSS + 字体到 katex/ 目录
- 性能优化：Live2D 加载策略
  - 锁定 oh-my-live2d 版本 0.19.3，弃用 @latest（改善 CDN 缓存）
  - requestIdleCallback 空闲加载 + 3s 超时兜底
  - 触屏设备（pointer: coarse）不加载看板娘
  - 删除 console.log / console.warn 调试输出
- 性能优化：动态分包
  - 新建 LazyWidgets 客户端组件，next/dynamic + ssr: false 拆分 Live2DWidget 与 Particles
  - 粒子动画（natural-falling-js）不再进首屏 bundle
- 性能优化：Header 事件节流
  - 滚动/鼠标移动处理函数改为 rAF 节流，减少高频 setState
- 文档同步：performance.md 补充实测优化要点；修复 architecture.md 与代码的「动态导入」不一致问题

### 新增文件

- 组件：components/ui/MathStyles.tsx、components/widgets/LazyWidgets.tsx

### 修改文件

- 根布局：app/layout.tsx
- 组件：components/widgets/Live2DWidget.tsx、components/layout/Header.tsx
- 脚本：scripts/copy-assets.js
- 文档：docs/.ai/changelog.md、docs/.ai/best-practices/performance.md

---

## [2026-04-30]

### 主要变更

- 组件透明度功能实现
  - 新增环境变量 `NEXT_PUBLIC_COMPONENT_OPACITY` 控制所有卡片和组件的透明度
  - 透明度范围 0.0（完全透明）到 1.0（完全不透明），默认为 1.0
  - 创建 OpacityHandler 客户端组件，动态设置 CSS 变量 `--component-opacity`
  - 更新所有卡片、导航栏、时间线内容、音乐播放器等组件的样式以支持透明度
  - 使用 `color-mix()` 函数实现背景色透明度混合
  - 保持纯静态导出特性，无后端依赖

- 设备检测逻辑提取
  - 创建 lib/device-detector.ts 文件，集中管理设备检测函数
  - 提取 detectOS() 函数：检测用户操作系统
  - 提取 detectBrowser() 函数：检测用户浏览器类型
  - 提取 detectIsMobile() 函数：检测是否是移动设备
  - VisitorGreeting.tsx 组件现在使用公共的设备检测函数
  - Header.tsx 组件现在使用公共的设备检测函数

- 导航栏移动端显示优化（修复）
  - 修改 Header.tsx 组件，使移动端始终显示导航栏
  - 使用 navigator.userAgent 检测移动端设备，而不是屏幕宽度
  - 移动端关键词包括：android、webos、iphone、ipad、ipod、blackberry、windows phone
  - 环境变量 `NEXT_PUBLIC_HEADER_AUTO_HIDE_ENABLED` 现在只作用于桌面端
  - 桌面端恢复原有的自动隐藏功能，不再是始终显示
  - 更新事件监听逻辑，使用 isMobile 状态判断是否处理自动隐藏功能

- GitHubCard 响应式布局优化
  - 添加移动端适配，在不同屏幕尺寸下正确显示
  - 平板设备（≤768px）：用户信息垂直居中，统计卡片3列布局
  - 手机设备（≤480px）：统计卡片2列布局，仓库列表垂直布局
  - 使用媒体查询和 CSS 类名实现响应式设计

### 新增文件

- 组件：components/ui/OpacityHandler.tsx

### 修改文件

- 配置文件：.env.example
- 全局样式：app/globals.css
- 根布局：app/layout.tsx
- 文档：docs/.ai/changelog.md

---

## [2026-04-30]

### 主要变更

- 设备检测逻辑提取
  - 创建 lib/device-detector.ts 文件，集中管理设备检测函数
  - 提取 detectOS() 函数：检测用户操作系统
  - 提取 detectBrowser() 函数：检测用户浏览器类型
  - 提取 detectIsMobile() 函数：检测是否是移动设备
  - VisitorGreeting.tsx 组件现在使用公共的设备检测函数
  - Header.tsx 组件现在使用公共的设备检测函数

- 导航栏移动端显示优化（修复）
  - 修改 Header.tsx 组件，使移动端始终显示导航栏
  - 使用 navigator.userAgent 检测移动端设备，而不是屏幕宽度
  - 移动端关键词包括：android、webos、iphone、ipad、ipod、blackberry、windows phone
  - 环境变量 `NEXT_PUBLIC_HEADER_AUTO_HIDE_ENABLED` 现在只作用于桌面端
  - 桌面端恢复原有的自动隐藏功能，不再是始终显示
  - 更新事件监听逻辑，使用 isMobile 状态判断是否处理自动隐藏功能

- GitHubCard 响应式布局优化
  - 添加移动端适配，在不同屏幕尺寸下正确显示
  - 平板设备（≤768px）：用户信息垂直居中，统计卡片3列布局
  - 手机设备（≤480px）：统计卡片2列布局，仓库列表垂直布局
  - 使用媒体查询和 CSS 类名实现响应式设计

### 修改文件

- 新建：lib/device-detector.ts
- 组件：components/widgets/VisitorGreeting.tsx、components/layout/Header.tsx、components/features/GitHubCard.tsx
- 文档：docs/.ai/changelog.md

---

## [2026-04-28]

### 主要变更

- GitHubCard 组件主题适配
  - 移除了 CSS Modules 依赖，改用项目主题系统的 CSS 变量
  - 完全支持明暗主题切换和颜色切换
  - 使用 `var(--primary)`、`var(--secondary)`、`var(--text)`、`var(--background)` 等 CSS 变量
  - 使用项目的 `.card` 类保持样式一致性
  - 删除了 `components/GitHubCard/GitHubCard.module.css` 文件
  - 更新了组件文档，说明新的样式实现方式
  - 添加了空值检查：当 `NEXT_PUBLIC_GITHUB_USERNAME` 环境变量为空时，组件不会渲染
  - 组件路径变更：`components/GitHubCard/GitHubCard.tsx` -&gt; `components/features/GitHubCard.tsx`

- GitHubCard 组件国际化
  - 为 GitHubCard 组件添加完整的国际化支持，支持6种语言（中文、英文、西班牙语、日语、德语、法语）
  - 在所有翻译文件中添加 `gitHubCard` 命名空间的翻译键
  - 组件默认用户名从环境变量 `NEXT_PUBLIC_GITHUB_USERNAME` 读取
  - 更新 `.env.example` 添加 `NEXT_PUBLIC_GITHUB_USERNAME` 配置项
  - 更新 `app/about/page.tsx` 移除硬编码的用户名
  - 更新组件文档，在 `docs/.ai/modules/components.md` 中添加 GitHubCard 组件的详细说明

- 友链页面功能完整实现
  - 新增 /friends 页面，展示从 GitHub 公开仓库 JSON 文件动态获取的友链列表
  - 采用客户端获取 + localStorage 缓存方案（缓存有效期 1 小时）
  - 实现友链卡片组件，支持默认（方形头像+名称）和 hover（展开布局）两种状态
  - 头像加载失败时，自动显示名称首字母作为备用头像
  - 纯前端分页，每页显示 24 个卡片
  - 右上角如何添加友链按钮，弹出对话框提供 GitHub Issue、GitHub PR、邮箱三种提交方式
  - 完整支持 6 种语言国际化（中文、英文、西班牙语、日语、德语、法语）
  - 严格遵循纯静态导出规范（output: "export"），无 API 路由或后端依赖

- 友链指导文档创建
  - 创建 docs/friends-guide.md，详细说明如何添加友链
  - 包含数据格式说明、三种提交方式说明、审核标准和常见问题解答

- 项目配置更新
  - 更新 .env.example，新增 NEXT_PUBLIC_FRIENDS_JSON_URL 配置项
  - 默认配置指向 GitHub 仓库的 friends.json 文件

- 导航栏更新
  - 在更多菜单中添加友链链接，位于文档集之前

- AI 开发文档系统性更新
  - 修正项目名称从 FunRadiusP 改为 pblog
  - 更新索引文档 index.md，新增模块文档链接
  - 更新所有核心文档，同步最新项目状态
  - 创建新模块文档：i18n.md、moments.md、docs.md、demos.md
  - 全面梳理和更新组件、页面、架构文档

- 组件目录结构重构
  - 将 components/ 目录下的文件按功能分类整理
  - 创建分层目录结构，提高代码组织性和可维护性

- 调试日志清理
  - 移除 MusicPlayer 组件中的 console.log 调试输出
  - 简化构建时的输出信息

- 文档集页面国际化完善
  - 创建 CollectionPageClient 组件，实现文档集页面的完全国际化
  - 更新 GiscusComments 组件，支持根据语言自动切换 Giscus 评论语言

- 翻译文件补充更新
  - 为所有6种语言添加 docsPage.backToCollections 和 comments.title 翻译键

- 多语言支持扩展至6种语言
  - 新增西班牙语、日语、德语、法语四种语言
  - 现在支持：中文、英文、西班牙语、日语、德语、法语，共6种语言
  - 每种语言都有完整的翻译文件
  - 语言切换组件已更新，支持6种语言的国旗图标和标签

- i18n 系统优化
  - 更新 Language 类型定义，支持6种语言枚举
  - 更新 availableLanguages 数组，包含所有支持的语言
  - 优化浏览器语言检测逻辑，自动匹配支持的语言
  - 所有翻译文件中新增 language.* 翻译键

- 文档集状态确认
  - 确认 /docs/cacatheory/ 文档集完整，包含计算机组成原理教程
  - 文档结构完整：meta.json、summary.md、p1-p6.md，内容格式规范

- 构建验证通过
  - 项目完整构建成功，TypeScript 类型检查全部通过
  - 生成164个静态页面，支持静态导出部署

### 新增文件

- 页面：app/friends/page.tsx
- 组件：components/features/FriendsPageClient.tsx、components/ui/FriendCard.tsx
- 文档：docs/friends-guide.md

### 删除文件

- components/GitHubCard/GitHubCard.module.css

### 修改文件

- 配置文件：.env.example
- 组件：components/features/GitHubCard.tsx、components/features/MusicPlayer.tsx、components/features/GiscusComments.tsx、components/features/CollectionPageClient.tsx（新创建）、app/docs/[collection]/page.tsx
- 页面：app/about/page.tsx
- 翻译：lib/i18n/translations/zh.json、lib/i18n/translations/en.json、lib/i18n/translations/es.json、lib/i18n/translations/ja.json、lib/i18n/translations/de.json、lib/i18n/translations/fr.json
- 工具库：lib/i18n/metadata.ts
- 核心组件：lib/i18n/context.tsx、components/i18n/LanguageToggle.tsx、components/features/DemoDetailPageClient.tsx
- 文档：docs/.ai/modules/components.md、docs/.ai/changelog.md

---

## [2026-04-26]

### 主要变更

- 完善所有页面的 Metadata 国际化支持
  - 扩展 lib/i18n/metadata.ts 工具函数，添加 formatTranslation 和 buildMetadata 函数
  - 添加所有动态路由的专用 Metadata 生成函数
  - 更新所有页面的 Metadata 配置，从根布局到动态路由
  - 统一使用翻译文件配置 Metadata，支持 Open Graph、Twitter Card、alternate 等 SEO 标签
  - 项目保持纯静态导出（output: "export"），所有 164 个页面成功预渲染

- 移除动态详情页中的硬编码文本
  - 替换 moments/detail/[slug]/page.tsx 中的硬编码标题、描述和错误信息
  - 替换 posts/[slug]/page.tsx 中的硬编码错误信息
  - 替换 demos/[slug]/page.tsx 中的硬编码错误信息
  - 替换 docs/[collection]/[slug]/page.tsx 和 docs/[collection]/page.tsx 中的硬编码错误信息
  - 所有翻译文件已更新，支持 6 种语言的完整翻译

- 项目名称修正
  - 确认项目名称为 FunRadiusP，修正所有文档中的项目名称引用
  - package.json 中的 name 字段为 FunRadiusP
  - 所有 AI 开发文档中的项目名称已统一修正

- 静态导出完整支持
  - 修复构建错误，确保项目完全符合 Next.js 静态导出规范
  - 解决客户端组件导入 Node.js 模块（fs/path 等）导致的 Module not found 错误
  - 所有页面已成功预渲染为静态 HTML，共 164 个页面
  - 支持部署到任何静态托管服务

- 服务器/客户端组件分离重构
  - 服务器组件负责数据获取，客户端组件负责界面渲染和国际化
  - DemosClient、DocsClient、TagsClient、CategoriesClient、ArchiveClient、MomentsClient 都通过 props 接收数据
  - TagsClient 组件内联 getTagSize 函数，避免函数序列化问题

- 图片查看器功能完整实现
  - 新增 ImageViewer 全屏图片查看器，支持点击放大
  - 支持 ESC 键、点击背景/图片/× 按钮关闭
  - 创建通用 MarkdownContent 组件，统一处理所有 markdown 内容渲染
  - posts、moments、docs 详情页面都支持图片查看

- moments 重命名完成
  - 所有 musings 相关代码、文件名、路径重命名为 moments

- TypeScript 错误修复
  - 修复 I18nText、MomentsClient、moments/page.tsx 等组件类型问题
  - 所有 TypeScript 类型检查通过

### 修改文件

- 工具库：lib/i18n/metadata.ts
- 翻译：lib/i18n/translations/zh.json、lib/i18n/translations/en.json、lib/i18n/translations/es.json、lib/i18n/translations/ja.json、lib/i18n/translations/de.json、lib/i18n/translations/fr.json
- 页面：app/layout.tsx、app/about/page.tsx、app/archive/page.tsx、app/archive/[year]/page.tsx、app/articles/page.tsx、app/articles/[page]/page.tsx、app/categories/page.tsx、app/categories/[slug]/page.tsx、app/demos/page.tsx、app/demos/[slug]/page.tsx、app/docs/page.tsx、app/docs/[collection]/page.tsx、app/docs/[collection]/[slug]/page.tsx、app/information/page.tsx、app/journey/page.tsx、app/moments/page.tsx、app/moments/detail/[slug]/page.tsx、app/moments/page/[page]/page.tsx、app/posts/[slug]/page.tsx、app/projects/page.tsx、app/tags/page.tsx、app/tags/[slug]/page.tsx、app/page.tsx
- 组件：components/features/ArchiveClient.tsx、components/features/CategoriesClient.tsx、components/features/DemosClient.tsx、components/features/DocsClient.tsx、components/i18n/I18nText.tsx、components/ui/ImageViewer.tsx、components/ui/MarkdownContent.tsx、components/features/MomentsClient.tsx、components/features/TagsClient.tsx

---

## [2026-04-27]

### 主要变更

- 国际化（多语言）功能完整实现
  - 新增 LanguageProvider 和 useLanguage Hook，使用 Context API 管理语言状态
  - 创建中英文翻译文件，支持模块化组织
  - 新增 LanguageToggle 语言切换组件，支持中英文切换，带国旗图标
  - 语言切换按钮位于导航栏，精确放置在颜色按钮和主题切换按钮之间
  - 所有界面硬编码文本已提取到翻译文件中
  - 支持 localStorage 保存用户语言偏好，首次访问根据浏览器语言自动设置
  - 支持环境变量 NEXT_PUBLIC_DEFAULT_LANGUAGE 配置默认语言

- 组件国际化改造
  - Header、ThemeToggle、ColorPicker、Footer、Pagination、BackToTop 等组件已完成国际化
  - CodeBlockCopy、VisitorGreeting、NotFound 组件已完成国际化

- 配置文件更新
  - 更新 .env.example，新增 NEXT_PUBLIC_DEFAULT_LANGUAGE 配置项
  - 支持配置默认语言为 zh（中文）或 en（英文）

- 项目架构可扩展
  - 翻译系统设计支持未来添加新语言，只需新增翻译文件并在 availableLanguages 中注册即可

### 修改文件

- 翻译文件：lib/i18n/translations/zh.json、lib/i18n/translations/en.json
- 核心组件：lib/i18n/context.tsx、components/i18n/LanguageToggle.tsx、components/features/DemoDetailPageClient.tsx

---

## [2026-04-25]

### 主要变更

- 随笔功能完整实现
  - 完成 lib/musings.ts 数据处理模块
  - 实现列表页（分页10条）、详情页（Giscus评论）
  - 支持有图/无图布局，最多显示6张图片
  - 纯静态实现，资源复制脚本更新

- 随笔界面优化
  - 时间显示优化（到分钟）
  - 图片自适应布局（1/2/3列布局）
  - hover 缩放效果（scale-105，duration-300）

- Markdown 支持
  - 支持完整 Markdown、危险 HTML、GFM、Callout
  - 支持相对路径图片自动转换

- 内容折叠功能
  - 使用纯 CSS max-height:150px 方案
  - 添加渐变遮罩和更多提示

---

## [2026-04-11]

### 主要变更

- 导航栏隐藏逻辑优化
  - 立即隐藏，菜单展开保持显示
  - 根据配置定位目录，修复滚动问题
  - 移动端触摸事件支持

- 文档集功能完整实现
  - lib/docs.ts 数据处理，导航/详情/阅读页
  - 全宽度布局，左右侧栏靠边停靠
  - Markdown 相对路径资源支持

- README 重构
  - 配置整合到统一配置章节，分类管理

---

## [2026-04-10]

### 主要变更

- 主题颜色完整重构
  - RGB 自定义主题颜色，全局兼容
  - 改用 CSS 变量 + 自定义 Tailwind 工具类

- 音乐播放器功能
  - 网易云音乐/本地歌曲播放器
  - autoPlay 配置修复

- RSS 功能实现
  - RSS feed 生成
  - SEO 完善与修复

---

## [2026-04-09]

### 主要变更

- Demo 功能模块、导航菜单迭代、SEO 优化、背景层级重构、404 页面背景修复、导航菜单最终设计与暗色主题适配

---

## 变更类型说明

- 新增功能：新功能或特性
- 修复 Bug：修复问题或错误
- 文档更新：文档相关变更
- 配置变更：配置文件或设置调整
- 重构：代码重构，不改变功能
- 性能优化：性能相关优化
