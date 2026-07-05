# AGENTS.md — ai-sites

Compact guide for future OpenCode sessions. Repo-specific only.

## Project at a glance

- **Type**: Static site. Astro 6 (`output: 'static'`) + Tailwind CSS 4 (`@tailwindcss/vite`).
- **Node**: `>= 22.12.0` (enforced in `engines` and CI). Use Node 22 LTS.
- **Package manager**: npm. `package-lock.json` is committed. Use `npm ci` in CI, `npm install` locally.
- **Deploy target**: GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.
- **Default site URL**: `https://moyuanhua.github.io` (overridable with `SITE` env var).
- **Language convention**: UI copy is Chinese, code/comments/identifiers are English.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on `localhost:4321` (HMR) |
| `npm run build` | Static build to `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run astro ...` | Pass-through to Astro CLI (e.g. `astro add`, `astro check`) |

There is **no** test, lint, format, or typecheck script. `astro check` is available via `npm run astro check` but is not wired into CI. CI only runs `npm ci` → `npm run build`.

## Architecture

```
src/
├── content.config.ts       # Zod schemas for 3 collections
├── layouts/BaseLayout.astro
├── components/ContentCard.astro
├── pages/
│   ├── index.astro         # Homepage — latest 3 posts, 3 demos, all products
│   ├── roadmap.astro       # Reads src/data/roadmap.json (NOT a content collection)
│   ├── blog/{index,[slug]}.astro
│   ├── demos/{index,[slug]}.astro
│   └── products/{index,[slug]}.astro
├── content/{blog,demos,products}/  # Markdown files = route slugs
└── data/roadmap.json
```

### Content collection (defined in `src/content.config.ts`)

Single collection `posts` with `glob({ pattern: '**/*.md', base: './src/content/posts' })`. Slug = filename without `.md`. The `type: 'blog' | 'demo' | 'product'` field on each post partitions the feed (formerly three separate collections, now unified).

- **posts** — `title`, `date` (coerced), `type` (enum, required), `description` (required), `tags?` (default `[]`), `draft?` (default `false`), `status?` (`'coming-soon' | 'beta' | 'live'`, products only), `url?`, `github?`

**Schema uses `z.coerce.date()`** — frontmatter dates must be ISO format (`2024-06-01`).

### Roadmap is JSON, not a collection

`src/data/roadmap.json` is imported directly in `pages/roadmap.astro`. Three columns: `planned`, `in-progress`, `done`. Items have `type: 'feature' | 'content' | 'infra'`. Do not migrate this to a content collection without a reason.

## Critical invariants — read before editing

### 1. Base path: always prefix with `import.meta.env.BASE_URL`

```astro
const BASE = import.meta.env.BASE_URL;
<a href={`${BASE}blog`}>...</a>     <!-- ✓ -->
<a href="/blog">...</a>             <!-- ✗ breaks on GH Pages project sites -->
```

Every page and `BaseLayout.astro` declares this constant and uses it. All 8 page/layout files follow the pattern — keep it consistent.

### 2. Drafts are filtered at render, not in schema

Schemas declare `draft: z.boolean().optional().default(false)` but **do not** set `draft: true` filter at the collection level. Every page that calls `getCollection(...)` does its own `.filter(p => !p.data.draft)`. If you add a new page, copy this pattern — do not rely on Astro's built-in draft handling.

### 3. Tailwind v4, not v3

- Config is inline via `@import "tailwindcss";` in `src/styles/global.css`.
- Plugin is `@tailwindcss/vite` in `astro.config.mjs` — **no** `postcss.config.*`, **no** `tailwind.config.*`.
- Theme values use `theme(colors.slate.200)` inside CSS, not config files.
- Do not add `@tailwind base/components/utilities` — that is v3 syntax.

### 4. Markdown body is HTML-first, not pure Markdown

Content files use `.md` extension but the body is valid HTML (see `src/content/blog/html-first-publishing.md`, `src/content/demos/particle-gravity.md`). The site philosophy: AI generates HTML directly, no extra render step. Keep the wrapper (`<section>`, `<h2>`, etc.) — bare prose with no tags renders without `prose-content` styling hooks.

`<script>` tags inside `.md` files execute on the client (Astro strips them to a JS island automatically). Demo `particle-gravity.md` is the reference example for inline JS.

### 5. Status badge mapping lives in `posts/[slug].astro` only

`post.data.status` is rendered by `statusConfig` in `src/pages/posts/[slug].astro`. Style is inline (`style={...}`) referencing CSS vars so dual-mode just works. Three states: `live` / `beta` / `coming-soon` — all use one accent color (`--color-accent`) for emphasis variants. Update here only.

### 6. `prose-content` is the prose styling hook

All rendered content in `[slug].astro` pages is wrapped in `<div class="prose-content">`. Custom typography, code blocks, tables, blockquotes, and `<canvas>` styling live in `src/styles/global.css` under this class. New elements in markdown need CSS rules there, not Tailwind utilities on the element.

### 7. Design tokens — dual-mode, single accent, 6px shape lock, Geist

All visual tokens live in `src/styles/global.css`:
- **Dual-mode**: `:root` defaults to light; `@media (prefers-color-scheme: dark)` overrides. `color-scheme: light dark` set on `<html>`. **Do not** introduce theme-specific Tailwind `dark:` variants — change CSS vars.
- **Single accent**: `--color-accent` is `#0d9488` (light) / `#5eead4` (dark). All teal usage across pages must use this var (via `style="color: var(--color-accent)"` or `text-[var(--color-accent)]`). No emerald / amber / secondary accents.
- **Fonts**: Geist (Sans + Mono) self-hosted via `@fontsource/geist` + `@fontsource/geist-mono` imported in `BaseLayout.astro`. No Google Fonts CDN link. `--font-heading` and `--font-body` are both Geist. Mono is Geist Mono.
- **Shape lock**: `rounded-[6px]` for cards / chips / inputs / buttons. `rounded-[3px]` for tiny inline chips. `rounded-full` ONLY on the orb containers (`HeroOrb.astro`, `ChatLayer.astro` canvas + dock button) — they are天体, so圆 is the documented exception. Anything else圆 → fix.
- **Chat-local tokens** (`--chat-*`) are separate from `--color-*` so Canvas code in `ChatLayer.astro` + `HeroOrb.astro` can read them via `getComputedStyle()` at init + on `MutationObserver(documentElement, {attributeFilter:['class','data-theme']})` + `prefers-color-scheme` change.聊天 canvas 用 token 颜色，不硬编码 hex。

### 8. AI orb (Canvas) is the brand asset — keep it token-driven

`ChatLayer.astro` (3 variants: hero / dock / fullscreen) and `HeroOrb.astro` (mini circular-masked hero) share the orb visual language. Canvas code must:
- Read color tokens at init via `readTokens()` helper.
- Subscribe to scheme change (`matchMedia('(prefers-color-scheme: dark)')`) + `class`/`data-theme` attribute mutation.
- Pause `requestAnimationFrame` when canvas is offscreen (IntersectionObserver).
- Honor `prefers-reduced-motion` (no breathe, no jet spawn, no shockwaves).
- Never hardcode `rgba(99,102,241,...)` or `rgba(165,243,252,...)` — all through `col('accent' | 'accent2' | 'soft', alpha)` helper.
- Astro `<ClientRouter />` is enabled. The orb layer carries `transition:name="chat-layer"` for morph between hero / dock / fullscreen. Do NOT remove this transition name.

## Deployment (`.github/workflows/deploy.yml`)

- Trigger: push to `main` or `workflow_dispatch`.
- Build step receives `SITE` and `BASE_PATH` from `actions/configure-pages@v5` — these are the only env vars the build cares about.
- Concurrency group `pages` with `cancel-in-progress: false` — concurrent deploys wait, never cancel.
- No test/lint job. No PR preview environment.
- To mirror GH Pages locally: `SITE=https://example.com BASE_PATH=/repo-name/ npm run build`.

## Secrets and config

- `opencode.json` contains a GitHub MCP bearer token and is **listed in `.gitignore`** — never commit it. The committed version (if it ever leaks into git) should be rotated. Prefer `gh auth` or per-session env for GitHub API work.
- `.env`, `.env.*` are gitignored except `.env.example` (none currently exists — create one if you add env vars).

## Quick recipes

**Add a blog post**:
```bash
# create src/content/blog/my-slug.md
# frontmatter: title, date (YYYY-MM-DD), description, tags?, draft?
# body: HTML or Markdown
npm run dev   # verify at localhost:4321/blog/my-slug
```

**Add a product**:
```bash
# create src/content/products/my-product.md
# frontmatter also needs `status: live|beta|coming-soon`, optional `url`/`github`
```

**Change the site URL or base path locally**:
```bash
SITE=https://staging.example.com BASE_PATH=/preview/ npm run build && npm run preview
```

**Type-check the project** (not in scripts, but available):
```bash
npm run astro check
```

## Things an agent is likely to get wrong

- Adding a `tailwind.config.js` or `postcss.config.js` — Tailwind v4 doesn't need them here.
- Writing `href="/blog"` instead of `href={`${BASE}blog`}` — silently breaks on GH Pages project sites.
- Assuming `draft: true` in frontmatter hides the post — it doesn't; pages do their own filtering.
- Adding `.md` to a page directory expecting it to be ignored — `.md` files in `src/pages/` *do* become routes. Content goes in `src/content/`, not `src/pages/`.
- Treating `roadmap.json` as a content collection — it's a static JSON import, schema lives in TypeScript inside `pages/roadmap.astro`.
- Importing `tailwindcss` in JS — wrong layer. CSS handles it.
