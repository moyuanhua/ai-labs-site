import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  site: process.env.SITE || 'https://moyuanhua.github.io',
  // Normalize base to always end with `/` so `${BASE}blog` patterns
  // produce `/ai-labs-site/blog`, not `/ai-labs-siteblog`. Required
  // because `actions/configure-pages` does NOT guarantee trailing slash
  // on its `base_path` output. See AGENTS.md invariant #1.
  base: (process.env.BASE_PATH || '/').replace(/\/?$/, '/'),
  vite: {
    plugins: [tailwindcss()],
  },
});
