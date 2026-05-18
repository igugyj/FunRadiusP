# Tailwind CSS 配置文档

## 配置概述

Tailwind CSS 是 FunRadiusP 使用的 CSS 框架，提供了实用优先的样式解决方案。

## 配置文件

Tailwind CSS 配置文件位于项目根目录的 `tailwind.config.js`。

### 基本配置

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        dark: '#1e293b',
        light: '#f8fafc',
        muted: '#94a3b8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};
```

## 核心配置项

### 内容配置

`content` 数组指定了 Tailwind 应该扫描哪些文件来提取类名：

```javascript
content: [
  './app/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
],
```

### 主题配置

`theme` 配置用于自定义 Tailwind 的默认主题：

#### 颜色配置

| 颜色名称 | 值 | 用途 |
|---------|-----|------|
| `primary` | `#3b82f6` | 主色调，用于链接、按钮等 |
| `secondary` | `#64748b` | 次要颜色，用于辅助元素 |
| `dark` | `#1e293b` | 深色，用于文本等 |
| `light` | `#f8fafc` | 浅色，用于背景等 |
| `muted` | `#94a3b8` | -muted 颜色，用于次要文本 |

#### 字体配置

```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
},
```

#### 阴影配置

```javascript
boxShadow: {
  card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
},
```

## 自定义工具类

### 全局样式

在 `app/globals.css` 文件中，我们可以添加自定义工具类：

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --primary: #3b82f6;
  --secondary: #64748b;
  --dark: #1e293b;
  --light: #f8fafc;
  --muted: #94a3b8;
  --card-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

body {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', system-ui, sans-serif;
}

main {
  flex: 1;
}

footer {
  margin-top: auto;
}

.card {
  @apply bg-white rounded-lg shadow-card p-6;
}

.text-primary {
  @apply text-blue-500;
}

.text-muted {
  @apply text-slate-400;
}

.hover:text-primary {
  @apply hover:text-blue-500;
}

.hover:text-dark {
  @apply hover:text-slate-800;
}

.transition-colors {
  @apply transition-colors duration-300;
}
```

### 组件样式

可以为特定组件创建自定义样式：

```css
/* 导航栏样式 */
.navbar {
  @apply bg-white shadow-md py-4;
}

/* 按钮样式 */
.btn {
  @apply px-4 py-2 rounded-md font-medium transition-colors;
}

.btn-primary {
  @apply bg-primary text-white hover:bg-blue-600;
}

.btn-secondary {
  @apply bg-secondary text-white hover:bg-slate-600;
}
```

## 最佳实践

### 1. 使用语义化类名

使用具有语义意义的类名，提高代码可读性：

```jsx
// 好的做法
<button className="btn btn-primary">提交</button>

// 不推荐的做法
<button className="px-4 py-2 bg-blue-500 text-white rounded-md">提交</button>
```

### 2. 合理使用响应式类

使用 Tailwind 的响应式类，确保页面在不同设备上都能正常显示：

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 内容 */}
</div>
```

### 3. 避免过度使用自定义样式

尽可能使用 Tailwind 的内置类，避免过度使用自定义样式：

```jsx
// 好的做法
<div className="flex items-center justify-between">
  {/* 内容 */}
</div>

// 不推荐的做法
<div className="custom-flex">
  {/* 内容 */}
</div>
```

### 4. 使用主题配置

对于重复使用的颜色、字体等，使用主题配置：

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
    },
  },
},

// 使用
<div className="text-primary">内容</div>
```

## 性能优化

### 1. 减少未使用的 CSS

Tailwind 会自动移除未使用的 CSS，确保最终的 CSS 文件大小最小。

### 2. 合理使用前缀

对于自定义工具类，使用合适的前缀，避免与 Tailwind 的内置类冲突：

```css
/* 好的做法 */
.custom-btn {
  @apply px-4 py-2 rounded-md;
}

/* 不推荐的做法 */
.btn {
  @apply px-4 py-2 rounded-md;
}
```

### 3. 优化构建过程

使用 Tailwind 的 JIT 模式，提高构建速度：

```javascript
// tailwind.config.js
module.exports = {
  mode: 'jit',
  // 其他配置
};
```

## 常见问题

### 1. 样式不生效

- 检查类名是否正确
- 确认文件是否在 `content` 配置中
- 重新启动开发服务器
- 清除浏览器缓存

### 2. 类名冲突

- 使用前缀区分自定义类和内置类
- 检查是否有重复的类名定义

### 3. 构建体积过大

- 确保只包含必要的文件在 `content` 配置中
- 移除未使用的自定义样式
- 使用 Tailwind 的 JIT 模式

### 4. 响应式设计问题

- 确保使用正确的响应式断点
- 测试不同屏幕尺寸的显示效果
- 避免过度使用响应式类
