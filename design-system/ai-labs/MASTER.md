# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** ai-labs
**Updated:** 2026-06-18
**Category:** Portfolio/Personal
**Direction:** Conversational Terminal — dual-layer (bright content + dark glass chat) with Astro View Transitions morph

---

## Global Rules

### Color Palette

#### Content layer (in `@theme` + `:root` — Tailwind utilities generated)

| Role | Hex | CSS Variable |
|------|-----|--------------|
| Background | `#FAFAFA` | `--color-bg` |
| Surface | `#FFFFFF` | `--color-surface` |
| Surface-2 | `#F4F4F5` | `--color-surface-2` |
| Text | `#09090B` | `--color-text` |
| Text Muted | `#52525B` | `--color-text-muted` |
| Text Faint | `#A1A1AA` | `--color-text-faint` |
| Accent (CTA) | `#2563EB` | `--color-accent` |
| Accent Hover | `#1D4ED8` | `--color-accent-2` |
| Border | `#E4E4E7` | `--color-border` |
| Dark | `#18181B` | `--color-dark` |

#### Chat layer (in `:root` only — NO Tailwind utilities, reference via `var(--chat-*)`)

| Role | Value | CSS Variable |
|------|-------|--------------|
| Chat bg | `rgba(9, 9, 11, 0.85)` | `--chat-bg` |
| Chat border | `rgba(255, 255, 255, 0.1)` | `--chat-border` |
| Chat glow | `0 0 40px rgba(37, 99, 235, 0.35)` | `--chat-glow` |
| Chat text | `#F4F4F5` | `--chat-text` |
| Chat text muted | `#A1A1AA` | `--chat-text-muted` |
| Chat accent | `#3B82F6` | `--chat-accent` |
| Chat accent-2 | `#06B6D4` | `--chat-accent-2` |
| AI bubble bg | `rgba(63, 63, 70, 0.6)` | `--chat-bubble-ai-bg` |
| AI bubble border | `rgba(82, 82, 91, 0.5)` | `--chat-bubble-ai-border` |
| User bubble bg | `#2563EB` | `--chat-bubble-user-bg` |

**Color Notes:** Content layer = light zinc neutrals + blue accent. Emerald for "live" status, amber for "beta" status. Chat layer = dark glass (zinc-950/85 + backdrop-blur) with blue glow; uses Tailwind zinc/blue utilities directly. Do NOT leak chat-layer colors into content layer.

### Typography

- **Heading Font:** Space Grotesk (weights 400, 500, 600, 700)
- **Body Font:** DM Sans (weights 400, 500, 700)
- **Mono Font:** System monospace stack (code blocks only, no Google Font)
- **Mood:** tech, conversational, clean, geometric, readable
- **Google Fonts:** [DM Sans + Space Grotesk](https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&display=swap)

**CSS Variables:**
```css
--font-heading: "Space Grotesk", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-body:    "DM Sans", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono:    ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Menlo, monospace;
```

### Type Scale

| Element | Size | Font | Weight |
|---------|------|------|--------|
| Hero h1 (home) | `text-4xl sm:text-5xl` | Space Grotesk | 600 |
| Page h1 | `text-4xl` | Space Grotesk | 600 |
| Section h2 | `text-2xl sm:text-3xl` | Space Grotesk | 600 |
| Eyebrow | `text-xs uppercase tracking-widest` | DM Sans | 500 |
| Body | `text-base` | DM Sans | 400 |
| Card title | `text-lg` | Space Grotesk | 600 |
| Meta/dates | `text-sm` | DM Sans | 400 |
| Tags | `text-xs` | DM Sans | 500 |
| Chat greeting | `text-xl` | Space Grotesk | 500 |
| Chat header | `text-lg` | Space Grotesk | 500 |
| Chat messages | `text-sm` | DM Sans | 400 |

### Spacing Variables

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` / `0.25rem` | Tight gaps |
| `--space-sm` | `8px` / `0.5rem` | Icon gaps, inline spacing |
| `--space-md` | `16px` / `1rem` | Standard padding |
| `--space-lg` | `24px` / `1.5rem` | Section padding |
| `--space-xl` | `32px` / `2rem` | Large gaps |
| `--space-2xl` | `48px` / `3rem` | Section margins |
| `--space-3xl` | `64px` / `4rem` | Hero padding |

### Shadow Depths

| Level | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | Cards (default) |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Cards on hover, buttons |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Dock button |
| `--chat-glow` | `0 0 40px rgba(37,99,235,0.35)` | Chat hero panel; dock uses `0 0 30px` → hover `0 0 40px` |

---

## Component Specs

### Buttons

```css
/* Primary Button */
.btn-primary {
  background: #2563EB;
  color: white;
  padding: 12px 24px;
  border-radius: 9999px;
  font-family: "DM Sans", sans-serif;
  font-weight: 600;
  transition: background-color 200ms ease;
  cursor: pointer;
}
.btn-primary:hover { background: #1D4ED8; }

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #52525B;
  border: 1px solid #E4E4E7;
  padding: 12px 24px;
  border-radius: 9999px;
  font-family: "DM Sans", sans-serif;
  font-weight: 500;
  transition: color 200ms ease, border-color 200ms ease;
  cursor: pointer;
}
.btn-secondary:hover { color: #09090B; border-color: #52525B; }
```

### Cards

```css
.card {
  background: #FFFFFF;
  border: 1px solid #E4E4E7;
  border-radius: 1rem;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  transition: box-shadow 200ms ease, transform 200ms ease;
  cursor: pointer;
}
.card:hover {
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}
```

### Inputs (content layer)

```css
.input {
  padding: 8px 12px;
  border: 1px solid #E4E4E7;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "DM Sans", sans-serif;
  color: #09090B;
  background: #FFFFFF;
}
```

### ChatLayer (signature — 3 variants)

`src/components/ChatLayer.astro`. Props: `variant: 'hero' | 'dock' | 'fullscreen'`. All variants share `transition:name="chat-layer"` on root for View Transitions morph.

- **hero** (homepage, in `<main>`): `max-w-2xl mx-auto bg-zinc-950/85 backdrop-blur-xl border border-white/10 rounded-3xl`, `box-shadow: var(--chat-glow)`, flex col `min-h-[320px]`. Greeting + messages (`data-chat-messages`) + enabled input (`data-chat-input` + `data-chat-send`).
- **dock** (sub-pages, from BaseLayout): `<a href={`${BASE}chat`}>` fixed `bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-zinc-950/85 backdrop-blur-xl border border-white/10`, box-shadow `0 0 30px` → hover `0 0 40px` (200ms). SVG chat icon `text-blue-400`. Notification dot when localStorage has history. Uses `<a>` so View Transitions morph on navigation.
- **fullscreen** (`/chat`): `fixed inset-0 z-50 bg-zinc-950/95 backdrop-blur-2xl flex flex-col`. Inner `max-w-3xl mx-auto`. Header (Space Grotesk "moyuanhua's AI" + emerald dot + close `onclick="history.back()"`) + messages + enabled input.

**Chat bubbles:** AI = `bg-zinc-800/60 border border-zinc-700 rounded-2xl rounded-tl-sm p-3 text-sm text-zinc-100 max-w-[85%]`. User = `bg-blue-600 text-white rounded-2xl rounded-tr-sm p-3 text-sm ml-auto max-w-[80%]`. Both get `.chat-bubble-enter` (200ms ease-out).

**Chat script:** `STORAGE_KEY='moyuanhua-chat-history'`, `FAKE_AI_REPLY` placeholder, `initChat()` on load + `astro:page-load`, 300ms→typing→1500ms→AI reply, localStorage persistence.

---

## Style Guidelines

**Style:** Conversational Terminal (dual-layer)

**Keywords:** content-first, tech, dark-glass-chat, view-transitions-morph, readable, fast-loading, subtle-hover, no-scroll-animations

**Best For:** Personal portfolios, AI-ready content sites, engineering blogs

**Key Effects:**
- Content layer: subtle hover only (color/shadow, 200ms). No scroll-reveal, no entrance animations, no parallax.
- Chat layer: bubble entrance 200ms ease-out, typing dots 1.4s staggered, View Transitions morph (browser-native).
- `prefers-reduced-motion: reduce` → chat bubble/typing animations disabled.

### Page Pattern

**Pattern Name:** Chat-First Content Grid

- **Conversion Strategy:** Chat is the hero on the homepage (first screen = chat entry point). Content cards below ("— or browse the content —"). Sub-pages show a floating dock button that morphs to fullscreen chat on `/chat`.
- **CTA Placement:** Homepage chat hero + section "全部 →" links + dock button (sub-pages) + nav "Chat" link
- **Section Order (homepage):** 1. Hero (name + eyebrow), 2. ChatLayer hero panel, 3. "— or browse the content —" divider, 4. Latest Blog (3 cards), 5. Latest Demos (3 cards), 6. All Products, 7. Footer

### Navigation

6 items: Blog, Demos, Products, Roadmap, About, Chat (with "soon" tag). Footer: Blog, Demos, Products, Roadmap, About (no Chat — dock button is the entry point).

### View Transitions

- `ClientRouter` from `astro:transitions` in `BaseLayout.astro` `<head>`.
- Exactly one `transition:name="chat-layer"` element per page (hero/dock/fullscreen).
- `astro:page-load` re-inits chat script on each navigation.
- Unsupported browsers → normal navigation fallback (acceptable).

---

## Anti-Patterns (Do NOT Use)

- ❌ Lexend, Source Sans 3, handwriting fonts (Caveat, Quicksand, Comic Sans) — Space Grotesk + DM Sans only
- ❌ Second `transition:name="chat-layer"` element on a page (exactly one per page)
- ❌ Removing `transition:name="chat-layer"` from any ChatLayer variant
- ❌ Scroll-reveal animations (data-reveal, IntersectionObserver)
- ❌ Scale transforms on hover (layout shift)
- ❌ Animations longer than 400ms (chat typing loop 1.4s is the only exception — progress indicator, not entrance)
- ❌ Emojis as icons — Use SVG icons (inline SVG)
- ❌ Missing cursor:pointer — All clickable elements must have cursor:pointer
- ❌ Low contrast text — Maintain 4.5:1 minimum contrast ratio
- ❌ Invisible focus states — Focus states must be visible for a11y
- ❌ Tailwind config files — Tailwind v4 is inline in global.css
- ❌ Chat layer tokens in `@theme` — `--chat-*` live on `:root` only, no utilities generated
- ❌ Raw `/blog` hrefs — Always `${BASE}blog`
- ❌ Disabling the chat input — input is live, fake AI reply is the placeholder
- ❌ `xl:pr-[360px]` wrapper or old ChatSidebar — replaced by dual-layer ChatLayer
- ❌ Fabricated content — about.json is intentionally empty

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No Lexend/Source Sans 3/handwriting fonts (Space Grotesk + DM Sans only)
- [ ] No scroll-reveal animations (no data-reveal attributes)
- [ ] No emojis used as icons (use inline SVG instead)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with subtle transitions (200ms, color/shadow only)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected (chat bubble/typing animations disabled)
- [ ] Exactly one `transition:name="chat-layer"` element per page
- [ ] Chat input enabled (not disabled)
- [ ] No content hidden behind fixed elements (dock is bottom-right, doesn't block content)
- [ ] No horizontal scroll on mobile
- [ ] All hrefs use `${BASE}` prefix
- [ ] Drafts filtered at render time (`.filter(p => !p.data.draft)`)
- [ ] Chat layer tokens on `:root` only (not in `@theme`)
