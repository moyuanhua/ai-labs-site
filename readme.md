# AI Labs Site

基于 [Astro](https://astro.build) 构建的 AI Labs 官网，包含博客、产品详情页，并集成了 [Giscus](https://giscus.app) 评论系统。

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
ai-labs-site/
├── public/              # 静态资源（图片、favicon 等）
├── src/
│   ├── components/
│   │   └── Giscus.astro     # Giscus 评论组件
│   ├── content/
│   │   ├── blog/            # 博客文章（Markdown/MDX）
│   │   ├── products/        # 产品详情（Markdown/MDX）
│   │   └── roadmap/         # 路线图（JSON）
│   ├── layouts/
│   │   ├── BaseLayout.astro      # 公共页面框架（Header + Footer）
│   │   ├── BlogPostLayout.astro  # 博客文章布局（含 Giscus）
│   │   └── ProductLayout.astro   # 产品详情布局（含 Giscus）
│   ├── pages/
│   │   ├── index.astro           # 首页
│   │   ├── blog/
│   │   │   ├── index.astro       # 博客列表
│   │   │   └── [slug].astro      # 博客文章详情
│   │   └── products/
│   │       ├── index.astro       # 产品列表
│   │       └── [slug].astro      # 产品详情
│   ├── styles/
│   │   └── global.css            # 全局样式
│   └── content.config.ts         # 内容集合 Schema 定义
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## 内容管理

### 新增博客文章

在 `src/content/blog/` 目录下创建 `.md` 或 `.mdx` 文件：

```markdown
---
title: '文章标题'
description: '文章描述'
pubDate: '2024-01-01'
heroImage: '/your-image.jpg'   # 可选
tags: ['tag1', 'tag2']         # 可选
---

正文内容...
```

Giscus 评论区会**自动出现在每篇文章底部**，无需额外配置。

### 新增产品

在 `src/content/products/` 目录下创建 `.md` 或 `.mdx` 文件：

```markdown
---
title: '产品名称'
description: '产品描述'
pubDate: '2024-01-01'
heroImage: '/product-image.jpg'   # 可选
category: '产品分类'               # 可选
status: 'active'                  # active | beta | deprecated
---

产品详情内容...
```

Giscus 评论区会**自动出现在每个产品详情页底部**。

---

## 集成 Giscus 评论

Giscus 使用 GitHub Discussions 作为评论后端，完全免费且无需数据库。

### 配置步骤

1. **确保仓库公开**  
   Giscus 只支持公开的 GitHub 仓库。

2. **安装 Giscus GitHub App**  
   访问 [https://github.com/apps/giscus](https://github.com/apps/giscus)，点击 **Install** 并选择目标仓库。

3. **开启 Discussions 功能**  
   在仓库页面进入 **Settings → Features**，勾选 **Discussions**。

4. **创建评论分类**  
   进入仓库的 **Discussions** 标签页，点击右上角 ✏️ 创建一个名为 `Comments` 的分类（建议选择 **Announcements** 类型，防止访客直接发起 Discussion）。

5. **生成配置参数**  
   访问 [https://giscus.app](https://giscus.app)，填写仓库信息，选择 Discussion 分类，复制生成的配置值。

6. **更新组件默认值**  
   打开 `src/components/Giscus.astro`，将占位符替换为真实值：

   ```astro
   const {
     repo = 'moyuanhua/ai-labs-site',      // ← 你的仓库
     repoId = 'REPLACE_WITH_REPO_ID',      // ← 从 giscus.app 复制
     category = 'Comments',
     categoryId = 'REPLACE_WITH_CATEGORY_ID', // ← 从 giscus.app 复制
     ...
   } = Astro.props;
   ```

### 组件用法

`Giscus.astro` 已集成在 `BlogPostLayout.astro` 和 `ProductLayout.astro` 中，所有博客文章和产品详情页会**自动显示评论区**。

如需在其他页面手动使用：

```astro
---
import Giscus from '../components/Giscus.astro';
---

<Giscus />
```

支持覆盖任意参数：

```astro
<Giscus
  repo="owner/other-repo"
  theme="dark"
  lang="en"
  inputPosition="top"
/>
```

### 可用参数

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `repo` | string | `'moyuanhua/ai-labs-site'` | GitHub 仓库（owner/repo） |
| `repoId` | string | — | 仓库 Node ID（从 giscus.app 获取） |
| `category` | string | `'Comments'` | Discussion 分类名称 |
| `categoryId` | string | — | 分类 ID（从 giscus.app 获取） |
| `mapping` | string | `'pathname'` | 页面与 Discussion 的映射方式 |
| `strict` | `'0'`\|`'1'` | `'0'` | 是否严格匹配标题 |
| `reactionsEnabled` | `'0'`\|`'1'` | `'1'` | 显示 Reactions |
| `emitMetadata` | `'0'`\|`'1'` | `'0'` | 是否向父页面发送元数据 |
| `inputPosition` | `'top'`\|`'bottom'` | `'bottom'` | 评论框位置 |
| `theme` | string | `'preferred_color_scheme'` | Giscus 主题 |
| `lang` | string | `'zh-CN'` | 界面语言 |
| `loading` | `'lazy'`\|`'eager'` | `'lazy'` | 脚本加载策略 |
