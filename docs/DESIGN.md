# Design System — ai-labs

Canonical reference for the visual identity of `moyuanhua.github.io/ai-labs-site`. Read this before adding new components, pages, or colors. If a change contradicts something here, update this doc in the same commit.

---

## TL;DR

A personal site that feels like a **Conversational Terminal** — a dual-layer design. Bright content pages (light zinc + blue) with a dark glass chat layer that morphs between three states using Astro View Transitions. Two typefaces only — **Space Grotesk** for headings, **DM Sans** for everything else. The chat layer is the visual signature: a hero panel on the homepage, a floating dock button on sub-pages, and a fullscreen chat on `/chat`, all sharing `transition:name="chat-layer"` so the browser morphs between them on navigation.

---

## Direction — Conversational Terminal / Dual-Layer

The site is two layers stacked:

1. **Content layer** — bright, readable, light zinc + blue. Blog, demos, products, roadmap, about. Space Grotesk headings give a tech feel; DM Sans body keeps it neutral and readable.
2. **Chat layer** — dark glass (zinc-950/85 + backdrop-blur), blue glow. Exists in exactly one variant per page and morphs between variants across navigations via View Transitions.

Three rules:

1. **Content is the personality.** Body, UI, dates, tags, footer, buttons, chat messages — all DM Sans. Space Grotesk appears only at headings (brand mark, h1, hero, section markers, card titles, chat greeting/header). The contrast between the two is what gives the site its voice. No handwriting fonts.
2. **One accent at a time.** Blue (`#2563EB`) for primary actions, links, "in-progress" status, and "soon" tags. Emerald for "live" status. Amber for "beta" status. Everything else is zinc-on-off-white. The chat layer uses a darker blue (`#3B82F6`) and cyan (`#06B6D4`) for its glow/accent — these live only in the chat layer, not the content layer.
3. **The chat layer is alive and morphs.** Every page has exactly one element with `transition:name="chat-layer"`. Homepage → hero panel (in flow). Sub-pages → floating dock button (fixed bottom-right). `/chat` → fullscreen overlay. Navigating between pages makes the browser morph one into the next (collapse/expand). Chat input is enabled; a fake AI reply is the placeholder until real AI lands. History persists across pages via `localStorage`.

---

## Color tokens

### Content layer

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

### Chat layer (dark glass)

These are CSS custom properties on `:root` but **NOT** in `@theme` — no Tailwind utilities are generated for them. Reference via `var(--chat-*)` in `ChatLayer.astro` and chat CSS. ChatLayer uses Tailwind's built-in zinc/blue palette directly for utility classes.

| Token                      | Value                          | Role                                    |
| -------------------------- | ------------------------------ | --------------------------------------- |
| `--chat-bg`                | `rgba(9, 9, 11, 0.85)`         | Chat panel background (zinc-950/85).    |
| `--chat-border`            | `rgba(255, 255, 255, 0.1)`     | Chat panel/bubble borders.              |
| `--chat-glow`              | `0 0 40px rgba(37, 99, 235, 0.35)` | Box-shadow glow on hero/dock.       |
| `--chat-text`              | `#F4F4F5`                      | Chat primary text (zinc-100).           |
| `--chat-text-muted`        | `#A1A1AA`                      | Chat muted text, typing dots (zinc-400).|
| `--chat-accent`            | `#3B82F6`                      | Chat accent (blue-500).                 |
| `--chat-accent-2`          | `#06B6D4`                      | Chat secondary accent (cyan-500).       |
| `--chat-bubble-ai-bg`      | `rgba(63, 63, 70, 0.6)`        | AI bubble background (zinc-700/60).     |
| `--chat-bubble-ai-border`  | `rgba(82, 82, 91, 0.5)`        | AI bubble border (zinc-600/50).         |
| `--chat-bubble-user-bg`    | `#2563EB`                      | User bubble background (blue-600).      |

### Status badge palette

Kept in sync across `ContentCard.astro`, `pages/index.astro`, `pages/products/index.astro`, and `pages/products/[slug].astro`. Uses Tailwind's default palette so badges stay distinct from the page palette:

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

| Role    | Family              | Weight range       | Where it's used                                  |
| ------- | ------------------- | ------------------ | ------------------------------------------------ |
| Heading | **Space Grotesk**   | 400, 500, 600, 700 | Brand mark, page h1, hero, section h2, card titles, prose h1-h4, chat greeting + header. |
| Body    | **DM Sans**         | 400, 500, 700      | Everything else: prose body, nav, dates, tags, footer, buttons, chat messages, form labels, captions. |
| Mono    | System stack        | —                  | Code blocks in prose-content only. No Google Font. |

Load order in `<head>`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Type scale

| Element            | Size / weight / family                                     |
| ------------------ | ---------------------------------------------------------- |
| Hero h1 (home)     | `text-4xl sm:text-5xl`, Space Grotesk, weight 600, `tracking-tight` |
| Page h1            | `text-4xl`, Space Grotesk, weight 600, `tracking-tight`    |
| Section h2         | `text-2xl sm:text-3xl`, Space Grotesk, weight 600          |
| Section eyebrow    | `text-xs uppercase tracking-widest`, DM Sans, weight 500, `text-text-muted` |
| Body               | `text-base`, DM Sans, weight 400, line-height 1.7          |
| Card title         | `text-lg`, Space Grotesk, weight 600                       |
| Meta / dates       | `text-sm`, DM Sans, weight 400, `text-text-muted`          |
| Tag chips          | `text-xs`, DM Sans, weight 500, `text-accent` on `bg-accent/5`, `rounded-full` |
| Footer             | `text-xs`, DM Sans, `text-white/50`–`/70`                  |
| Chat greeting      | `text-xl`, Space Grotesk, weight 500, `text-zinc-100`      |
| Chat header        | `text-lg`, Space Grotesk, weight 500, `text-zinc-100`      |
| Chat messages      | `text-sm`, DM Sans, weight 400                             |

The eyebrow + h2 pattern is the standard section header. Eyebrow reads like a column header (`blog · 03`, `demos · 02`). h2 is the human-readable label.

---

## Layout

### Dual-layer structure

The page is a single column (no right-rail wrapper). `BaseLayout.astro` renders `<header>`, `<main>`, `<footer>` in a flex column. The chat layer is rendered separately:

- Homepage (`chatVariant="hero"`): `<ChatLayer variant="hero" />` is rendered **inside `<main>`** by `index.astro`, between the hero text and the content cards. BaseLayout renders no dock.
- Sub-pages (`chatVariant="dock"`, the default): BaseLayout renders `<ChatLayer variant="dock" />` after the footer — a fixed bottom-right floating button.
- `/chat` (`chatVariant="fullscreen"`): `chat.astro` renders `<ChatLayer variant="fullscreen" />` inside `<main>`; it's `fixed inset-0 z-50` so it covers the whole viewport. BaseLayout renders no dock.

There is **no** `xl:pr-[360px]` wrapper — that was the old ChatSidebar layout and is gone.

### Widths

| Context             | Container       |
| ------------------- | --------------- |
| Home hero + chat    | `max-w-2xl` (chat panel), `max-w-6xl` (content sections) |
| Index pages (blog/demos/products/roadmap) | `max-w-6xl` |
| `[slug]` pages      | `max-w-3xl`     |
| `/about`            | `max-w-3xl`     |
| `/chat` fullscreen  | `max-w-3xl` (inner column) |

### Spacing rhythm

- Major sections: `py-16` / `py-20` / `py-24`
- Between sections: `mb-16` / `space-y-16`
- Card grid gaps: `gap-4` (homepage) / `gap-6` (index pages)
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

## View Transitions

Astro View Transitions (`ClientRouter` from `astro:transitions`) are enabled in `BaseLayout.astro` `<head>`. The chat layer is the morph target.

- Every ChatLayer variant root element carries `transition:name="chat-layer"`.
- Each page has **exactly one** element with that name (hero on home, dock on sub-pages, fullscreen on `/chat`).
- On navigation, the browser morphs the old element into the new one — the chat panel collapses to the dock button when leaving the homepage, expands to fullscreen when entering `/chat`, etc.
- `astro:page-load` event fires after each navigation; the chat script re-initializes on this event so input handlers rebind.
- Unsupported browsers fall back to normal navigation (acceptable).

Do not add a second `transition:name="chat-layer"` element on any page, and do not remove it from any variant — the morph depends on exactly one per page.

---

## Animations — Minimal + Chat micro-motion

No scroll-reveal animations. No entrance animations. No parallax. Content loads fast and is visible immediately.

Motion allowed:

- **Card hover**: `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200` (subtle 200ms lift)
- **Link hover**: `hover:text-accent transition-colors duration-200` (color change only)
- **Dock hover**: box-shadow grows from `0 0 30px` to `0 0 40px` blue glow, 200ms ease-out
- **Chat bubble entrance**: `.chat-bubble-enter` → `chat-bubble-in` 200ms ease-out (opacity + 8px translateY)
- **Typing indicator**: `.typing-dot` → `typing-pulse` 1.4s ease-in-out infinite, staggered 0.2s/0.4s delays
- **View Transitions morph**: browser-native, respects `prefers-reduced-motion` automatically

`@media (prefers-reduced-motion: reduce)` disables `.chat-bubble-enter` and `.typing-dot` animations (typing dots fall back to static 0.6 opacity).

Do NOT add:
- `data-reveal` attributes or IntersectionObserver scripts
- Scale transforms on hover (layout shift risk)
- Animations longer than 400ms (chat typing loop is the only exception — it's a progress indicator, not an entrance)
- Any new animation patterns beyond the above

---

## Signature — ChatLayer

`src/components/ChatLayer.astro`. Props: `variant: 'hero' | 'dock' | 'fullscreen'`. All three variants share `transition:name="chat-layer"` on their root element so View Transitions morph between them.

### Variant: hero (homepage)

Rendered inside `<main>` by `index.astro`, between the hero text and the content cards.

- Root: `<div transition:name="chat-layer" class="chat-hero max-w-2xl mx-auto ...">`
- `bg-zinc-950/85 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden`, `box-shadow: var(--chat-glow)`
- Flex column, `min-h-[320px]`
- Greeting (px-6 pt-5 pb-3): "Hi, I'm moyuanhua's AI." (Space Grotesk text-xl zinc-100) + "Ask me about my work, demos, or writing." (DM Sans text-sm zinc-400)
- Messages (`data-chat-messages`, flex-1 min-h-[180px] overflow-y-auto px-6 space-y-3)
- Input (p-4 border-t border-white/10): enabled text input + 发送 button

### Variant: dock (sub-pages)

Rendered by `BaseLayout.astro` when `chatVariant === 'dock'` (the default).

- Root: `<a href={`${BASE}chat`} transition:name="chat-layer" data-chat-dock class="chat-dock ...">`
- `fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-zinc-950/85 backdrop-blur-xl border border-white/10`
- `box-shadow: 0 0 30px rgba(37,99,235,0.3)`, hover → `0 0 40px`, 200ms ease-out
- Inline SVG chat bubble icon (24x24, `text-blue-400`)
- Notification dot (`absolute top-0 right-0 w-3 h-3 bg-blue-500 rounded-full`) shown when localStorage has chat history
- Uses `<a>` (not `<button>`) so View Transitions morph naturally on navigation to `/chat`

### Variant: fullscreen (/chat)

Rendered inside `<main>` by `chat.astro`; covers the viewport.

- Root: `<div transition:name="chat-layer" class="chat-fullscreen fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-2xl flex flex-col">`
- Inner: `max-w-3xl mx-auto w-full h-full flex flex-col`
- Header (h-16, border-b border-white/10, px-6): "moyuanhua's AI" (Space Grotesk text-lg zinc-100) + emerald online dot + close button (`onclick="history.back()"`, SVG X icon)
- Messages (`data-chat-messages`, flex-1 overflow-y-auto p-6 space-y-4)
- Input (p-6 border-t border-white/10): enabled text input + 发送 button

### Chat bubbles

- AI bubble: `bg-zinc-800/60 border border-zinc-700 rounded-2xl rounded-tl-sm p-3 text-sm text-zinc-100 max-w-[85%]`
- User bubble: `bg-blue-600 text-white rounded-2xl rounded-tr-sm p-3 text-sm ml-auto max-w-[80%]`
- Typing indicator: AI bubble shell with three `.typing-dot` spans
- All bubbles get `.chat-bubble-enter` on creation (200ms fade+rise)

### Chat script (inline in ChatLayer.astro)

- `STORAGE_KEY = 'moyuanhua-chat-history'`
- `FAKE_AI_REPLY` — placeholder AI response (see code); returned for every user message until real AI lands
- `getHistory()` / `saveHistory(h)` — JSON round-trip via localStorage, try/catch guarded
- `createBubble(role, text)` — builds a bubble div with `.chat-bubble-enter`
- `createTypingIndicator()` — three pulsing dots
- `initChat()` — renders existing history, binds send button + Enter key, on send: append user bubble → 300ms → typing indicator → 1500ms → AI reply, persist each step
- `initDockDot()` — shows the dock notification dot iff history exists
- Runs on initial load AND on `astro:page-load` (View Transitions re-init)

### Accessibility

- Dock has `aria-label="Open chat"`
- Fullscreen close button has `aria-label="Close chat"`
- Chat input is a real focusable `<input>` (enabled)
- `prefers-reduced-motion: reduce` → bubble/typing animations disabled

### Why it's the signature

The chat layer is the always-present AI presence, and the View Transitions morph makes it feel like one continuous object that collapses into a button and expands into a full screen. Even though the AI reply is a placeholder, the input is live and history persists across pages — the bridge between the static site and the future real AI is already in place.

---

## Navigation

Six items in the header nav, in order:

1. Blog
2. Demos
3. Products
4. Roadmap
5. About
6. Chat (with a small "soon" tag — `text-[0.65rem] uppercase tracking-wider text-accent ml-1.5`)

The footer includes Blog, Demos, Products, Roadmap, About (no Chat in footer — the dock button is the chat entry point on every sub-page, and the hero panel is the entry point on the homepage).

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
- Section placeholders: italic DM Sans in text-faint. The placeholder text is part of the design.
- About page: `— 整页待补充 —` when all sections empty, `— 待补充 —` per empty section.

### Numerics

Counters in section eyebrows are zero-padded: `blog · 03`, `demos · 02`. Don't drop the leading zero.

---

## Anti-patterns

Things that will break the design:

- ❌ **Don't use Lexend, Source Sans 3, Caveat, Quicksand, or any handwriting font.** Space Grotesk + DM Sans is the system. Handwriting fonts undermine the tech/content direction.
- ❌ **Don't add a second `transition:name="chat-layer"` element on a page.** Exactly one per page — the View Transitions morph depends on it.
- ❌ **Don't remove `transition:name="chat-layer"` from any ChatLayer variant.** All three variants must carry it.
- ❌ **Don't add scroll-reveal animations.** No `data-reveal`, no IntersectionObserver. Content is visible on load.
- ❌ **Don't add more accent colors.** Blue + emerald + amber (for badges only). Chat layer has its own darker blue/cyan — don't leak them into the content layer.
- ❌ **Don't introduce a third typeface.** Space Grotesk + DM Sans + system mono (code only) is the system.
- ❌ **Don't use scale transforms on hover.** Use `hover:-translate-y-0.5` (subtle lift) or color/shadow changes only.
- ❌ **Don't add a Tailwind config file or PostCSS config.** Tailwind v4 is inline in `global.css`.
- ❌ **Don't put chat layer tokens in `@theme`.** They're on `:root` only — no Tailwind utilities generated for `--chat-*`.
- ❌ **Don't use raw `/blog` hrefs.** Always `${BASE}blog` (with the trailing-slash guarantee from `astro.config.mjs`).
- ❌ **Don't add emoji to UI copy.** No emoji in section labels, CTAs, or footer. Use inline SVG for icons.
- ❌ **Don't disable the chat input.** The input is live; the fake AI reply is the placeholder for the real AI.
- ❌ **Don't fabricate About content.** The `src/data/about.json` is intentionally empty. Fill it yourself when you have the resume.
- ❌ **Don't reintroduce `xl:pr-[360px]` or the old ChatSidebar.** The dual-layer ChatLayer replaces them.

---

## Extending the system

### Adding a new color

1. Content-layer color: add the variable to `:root` in `global.css` AND to the `@theme` block. Both. Add it to the table above.
2. Chat-layer color: add the variable to `:root` only (NOT `@theme`). Reference via `var(--chat-*)`.
3. Verify it works in both light contexts (cards) and dark contexts (footer/code blocks/chat).

### Adding a new component

1. Reuse existing tokens — don't introduce new colors or typefaces.
2. If it sits in cards/lists, follow the `bg-surface border border-border rounded-2xl p-6 shadow-sm` pattern unless it has a real reason to differ.
3. Use `font-heading` (Space Grotesk) for titles, `font-body` (DM Sans) for all other text.
4. If it's a new chat-layer state, add it as a ChatLayer variant and keep `transition:name="chat-layer"` on the root.

### Adding a new content collection

1. Define it in `src/content.config.ts` with a Zod schema.
2. Add an index page at `src/pages/<collection>/index.astro` using `ContentCard`.
3. Add a `[slug].astro` page using the standard pattern (back-link + Space Grotesk h1 + DM Sans date + tags + `prose-content` wrapper).
4. Filter drafts at render time: `.filter(p => !p.data.draft)`. Don't rely on Astro's built-in draft handling.
5. If it needs a status badge, extend the badge color mapping in all four locations (ContentCard, index, products/index, products/[slug]).

### Adding a new page

1. Use `BaseLayout` — it includes the nav, footer, ClientRouter, and (by default) the dock ChatLayer automatically.
2. Pass `chatVariant="hero"` only for a chat-first page (like the homepage), `chatVariant="fullscreen"` only for a full-chat page (like `/chat`); otherwise leave the default (`dock`).
3. Follow the eyebrow + Space Grotesk h1 header pattern.
4. Use `font-body` for all text unless it's a heading (then `font-heading`).
5. No `data-reveal` attributes. Content is visible on load.
