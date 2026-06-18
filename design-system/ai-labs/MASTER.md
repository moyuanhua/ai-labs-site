# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** ai-labs
**Updated:** 2026-06-18
**Category:** Portfolio/Personal

---

## Global Rules

### Color Palette

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

**Color Notes:** Light zinc neutrals + blue accent. Emerald for "live" status, amber for "beta" status.

### Typography

- **Heading Font:** Lexend (weights 400, 500, 600, 700)
- **Body Font:** Source Sans 3 (weights 300, 400, 500, 600, 700)
- **Mono Font:** System monospace stack (code blocks only, no Google Font)
- **Mood:** content-focused, readable, clean, professional, trustworthy, minimal
- **Google Fonts:** [Lexend + Source Sans 3](https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap)

**CSS Variables:**
```css
--font-heading: "Lexend", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-body:    "Source Sans 3", ui-sans-serif, system-ui, -apple-system, sans-serif;
--font-mono:    ui-monospace, "SF Mono", "Cascadia Code", "Roboto Mono", Menlo, monospace;
```

### Type Scale

| Element | Size | Font | Weight |
|---------|------|------|--------|
| Hero h1 | `text-5xl sm:text-6xl` | Lexend | 600 |
| Page h1 | `text-4xl` | Lexend | 600 |
| Section h2 | `text-2xl sm:text-3xl` | Lexend | 600 |
| Eyebrow | `text-xs uppercase tracking-widest` | Source Sans 3 | 600 |
| Body | `text-base` | Source Sans 3 | 400 |
| Card title | `text-lg` | Lexend | 600 |
| Meta/dates | `text-sm` | Source Sans 3 | 400 |
| Tags | `text-xs` | Source Sans 3 | 500 |

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
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | FAB, drawer |

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
  font-family: "Source Sans 3", sans-serif;
  font-weight: 600;
  transition: background-color 200ms ease;
  cursor: pointer;
}

.btn-primary:hover {
  background: #1D4ED8;
}

/* Secondary Button */
.btn-secondary {
  background: transparent;
  color: #52525B;
  border: 1px solid #E4E4E7;
  padding: 12px 24px;
  border-radius: 9999px;
  font-family: "Source Sans 3", sans-serif;
  font-weight: 500;
  transition: color 200ms ease, border-color 200ms ease;
  cursor: pointer;
}

.btn-secondary:hover {
  color: #09090B;
  border-color: #52525B;
}
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

### Inputs

```css
.input {
  padding: 8px 12px;
  border: 1px solid #E4E4E7;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-family: "Source Sans 3", sans-serif;
  color: #52525B;
  background: #F4F4F5;
  cursor: not-allowed;
}
```

### Chat Sidebar

- Desktop (xl+, >= 1280px): `fixed right-0 top-16 bottom-0 w-[340px] bg-surface border-l border-border`
- Mobile/tablet (< 1280px): FAB `fixed bottom-6 right-6 w-14 h-14 rounded-full bg-accent` + bottom drawer `fixed inset-x-0 bottom-0 top-1/2 z-50`
- Drawer slides up 300ms ease-out (instant if prefers-reduced-motion)
- Focus management: focus input on open, return to FAB on close

---

## Style Guidelines

**Style:** Minimal & Direct

**Keywords:** content-first, readable, clean, no-nonsense, fast-loading, subtle-hover, no-scroll-animations

**Best For:** Personal portfolios, content sites, engineering blogs, documentation

**Key Effects:** Subtle hover only (color/shadow, 200ms). No scroll-reveal, no entrance animations, no parallax.

### Page Pattern

**Pattern Name:** Content Grid

- **Conversion Strategy:** Content-first. Show the work immediately. No animation gates.
- **CTA Placement:** Hero buttons + section "全部 →" links + chat sidebar
- **Section Order:** 1. Hero (Name/Tagline), 2. Latest Blog (3 cards), 3. Latest Demos (3 cards), 4. All Products, 5. Footer

### Navigation

6 items: Blog, Demos, Products, Roadmap, About, Chat (with "soon" tag)

---

## Anti-Patterns (Do NOT Use)

- ❌ Handwriting fonts (Caveat, Quicksand, Comic Sans)
- ❌ Scroll-reveal animations (data-reveal, IntersectionObserver)
- ❌ Scale transforms on hover (layout shift)
- ❌ Animations longer than 300ms
- ❌ Emojis as icons — Use SVG icons (inline SVG, Heroicons, Lucide)
- ❌ Missing cursor:pointer — All clickable elements must have cursor:pointer
- ❌ Low contrast text — Maintain 4.5:1 minimum contrast ratio
- ❌ Invisible focus states — Focus states must be visible for a11y
- ❌ Tailwind config files — Tailwind v4 is inline in global.css
- ❌ Raw `/blog` hrefs — Always `${BASE}blog`
- ❌ Fabricated content — about.json is intentionally empty

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No handwriting fonts (Lexend + Source Sans 3 only)
- [ ] No scroll-reveal animations (no data-reveal attributes)
- [ ] No emojis used as icons (use inline SVG instead)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with subtle transitions (200ms, color/shadow only)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected (chat drawer appears instantly)
- [ ] Responsive: 375px (FAB+drawer), 768px (FAB+drawer), 1024px (FAB+drawer), 1280px (sidebar appears), 1440px (full desktop)
- [ ] No content hidden behind fixed elements
- [ ] No horizontal scroll on mobile
- [ ] All hrefs use `${BASE}` prefix
- [ ] Drafts filtered at render time (`.filter(p => !p.data.draft)`)
