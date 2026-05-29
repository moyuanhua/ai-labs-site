# AI Labs Site

AI Labs 官方网站 —— 博客、产品展示与 Roadmap。

## Tech Stack

- **Framework**: [Astro](https://astro.build/) (Static Site Generator)
- **Content**: Astro Content Collections (Markdown)
- **Comments**: [Giscus](https://giscus.app/) (GitHub Discussions)
- **Deploy**: Cloudflare Pages / Vercel

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── content/          # Content collections
│   ├── blog/         # Blog posts (Markdown)
│   ├── products/     # Product pages (Markdown)
│   └── roadmap/      # Roadmap items (JSON)
├── components/       # Reusable components
├── layouts/          # Page layouts
└── pages/            # Route pages
public/
└── images/           # Static images
```

## Deployment

This site is configured for static output and can be deployed to:

- **Cloudflare Pages**: Connect repo → build command `npm run build` → output dir `dist`
- **Vercel**: Connect repo → framework preset `Astro` → auto-detected

## Giscus Comments

To enable comments, update `src/components/Giscus.astro` with your `data-repo-id` and `data-category-id` from [giscus.app](https://giscus.app/).
