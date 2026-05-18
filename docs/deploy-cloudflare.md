# Cloudflare Pages 部署指南

## 前置准备

1. 将代码推送到 GitHub 仓库
2. 确保项目有 `package.json` 和 `npm run build` 命令
3. 确认 `next.config.js` 配置了静态导出

## 部署步骤

### 1. 在 Cloudflare Pages 中创建新项目

1. 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 点击 "Create a project"
3. 选择 "Connect to Git"
4. 选择你的 GitHub 仓库

### 2. 配置构建设置

在 "Build settings" 页面配置以下内容：

- **Project name**: 你的项目名称（例如：FunRadiusP）
- **Production branch**: main 或 master
- **Framework preset**: Next.js (Static HTML Export)
- **Build command**: `npm run build`
- **Build output directory**: `output`

### 3. 配置环境变量（可选）

在 "Environment variables" 部分添加以下环境变量：

#### Giscus 评论系统配置

如果需要使用 Giscus 评论系统：

```
NEXT_PUBLIC_GISCUS_REPO=你的仓库地址
NEXT_PUBLIC_GISCUS_REPO_ID=你的仓库ID
NEXT_PUBLIC_GISCUS_CATEGORY=你的分类名称
NEXT_PUBLIC_GISCUS_CATEGORY_ID=你的分类ID
```

这些值可以从 [giscus.app](https://giscus.app/) 获取。

#### Live2D 看板娘配置

如果需要使用 Live2D 看板娘功能：

```
NEXT_PUBLIC_LIVE2D_MODELS=["live2d/chuixue_3/chuixue_3.model3.json","live2d/dujiaoshou_4/dujiaoshou_4.model3.json","live2d/ice-girl/ice-girl-model/IceGirl.model3.json"]
NEXT_PUBLIC_LIVE2D_DOCKED_POSITION=right
NEXT_PUBLIC_LIVE2D_POSITION=[0, 60]
NEXT_PUBLIC_LIVE2D_SCALE=0.08
NEXT_PUBLIC_LIVE2D_STAGE_HEIGHT=450
```

**注意事项**：
- `NEXT_PUBLIC_LIVE2D_MODELS` 是 JSON 数组格式，包含所有模型的路径
- 模型文件需要放在 `public/live2d/` 目录下
- 所有模型共用 position、scale、stageHeight 配置
- 确保 JSON 格式正确，不要有多余的空格或换行

### 4. 部署

点击 "Save and Deploy" 开始部署。

## 本地 .env 文件配置

在项目根目录创建 `.env.local` 文件（不要提交到 Git）：

```env
# Giscus 评论系统配置
NEXT_PUBLIC_GISCUS_REPO=your-username/your-repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id

# Live2D 看板娘配置
# 模型路径：可以使用本地路径或远程URL，JSON数组格式
NEXT_PUBLIC_LIVE2D_MODELS=["live2d/chuixue_3/chuixue_3.model3.json","live2d/dujiaoshou_4/dujiaoshou_4.model3.json","live2d/ice-girl/ice-girl-model/IceGirl.model3.json","live2d/heitaizi_2/heitaizi_2.model3.json","live2d/xixuegui_4/xixuegui_4.model3.json","live2d/lafei_4/lafei_4.model3.json","live2d/xianghe_2/xianghe_2.model3.json"]
# 模型停靠位置：left 或 right
NEXT_PUBLIC_LIVE2D_DOCKED_POSITION=right
# 模型位置：[x, y]
NEXT_PUBLIC_LIVE2D_POSITION=[0, 60]
# 模型缩放：默认0.08
NEXT_PUBLIC_LIVE2D_SCALE=0.08
# 舞台高度：默认450
NEXT_PUBLIC_LIVE2D_STAGE_HEIGHT=450
```

## 注意事项

1. `.env.local` 文件应该添加到 `.gitignore` 中
2. Cloudflare Pages 的环境变量需要在部署前配置
3. 每次修改环境变量后需要重新部署
4. 确保 `next.config.js` 中有正确的静态导出配置
5. **构建输出目录**：当前配置构建产物输出到 `output/` 目录（在 next.config.js 中配置了 `distDir: 'output'`）

## 常见问题

### 依赖冲突问题

如果在 Cloudflare Pages 部署时遇到 npm 依赖冲突错误（如 ERESOLVE 错误），有以下解决方案：

#### 方案 1：更新依赖版本（推荐）

确保 package.json 中的依赖版本兼容。例如：

- `eslint-config-next@16.2.2` 需要 `eslint@>=9.0.0`，所以 eslint 版本应该是 `^10` 而不是 `^8`。

**重要**：更新 package.json 后，必须在本地运行 `npm install` 来同步 package-lock.json，然后提交到 Git。

#### 方案 2：使用 --legacy-peer-deps

在 Cloudflare Pages 的构建设置中，将构建命令修改为：

```
npm install --legacy-peer-deps && npm run build
```

或者在 Cloudflare Pages 项目的环境变量中添加：

```
NPM_FLAGS=--legacy-peer-deps
```

### package-lock.json 同步问题

如果在部署时遇到以下错误：

```
npm error `npm ci` can only install packages when your package.json and package-lock.json or npm-shrinkwrap.json are in sync.
```

**解决方案**：

1. 在本地运行 `npm install` 更新 package-lock.json
2. 将更新后的 package-lock.json 提交到 Git
3. 重新触发部署

## next.config.js 配置示例

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};
module.exports = nextConfig;
```
