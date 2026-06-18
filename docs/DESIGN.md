# Design System — ai-labs

Canonical reference for the visual identity of `moyuanhua.github.io/ai-labs-site`. Read this before adding new components, pages, or colors. If a change contradicts something here, update this doc in the same commit.

---

## TL;DR

A personal site that feels like a clean, content-focused engineering notebook. Two typefaces only — **Lexend** for headings, **Source Sans 3** for everything else. Light zinc + blue palette. A persistent chat sidebar on desktop (FAB + bottom drawer on mobile/tablet) is the visual signature and prefigures the future AI chat feature.

---

## Direction — Clean Content-First / Minimal & Direct

The site should feel like a working notebook, not a marketing page. Open with the most characteristic thing in the user's world (their name in Lexend, their work in cards). The rest of the page is disciplined, readable, no-nonsense text.

Three rules:

1. **Content is the personality.** Body, UI, dates, tags, footer, form labels — all Source Sans 3. Lexend appears only at headings (brand mark, h1, hero, section markers, card titles). The contrast between the two is what gives the site its voice. No handwriting fonts.
2. **One accent at a time.** Blue (`#2563EB`) for primary actions, links, "in-progress" status, and "soon" tags. Emerald for "live" status. Amber for "beta" status. Everything else is zinc-on-off-white.
3. **The sidebar is alive.** Every desktop page has the ChatSidebar on the right (xl+). On mobile/tablet, a FAB opens a bottom drawer. It's not decoration — it's the thread tying the user's site to the future AI chat feature. When chat lands, the same sidebar becomes interactive.

---

## Color tokens

All colors are CSS custom properties on `:root`, also registered in `@theme` so Tailwind utilities (`bg-bg`, `text-text`, etc.) work.

| Token              | Hex      | Role                                                |
| ------------------ | -------- | --------------------------------------------------- |
| `--color-bg`       | `#FAFAFA` | Page background — warm off-white.                  |
| `--color-surface`  | `#FFFFFF` | Card / panel surface.                               |
| `--color-surface-2`| `#F4F4F5` | Hover surface for interactive surfaces (zinc-100).  |
| `--color-text`     | `#09090B` | Body text (zinc-950).                               |
| `--color-text-muted`| `#52525B`| Secondary text (zinc-600).                          |
| `--color-text-faint`| `#A1A1AA`| Faint text, dividers, placeholder (zinc-400).       |
| `--color-accent`   | `#2563EB` | Primary CTA, links, "soon" tag (blue-600).          |
| `--color-accent-2` | `#1D4ED8` | Hover accent (blue-700).                            |
| `--color-border`   | `#E4E4E7` | Card/divider borders (zinc-200).                    |
| `--color-dark`     | `#18181B` | Dark surfaces — footer bg, code blocks (zinc-900).  |

### Status badge palette

These are kept in sync across `ContentCard.astro`, `pages/index.astro`, `pages/products/index.astro`, and `pages/products/[slug].astro`. Use Tailwind's default palette colors directly so badges stay distinct from the page palette:

| Status        | Classes                                              |
| ------------- | ---------------------------------------------------- |
| `live`        | `bg-emerald-100 text-emerald-700 border-emerald-200` |
| `beta`        | `bg-amber-100   text-amber-700   border-amber-200`   |
| `coming-soon` | `bg-zinc-100    text-zinc-500    border-zinc-200`    |

### Selection

`::selection` uses `--color-accent` background with white text. Don't change this.

---

## Typography

Two faces only. Loaded once in `BaseLayout.astro` via Google Fonts.

| Role    | Family           | Weight range | Where it's used                                  |
| ------- | ---------------- | ------------ | ------------------------------------------------ |
| Heading | **Lexend**       | 400, 500, 600, 700 | Brand mark, page h1, hero, section h2, card titles, prose h1-h4. |
| Body    | **Source Sans 3**| 300, 400, 500, 600, 700 | Everything else: prose body, nav, dates, tags, footer, buttons, form labels, captions. |
| Mono    | System stack     | —            | Code blocks in prose-content only. No Google Font. |

Load order in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

### Type scale

| Element            | Size / weight / family                                  |
| ------------------ | ------------------------------------------------------- |
| Hero h1            | `text-5xl sm:text-6xl`, Lexend, weight 600, `tracking-tight` |
| Page h1            | `text-4xl`, Lexend, weight 600, `tracking-tight`        |
| Section h2         | `text-2xl sm:text-3xl`, Lexend, weight 600              |
| Section eyebrow    | `text-xs uppercase tracking-widest`, Source Sans 3, weight 600, `text-text-muted` |
| Body               | `text-base`, Source Sans 3, weight 400, line-height 1.7 |
| Card title         | `text-lg`, Lexend, weight 600                           |
| Meta / dates       | `text-sm`, Source Sans 3, weight 400, `text-text-muted` |
| Tag chips          | `text-xs`, Source Sans 3, weight 500, `text-accent` on `bg-accent/5`, `rounded-full` |
| Footer             | `text-xs`, Source Sans 3, `text-white/50`–`/70`         |

The eyebrow + h2 pattern is the standard section header. Eyebrow reads like a column header (`blog · 03`, `demos · 02`). h2 is the human-readable label.

---

## Layout

### Widths

| Context             | Container       |
| ------------------- | --------------- |
| Home hero           | centered, max-w-6xl |
| Index pages (blog/demos/products/roadmap) | `max-w-6xl` |
| `[slug]` pages      | `max-w-3xl`     |
| `/about`, `/chat`   | `max-w-3xl`     |

### Chat sidebar layout

On `xl+` (>= 1280px), a wrapper `<div class="xl:pr-[360px]">` around main+footer shifts content left by 360px (340px sidebar + 20px gap). The sidebar is `fixed right-0 top-16 bottom-0 w-[340px]` — it occupies the right column. Below `xl` (< 1280px), the sidebar is hidden and a FAB (floating action button) at `bottom-6 right-6` opens a bottom drawer covering the bottom half of the screen.

### Spacing rhythm

- Major sections: `py-16` / `py-20` / `py-24`
- Between sections: `mb-16` / `space-y-16`
- Card grid gaps: `gap-6`
- Card padding: `p-6`

### Cards

Standard content card (used for blog, demos, products):

```
bg-surface border border-border rounded-2xl p-6 shadow-sm
hover:shadow-md hover:-translate-y-0.5 transition-all duration-200
```

- Title: `text-lg font-heading font-semibold text-text`, hover → `text-accent`
- Date: `text-sm font-body text-text-muted`
- Description: `text-base font-body text-text-muted leading-relaxed`
- Tags: `text-xs font-body font-medium text-accent bg-accent/5 border border-accent/15 px-2.5 py-1 rounded-full`

### Section headers

Pattern used at the top of every section on the home page and at the top of every index page:

```
<header>
  <p class="text-xs uppercase tracking-widest font-body font-medium text-text-muted mb-2">
    blog · {count}
  </p>
  <h2 class="font-heading text-2xl sm:text-3xl font-semibold text-text">
    最新文章
  </h2>
  <a class="font-body text-sm font-medium text-accent hover:text-accent-2">全部 →</a>
</header>
```

Eyebrow reads like a column label. Count is zero-padded (`01`, `02`).

---

## Animations — Minimal & Direct

No scroll-reveal animations. No entrance animations. No parallax. The site loads fast and content is visible immediately.

The only motion allowed:

- **Card hover**: `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200` (subtle 200ms lift)
- **Link hover**: `hover:text-accent transition-colors duration-200` (color change only)
- **Chat drawer** (mobile): slides up 300ms ease-out, or appears instantly if `prefers-reduced-motion: reduce`

Do NOT add:
- `data-reveal` attributes or IntersectionObserver scripts
- Scale transforms on hover (layout shift risk)
- Animations longer than 300ms
- Any new animation patterns beyond the above

---

## Signature — ChatSidebar

`src/components/ChatSidebar.astro`. A persistent chat sidebar that's always visible on desktop and FAB-triggered on mobile/tablet.

### Desktop (xl+, >= 1280px)

- Position: `fixed right-0 top-16 bottom-0 w-[340px]`
- Background: `bg-surface border-l border-border`
- Layout: vertical flex — header (h-14) + messages area (flex-1, scrollable) + input area (border-t)
- Header: "Talk to me" (Lexend 600) + "soon" pill (accent/10 bg, accent text, uppercase)
- Messages: a single welcome bubble (bg-surface-2, rounded-2xl) + "— coming soon" muted line
- Input: disabled text input + disabled "发送 (即将上线)" button

### Mobile + tablet (< 1280px)

- FAB: `fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent text-white shadow-lg`
- Icon: inline SVG chat bubble (24x24, stroke=currentColor)
- Click FAB → bottom drawer slides up (covers bottom half) + backdrop dims the rest
- Drawer: `fixed inset-x-0 bottom-0 top-1/2 z-50 bg-surface border-t border-border rounded-t-2xl`
- Close handle: small gray pill bar at top, click to close
- Backdrop: `fixed inset-0 bg-black/30`, click to close
- Escape key also closes

### Accessibility

- FAB has `aria-label="Open chat"`
- Drawer has `role="dialog" aria-label="Chat with moyuanhua's AI"`
- Backdrop has `aria-hidden="true"`
- Focus management: opening drawer focuses the input; closing returns focus to FAB
- `prefers-reduced-motion: reduce` → drawer appears instantly (no slide transition)

### Why it's the signature

The chat sidebar is the always-present AI presence. Even though chat is "coming soon," the sidebar is visible on every page — a constant signal that this site is AI-ready. When the chat feature lands, the sidebar becomes interactive without any layout change. The bridge between the static site and the future AI is already in place.

---

## Navigation

Six items in the header nav, in order:

1. Blog
2. Demos
3. Products
4. Roadmap
5. About
6. Chat (with a small "soon" tag — `text-[0.65rem] uppercase tracking-wider text-accent ml-1.5`)

The footer includes Blog, Demos, Products, Roadmap, About (no Chat in footer — the sidebar is the chat entry point on every page).

---

## Voice & copy

UI copy is Chinese. Code, identifiers, and content-type labels are English.

### Tone

Active voice. Plain verbs. Sentence case for UI copy, uppercase for eyebrows.

| Instead of        | Use                |
| ----------------- | ------------------ |
| "Submit"          | "发送"              |
| "Click here"      | "阅读博客", "查看 Roadmap" |
| "Coming Soon"     | eyebrow `talk · soon` + a "soon" pill |
| "Lorem ipsum"     | Real copy. If you must placeholder, mark it `— 待补充 —` (italic, text-faint). |

### Empty states

- Collection index pages: `<p class="font-body text-text-muted text-center py-20">— 暂无 Demo，敬请期待 —</p>`
- Section placeholders: italic Source Sans 3 in text-faint. The placeholder text is part of the design.
- About page: `— 整页待补充 —` when all sections empty, `— 待补充 —` per empty section.

### Numerics

Counters in section eyebrows are zero-padded: `blog · 03`, `demos · 02`. Don't drop the leading zero.

---

## Anti-patterns

Things that will break the design:

- ❌ **Don't use Caveat, Quicksand, or any handwriting font.** Lexend + Source Sans 3 is the system. Handwriting fonts undermine the content-first direction.
- ❌ **Don't add scroll-reveal animations.** No `data-reveal`, no IntersectionObserver. Content is visible on load.
- ❌ **Don't add more accent colors.** Blue + emerald + amber (for badges only). Need another? Use `text-text-muted` or `text-text-faint`.
- ❌ **Don't introduce a third typeface.** Lexend + Source Sans 3 + system mono (code only) is the system.
- ❌ **Don't use scale transforms on hover.** Use `hover:-translate-y-0.5` (subtle lift) or color/shadow changes only.
- ❌ **Don't add a Tailwind config file or PostCSS config.** Tailwind v4 is inline in `global.css`.
- ❌ **Don't use raw `/blog` hrefs.** Always `${BASE}blog` (with the trailing-slash guarantee from `astro.config.mjs`).
- ❌ **Don't add emoji to UI copy.** No emoji in section labels, CTAs, or footer. Use inline SVG for icons.
- ❌ **Don't fabricate About content.** The `src/data/about.json` is intentionally empty. Fill it yourself when you have the resume.
- ❌ **Don't put `position: fixed` decorations in the document flow.** If it floats, it floats.

---

## Extending the system

### Adding a new color

1. Add the variable to `:root` in `global.css` AND to the `@theme` block. Both.
2. Add it to the table above.
3. Verify it works in both light contexts (cards) and dark contexts (footer/code blocks).

### Adding a new component

1. Reuse existing tokens — don't introduce new colors or typefaces.
2. If it sits in cards/lists, follow the `bg-surface border border-border rounded-2xl p-6 shadow-sm` pattern unless it has a real reason to differ.
3. Use `font-heading` for titles, `font-body` for all other text.

### Adding a new content collection

1. Define it in `src/content.config.ts` with a Zod schema.
2. Add an index page at `src/pages/<collection>/index.astro` using `ContentCard`.
3. Add a `[slug].astro` page using the standard pattern (back-link + Lexend h1 + Source Sans 3 date + tags + `prose-content` wrapper).
4. Filter drafts at render time: `.filter(p => !p.data.draft)`. Don't rely on Astro's built-in draft handling.
5. If it needs a status badge, extend the badge color mapping in all four locations (ContentCard, index, products/index, products/[slug]).

### Adding a new page

1. Use `BaseLayout` — it includes the nav, footer, and ChatSidebar automatically.
2. Follow the eyebrow + Lexend h1 header pattern.
3. Use `font-body` for all text unless it's a heading (then `font-heading`).
4. No `data-reveal` attributes. Content is visible on load.
