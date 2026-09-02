# AI FDE 个人品牌站点设计（改造 ai-labs-site）

- 日期：2026-09-02
- 状态：待 review
- 范围：改造现有 `ai-labs-site`（Astro 6 + Tailwind v4 + GitHub Pages），不新建仓库

---

## 1. 目标与定位

### 1.1 目标

把现有 ai-labs-site 从「观测台 / AI 合著者」重新定位为「AI 落地工程师」个人品牌站，向访客讲清三件事：

1. **AI 能做什么**
2. **我用 AI 做了什么**
3. **我能帮别人用 AI 做什么**

### 1.2 定位

- **主定位**：AI FDE（AI Forward Deployed Engineer / AI 落地工程师）——「把 AI 从 demo 干到生产」
- **副标（保留签名）**：SDE = *Not Just a Software Development Engineer, but Someone Who Does Everything*

---

## 2. 内容来源（三通路，收敛到统一渲染层）

| 通路 | 来源 | 管道 | 落点 |
|---|---|---|---|
| A | AI 内容块（本地生成 HTML） | 直接写 `.md`（body 是 HTML） | `src/content/posts/*.md` |
| B | 飞书文档 | `lark-cli` + `jq` + `pandoc` → `.md` + 图片 | `src/content/posts/*.md` |
| C | 整页 HTML（demo / 工具） | 直接放 | `public/` 原样托管（绕过渲染） |

- 通路 A / B 最终都写进同一个 content collection，渲染层完全一致。
- 通路 C 不走 collection，由页面用卡片链出。

---

## 3. 内容分类

### 3.1 type 枚举（3 种）

```
post | tool | demo
```

- `post`：一切文章，用 `tags` 细分
- `tool`：工具箱条目（资产而非文章，不同布局）
- `demo`：交互 demo（现有 particle-gravity 这类，inline JS 在 .md 内）

### 3.2 tag 细分（post 内）

```
tutorial | teardown | case | note
```

### 3.3 映射三问

| 问题 | 承载内容 |
|---|---|
| AI 能做什么 | `tutorial` + `teardown` |
| 我用 AI 做了什么 | `case` + `demo` + 开源项目 |
| 我能帮别人用 AI 做什么 | `tool` + `note` |

> 注：`开源项目` 不单独设 type/tag，由关于页 GitHub 链接 + 首页精选项目卡片承载；`build in public` 由 `/roadmap` 承载。

---

## 4. 技术方案

**Git-first 静态构建 + lark-cli 脚本触发**（方案 1）：

- 所有内容进 git（可 review、可回滚）
- 飞书文档通过 `lark-cli` 脚本拉取 → 转 `.md`
- 发布 = `git push` → GitHub Actions → GitHub Pages
- 不新增服务器 / 运行时依赖（仅本机需 `jq` + `pandoc`）
- 部署模型（`deploy.yml`）不动

---

## 5. 信息架构

### 5.1 导航（4 项）

```
首页 / 文章 / 工具箱 / 关于
```

### 5.2 路由

| 路由 | 现状 | 目标改动 |
|---|---|---|
| `/` | index.astro | 改 Hero 文案 |
| `/posts` | posts/index.astro + [slug].astro | 加 tag 过滤 UI |
| `/tools` | （无） | **新增** index + [slug] |
| `/chat` | chat.astro | 保留（占位） |
| `/roadmap` | roadmap.astro | 保留（build in public，从关于/footer 链入） |
| `/about` | about.astro | 改文案 → AI FDE 叙事 + 技能矩阵 |

### 5.3 schema 变更（`src/content.config.ts`）

```
type: z.enum(['blog', 'demo', 'product'])  →  z.enum(['post', 'tool', 'demo'])
```

存量迁移规则（3 篇现有 post，只改 frontmatter 不删文件）：

- `blog` → `post`（补 `tutorial` / `teardown` / `note` 之一）
- `demo` → `demo`（保留）
- `product` → `post`（tag: `case`）

---

## 6. 飞书管线

### 6.1 新增文件

```
scripts/publish-feishu.mjs       # 飞书 URL → .md + 图片（编排层）
scripts/read-feishu-wiki.sh      # lark-cli fetch + jq + pandoc（转换层）
.env.example                     # FEISHU_APP_ID / FEISHU_APP_SECRET（.env 已 gitignore）
```

### 6.2 `publish-feishu.mjs` 接口

- 输入（环境变量）：`FEISHU_URL`、`SLUG`、`TAGS`、`TITLE`、`DESCRIPTION`、`CONTENT_TYPE`（默认 `post`）
- 流程：`lark-cli docs +fetch` → `jq` 提取 HTML → `media-preview` 下载图片到 `public/images/` → `pandoc` 转 HTML/MD → 生成带 frontmatter 的 `.md` → 落到 `src/content/posts/{slug}.md`
- 失败：不落盘、非零退出（fail-fast）

---

## 7. 设计系统与文案

### 7.1 设计系统：保留不动

- teal 单主色（`#0d9488` / `#5eead4`）
- Geist Sans + Mono
- 6px 形状锁（卡片 `6px`、chip `3px`、仅 orb 用 `rounded-full`）
- AI orb（Canvas）品牌资产

只改**文案 / 叙事**，不动 token、组件、布局。

### 7.2 Hero 文案

```
Eyebrow：AI FDE · Forward Deployed · 落地工程师
H1：把 AI 从 demo 干到生产。
Sub：SDE — Not Just a Software Development Engineer,
      but Someone Who Does Everything.
三问一行：AI 能做什么 · 我用 AI 做了什么 · 我能帮你用 AI 做什么
```

CTA 保留「与 AI 对话」+「浏览文章」，可加「工具箱」入口。

### 7.3 关于页文案

一句定位 + 技能矩阵（前端 / 后端 / 云 / CI / AI 四层）+「找我做事」入口。
调性保留内部介绍（找 PM 安排 / 直接找我·仅限有趣项目），但**脱敏去掉公司内部链接**。

---

## 8. AI 聊天（数字分身）

- **本次**：保留占位（`ChatLayer` 假回复不动）
- **后续 Phase**：接真实 LLM + 站内内容 RAG（需 serverless 后端，单独设计）

---

## 9. 分阶段实施

- **Phase 0**：spec 确认（本阶段）
- **Phase 1**：IA 重构 —— schema type 变更 + 路由 + 导航 + Hero/关于文案 + 存量迁移
- **Phase 2**：飞书管线 —— `publish-feishu` 脚本 + `.env.example`
- **Phase 3**：工具箱页 —— `/tools` 路由 + `tool` 布局
- **Phase 4**：内容冷启动 —— 脱敏改写 3-5 篇案例 + 3 篇原创教程
- **Phase 5**（后续独立）：数字分身 —— 聊天接 LLM + RAG

---

## 10. 风险与边界

1. **隐私**：飞书内容源必须用个人/独立飞书空间，严禁 `anker-in` 内部文档。
2. **图片防盗链**：飞书图片下载到 `public/images/` 本地化。
3. **存量迁移**：改 frontmatter 不删文件，保证可回滚。
4. **GitHub Pages 限制**：纯静态，聊天数字分身需额外 serverless 后端（Phase 5 单独处理）。
