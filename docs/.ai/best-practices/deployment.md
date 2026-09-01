# 部署最佳实践

## 部署环境

### 1. 云服务提供商

| 提供商 | 特点 | 适用场景 |
|-------|------|----------|
| Vercel | 官方推荐，集成度高 | 快速部署，无需配置 |
| Netlify | 简单易用，功能丰富 | 静态网站部署 |
| Cloudflare Pages | 全球 CDN，速度快 | 全球访问优化 |
| GitHub Pages | 免费，与 GitHub 集成 | 个人项目和小型网站 |

### 2. 服务器环境

| 环境 | 特点 | 适用场景 |
|------|------|----------|
| VPS | 完全控制，可定制性高 | 大型项目，需要自定义配置 |
| Docker | 容器化，环境一致性 | 复杂项目，多环境部署 |
| Serverless | 无服务器，按需付费 | 流量波动大的项目 |

## 部署流程

### 1. 构建项目

```bash
# 构建生产版本（自动运行 prebuild 生成重定向页面）
npm run build

# 检查构建输出
ls -la output/
```

#### 重定向系统

构建时 `prebuild` 自动执行 `scripts/build-all-redirects.js`，生成：
- **自动重定向**：`/p/{短码}/index.html` → `/posts/{文章文件夹}/`
- **自定义重定向**：`/{自定义短码}/index.html` → 用户指定目标

映射表存储在 `.redirects/` 目录（已 gitignore），不对外暴露。如需自定义映射，编辑根目录 `redirect-custom.json`。

### 2. 部署到 Vercel

#### 步骤

1. **创建 Vercel 账户**：访问 [Vercel](https://vercel.com) 创建账户
2. **导入项目**：从 GitHub、GitLab 或 Bitbucket 导入项目
3. **配置项目**：
   - 框架预设：Next.js
   - 构建命令：`npm run build`
   - 输出目录：`output`
   - 环境变量：根据需要配置
4. **部署**：点击 "Deploy" 按钮开始部署
5. **访问**：部署完成后，Vercel 会提供一个域名访问网站

#### 优势

- 自动集成 Git 工作流
- 自动 SSL 证书
- 全球 CDN 加速
- 零配置部署

### 3. 部署到 Netlify

#### 步骤

1. **创建 Netlify 账户**：访问 [Netlify](https://netlify.com) 创建账户
2. **导入项目**：从 GitHub、GitLab 或 Bitbucket 导入项目
3. **配置项目**：
   - 构建命令：`npm run build`
   - 发布目录：`output`
   - 环境变量：根据需要配置
4. **部署**：点击 "Deploy site" 按钮开始部署
5. **访问**：部署完成后，Netlify 会提供一个域名访问网站

#### 优势

- 简单易用的界面
- 自动 SSL 证书
- 全球 CDN 加速
- 丰富的插件生态

### 4. 部署到 Cloudflare Pages

#### 步骤

1. **创建 Cloudflare 账户**：访问 [Cloudflare](https://cloudflare.com) 创建账户
2. **创建 Pages 项目**：在 Cloudflare 仪表板中创建 Pages 项目
3. **导入项目**：从 GitHub 或 GitLab 导入项目
4. **配置项目**：
   - 框架预设：Next.js
   - 构建命令：`npm run deploy`
   - 输出目录：`output`
   - 环境变量：根据需要配置
5. **部署**：点击 "Save and Deploy" 按钮开始部署
6. **访问**：部署完成后，Cloudflare Pages 会提供一个域名访问网站

#### 优势

- 全球 CDN 加速
- 自动 SSL 证书
- 边缘计算支持
- 与 Cloudflare 其他服务集成

### 5. 部署到 GitHub Pages

#### 步骤

1. **配置 GitHub 仓库**：确保项目已推送到 GitHub 仓库
2. **创建 GitHub Actions 工作流**：在 `.github/workflows/` 目录创建部署工作流文件
3. **配置工作流**：
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches:
         - main

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Setup Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '18'
         - name: Install dependencies
           run: npm install
         - name: Build
           run: npm run build
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: .next/static
   ```
4. **推送代码**：将工作流文件推送到 GitHub
5. **启用 GitHub Pages**：在仓库设置中启用 GitHub Pages，选择 `gh-pages` 分支
6. **访问**：部署完成后，GitHub Pages 会提供一个域名访问网站

#### 优势

- 免费使用
- 与 GitHub 集成
- 适合个人项目和小型网站

## 环境配置

### 1. 环境变量

#### 配置文件

| 文件名 | 环境 | 用途 |
|-------|------|------|
| `.env.local` | 本地开发 | 本地环境变量 |
| `.env.development` | 开发环境 | 开发环境变量 |
| `.env.production` | 生产环境 | 生产环境变量 |

#### 示例配置

```env
# 评论系统配置
GISCUS_REPO=your-repo
GISCUS_REPO_ID=your-repo-id
GISCUS_CATEGORY=your-category
GISCUS_CATEGORY_ID=your-category-id

# 其他环境变量
API_URL=https://api.example.com
```

### 2. 构建配置

#### Next.js 配置

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

#### 构建命令

```bash
# 构建生产版本
npm run build

# 导出静态网站（如果需要）
npm run export
```

## CI/CD 配置

### 1. GitHub Actions

#### 基本配置

```yaml
name: CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Type check
        run: npx tsc --noEmit
      - name: Build
        run: npm run build

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
```

### 2. GitLab CI/CD

#### 基本配置

```yaml
stages:
  - build
  - deploy

build:
  stage: build
  image: node:18
  script:
    - npm install
    - npx tsc --noEmit
    - npm run build
  artifacts:
    paths:
      - .next

deploy:
  stage: deploy
  image: node:18
  script:
    - npm install
    - npm run build
    - npx vercel --prod
  environment:
    name: production
  only:
    - main
```

## 监控和维护

### 1. 监控工具

| 工具 | 功能 | 适用场景 |
|------|------|----------|
| Vercel Analytics | 流量分析，性能监控 | Vercel 部署 |
| Google Analytics | 流量分析，用户行为 | 所有部署 |
| New Relic | 应用性能监控 | 复杂应用 |
| Sentry | 错误监控，异常追踪 | 所有应用 |

### 2. 日志管理

- **服务器日志**：监控服务器运行状态
- **应用日志**：记录应用运行情况
- **错误日志**：追踪和分析错误
- **访问日志**：分析用户访问模式

### 3. 定期维护

- **依赖更新**：定期更新依赖包
- **安全检查**：检查安全漏洞
- **性能优化**：优化应用性能
- **备份**：定期备份数据和代码

## 最佳实践

### 1. 部署前检查

- [ ] 运行类型检查：`npx tsc --noEmit`
- [ ] 运行构建：`npm run build`
- [ ] 检查环境变量配置
- [ ] 测试关键功能

### 2. 部署策略

- **蓝绿部署**：减少 downtime
- **滚动部署**：逐步更新
- **金丝雀部署**：先部署到部分用户
- **回滚策略**：准备回滚方案

### 3. 性能优化

- **CDN 配置**：启用全球 CDN
- **缓存策略**：合理配置缓存
- **压缩**：启用 Gzip 或 Brotli 压缩
- **预加载**：预加载关键资源

### 4. 安全最佳实践

- **SSL 证书**：使用 HTTPS
- **CORS 配置**：正确配置 CORS
- **内容安全策略**：配置 CSP
- **安全头**：设置安全相关的 HTTP 头

## 常见问题

### 1. 部署失败

- 检查构建命令是否正确
- 确认依赖是否正确安装
- 检查环境变量配置
- 查看部署日志中的错误信息

### 2. 页面 404

- 检查路由配置是否正确
- 确认静态文件是否正确生成
- 检查服务器配置是否正确

### 3. 性能问题

- 优化图片大小和格式
- 减少不必要的依赖
- 启用 CDN 和缓存
- 优化代码和资源

### 4. 安全问题

- 检查依赖包的安全漏洞
- 配置适当的安全头
- 实现输入验证和输出转义
- 使用 HTTPS 传输数据
