# Design System — ai-labs

Canonical reference for the visual identity of `moyuanhua.github.io/ai-labs-site`. Read this before adding new components, pages, or colors. If a change contradicts something here, update this doc in the same commit.

---

## TL;DR

A personal site that feels like an engineering notebook on graphite paper. Two typefaces only — **Fraunces** for display, **IBM Plex Mono** for everything else. Warm graphite + amber + teal palette. A persistent ambient particle field in the corner of every page is the visual signature and prefigures the future chat feature.

---

## Direction — Field Notebook / Lab Console

The site should feel like a working notebook, not a marketing page. Open with the most characteristic thing in the user's world (their name in a display serif, their particles drifting in the corner). The rest of the page is disciplined, mono, ruled-paper text.

Three rules:

1. **Mono is the personality.** Body, UI, dates, tags, footer, form labels — all mono. Serif appears only at moments (brand mark, h1, hero, section markers). The contrast between the two is what gives the site its voice.
2. **One accent at a time.** Amber for primary actions and live elements. Teal for "live" status and secondary accent. Everything else is graphite-on-bone.
3. **The corner is alive.** Every page has the AmbientCanvas in the bottom-right. It's not decoration — it's the thread tying the user's published work (particle-gravity demo) to the future AI chat feature. When chat lands, the same canvas becomes the "thinking" indicator.

---

## Color tokens

All colors are CSS custom properties on `:root`, also registered in `@theme` so Tailwind utilities (`bg-bg`, `text-ink`, etc.) work.

| Token              | Hex      | Role                                                |
| ------------------ | -------- | --------------------------------------------------- |
| `--color-bg`       | `#0F1115` | Graphite page background. Slightly warm dark, NOT slate-950 blue. |
| `--color-surface`  | `#1A1D24` | Card / panel surface (+1 step from bg).             |
| `--color-surface-2`| `#232730` | Hover surface for interactive surfaces.             |
| `--color-ink`      | `#E8E2D5` | Bone paper, body text.                              |
| `--color-ink-mute` | `#A89C8C` | Pencil graphite, secondary text.                    |
| `--color-ink-faint`| `#5C5B57` | Margins, dividers, faint UI, footer.                |
| `--color-accent`   | `#E89B4C` | Incandescent amber — primary CTA, links on hover, in-progress status, "soon" tag. NOT vermilion, NOT acid green. |
| `--color-accent-2` | `#5BA8A0` | Oxidized teal — secondary, "live" status, link hover. |
| `--color-rule`     | `#2A2D34` | Ruled-paper lines, dividers, card borders.          |

### Status badge palette

These are kept in sync across `ContentCard.astro`, `pages/index.astro`, `pages/products/index.astro`, and `pages/products/[slug].astro`. Use Tailwind's default palette colors directly so badges stay distinct from the page palette:

| Status        | Classes                                              |
| ------------- | ---------------------------------------------------- |
| `live`        | `bg-teal-900/40  text-teal-300  border-teal-800`     |
| `beta`        | `bg-amber-900/40 text-amber-300 border-amber-800`    |
| `coming-soon` | `bg-surface      text-ink-mute  border-rule`         |

### Selection

`::selection` uses `--color-accent` background with `--color-bg` text. Don't change this.

---

## Typography

Two faces only. Loaded once in `BaseLayout.astro` via Google Fonts.

| Role    | Family           | Weight range | Where it's used                                  |
| ------- | ---------------- | ------------ | ------------------------------------------------ |
| Display | **Fraunces**     | 400–800      | Brand mark, page h1, hero, section h2 markers.    |
| Body    | **IBM Plex Mono**| 300, 400, 500 | Everything else: prose, nav, dates, tags, footer, buttons, form labels, captions. |

Load order in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,400..800,50&family=IBM+Plex+Mono:wght@300;400;500&display=swap" rel="stylesheet">
```

### Type scale

| Element            | Size / weight / family                                  |
| ------------------ | ------------------------------------------------------- |
| Hero display (h1)  | `text-5xl sm:text-6xl`, Fraunces, `font-medium` (500)  |
| Page h1            | `text-4xl sm:text-5xl`, Fraunces, weight 500            |
| Section h2         | `text-2xl`, Fraunces, `font-medium`                    |
| Section eyebrow    | `text-xs uppercase tracking-wider`, Plex Mono, `text-ink-mute` |
| Body               | `text-[0.95rem]`, Plex Mono, `text-ink`, line-height 1.7 |
| Card title         | `text-base font-medium`, Plex Mono, `text-ink`         |
| Meta / dates       | `text-xs`, Plex Mono, `text-ink-mute`                  |
| Tag chips          | `text-xs`, Plex Mono, `text-ink-faint`, `bg-surface`   |
| Footer             | `text-xs`, Plex Mono, `text-ink-faint`                 |

The eyebrow + h2 pattern is the standard section header. Eyebrow reads like a column header in a notebook (`blog · 03`, `demos · 02`). h2 is the human-readable label.

---

## Layout

### Widths

| Context             | Container       |
| ------------------- | --------------- |
| Home hero           | `max-w-3xl` centered |
| Index pages (blog/demos/products/roadmap) | `max-w-5xl` |
| `[slug]` pages      | header `max-w-3xl`, prose body `max-w-2xl` |
| `/about`, `/chat`   | `max-w-3xl`     |

### Ruled paper background

Implemented in `global.css` via `body::before` with a fixed-position repeating-linear-gradient. Lines are `var(--color-rule)`, every 28px, opacity 0.55. Don't replace this with an image.

### Spacing rhythm

- Major sections: `py-16` / `py-20`
- Between sections: `mb-16` / `space-y-16`
- Card grid gaps: `gap-4`
- Card padding: `p-5`

### Cards

Standard content card (used for blog, demos, products):

```
bg-surface border border-rule rounded-md p-5
hover:bg-surface-2 hover:border-ink-faint transition-colors
```

- Title: `text-ink font-medium leading-snug`, hover → `text-accent`
- Date: `text-xs font-mono text-ink-mute`
- Description: `text-sm text-ink-mute leading-relaxed`
- Tags: `text-xs font-mono text-ink-faint bg-surface px-2 py-0.5 rounded`

### Section headers

Pattern used at the top of every section on the home page and at the top of every index page:

```
<header>
  <p class="text-xs uppercase tracking-wider font-mono text-ink-mute mb-1.5">
    blog · {count}
  </p>
  <h2 class="font-serif text-2xl text-ink">
    最新文章
  </h2>
  <a class="font-mono text-sm text-accent hover:text-accent/80">全部 →</a>
</header>
```

Eyebrow reads like a column label in a notebook. Count is zero-padded (`01`, `02`).

---

## Signature — AmbientCanvas

`src/components/AmbientCanvas.astro`. A `<canvas>` positioned `fixed` at bottom-right (320×200 desktop, 200×140 mobile). `pointer-events: none`, `z-index: 0`. Hidden on print.

### Behavior

- ~80 particles (`featured` intensity: 140)
- Brownian motion + tiny gravity toward canvas center
- Gentle document-wide pull toward cursor (long range, weak force: `Math.min(30 / (mdist + 100), 0.05)`)
- Mouse influence decays 1.5s after the last `mousemove`
- Colors: 70% amber (`--color-accent`), 30% teal (`--color-accent-2`)
- Alpha range: 0.3–0.6 ambient, 0.5–0.8 featured
- Subtle motion trails via `rgba(15, 17, 21, 0.22)` per-frame fade
- Wraps around edges so the field feels endless

### Reduced motion

If `prefers-reduced-motion: reduce` is set, the canvas shows a static dotted background (radial-gradient at 14px spacing) instead of running the physics loop. Don't remove this branch.

### How to use it

Mount once per page:

```astro
---
import AmbientCanvas from '../components/AmbientCanvas.astro';
---
<BaseLayout title="...">
  <AmbientCanvas />                <!-- ambient: 80 particles, 320×200 -->
  <!-- page content -->
</BaseLayout>
```

On the chat page, use the featured intensity:

```astro
<AmbientCanvas intensity="featured" />
```

Don't mount multiple instances on one page — the script uses `document.querySelector('.ambient-canvas')` and only the first matches.

### Why it's the signature

The user's published `particle-gravity.md` demo is one of their signature works. The AmbientCanvas echoes its physics — but at ambient strength, not interactive-toy strength. When the future AI chat lands, the same canvas becomes the "thinking" indicator. The bridge between published work and chat is already in place.

---

## Voice & copy

UI copy is Chinese. Code, identifiers, and content-type labels are English.

### Tone

Active voice. Plain verbs. Sentence case for UI copy, uppercase for mono eyebrows.

| Instead of        | Use                |
| ----------------- | ------------------ |
| "Submit"          | "发送"              |
| "Click here"      | "阅读博客", "查看 Roadmap" |
| "Coming Soon"     | eyebrow `talk · soon` + a "Coming soon" pill |
| "Lorem ipsum"     | Real copy. If you must placeholder, mark it `— 待补充 —` (italic, ink-faint). |

### Empty states

- Collection index pages: `<p class="text-slate-500 text-center py-20">暂无 Demo，敬请期待。</p>`
- Section placeholders: italic mono in ink-faint. The placeholder text is part of the design.

### Numerics

Counters in section eyebrows are zero-padded: `blog · 03`, `demos · 02`. Don't drop the leading zero — it's part of the notebook feel.

Don't use bare `01 / 02 / 03` numbered markers as decoration. They only make sense when the content is actually a sequence (process, timeline).

---

## Anti-patterns

Things that will break the design:

- ❌ **Don't use the warm cream + terracotta default.** That's the AI-default look #1. We're deliberately on graphite + amber.
- ❌ **Don't add more accent colors.** Amber + teal only. Need a third? Use `text-ink-mute` or `text-ink-faint`.
- ❌ **Don't introduce a third typeface.** Fraunces + IBM Plex Mono is the system. Body in a different sans would erase the personality.
- ❌ **Don't use sans-serif for body.** Mono body is the personality. Sans-serif body becomes "another dark dev portfolio".
- ❌ **Don't use `01 / 02 / 03` as decoration.** Only use numbered markers when the content is actually ordered.
- ❌ **Don't put `position: fixed` decorations in the document flow.** If it floats, it floats.
- ❌ **Don't add a Tailwind config file or PostCSS config.** Tailwind v4 is inline in `global.css`.
- ❌ **Don't use raw `/blog` hrefs.** Always `${BASE}blog` (with the trailing-slash guarantee from `astro.config.mjs`).
- ❌ **Don't add emoji to UI copy.** No emoji in section labels, CTAs, or footer unless explicitly requested.
- ❌ **Don't fabricate About content.** The `src/data/about.json` is intentionally empty. Fill it yourself when you have the resume.

---

## Extending the system

### Adding a new color

1. Add the variable to `:root` in `global.css` AND to the `@theme` block. Both.
2. Add it to the table above.
3. Verify it works in both light contexts (cards) and dark contexts (bg).

### Adding a new component

1. Reuse existing tokens — don't introduce new colors or typefaces.
2. If it sits in cards/lists, follow the `bg-surface border border-rule rounded-md p-5` pattern unless it has a real reason to differ.
3. Mount `<AmbientCanvas />` once on the page that uses the component.

### Adding a new content collection

1. Define it in `src/content.config.ts` with a Zod schema.
2. Add an index page at `src/pages/<collection>/index.astro` using `ContentCard`.
3. Add a `[slug].astro` page using the standard pattern (back-link + display-serif h1 + mono date + tags + `prose-content` wrapper).
4. Filter drafts at render time: `.filter(p => !p.data.draft)`. Don't rely on Astro's built-in draft handling.
5. If it needs a status badge, extend the badge color mapping in all four locations.

### Updating the ambient canvas

If you change the physics constants, document the tuning here so the next person knows what the numbers mean. Don't change the design intent (ambient, not interactive).
