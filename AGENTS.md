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

### Content collections (defined in `src/content.config.ts`)

All three use `glob({ pattern: '**/*.md', base: ... })` loader. Slug = filename without `.md`.

- **blog** — `title`, `date` (coerced), `description` (required), `tags?`, `draft?` (default `false`)
- **demos** — same schema as blog
- **products** — adds `status: 'coming-soon' | 'beta' | 'live'` (default `'live'`), optional `url`, `github`

**Schemas use `z.coerce.date()`** — frontmatter dates must be ISO format (`2024-06-01`).

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

### 5. Status badge mapping is duplicated — keep them in sync

`product.data.status` maps to a badge in **three** places that must agree:

- `src/pages/index.astro` → `statusBadge()`
- `src/pages/products/index.astro` → `badgeConfig`
- `src/pages/products/[slug].astro` → `statusConfig`
- `src/components/ContentCard.astro` → `badgeColors` (color classes only)

Colors: `live` → green/emerald, `beta` → yellow, `coming-soon` → slate. Adding a new status requires updating all four.

### 6. `prose-content` is the prose styling hook

All rendered content in `[slug].astro` pages is wrapped in `<div class="prose-content">`. Custom typography, code blocks, tables, blockquotes, and `<canvas>` styling live in `src/styles/global.css` under this class. New elements in markdown need CSS rules there, not Tailwind utilities on the element.

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
