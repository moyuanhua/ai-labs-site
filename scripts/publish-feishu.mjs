#!/usr/bin/env node

/**
 * publish-feishu.mjs
 *
 * Orchestration script for the Feishu → Astro content pipeline.
 *
 * Reads environment variables, invokes read-feishu-wiki.sh to produce a
 * localised Markdown file, then wraps it with YAML frontmatter and writes
 * the result to src/content/posts/{SLUG}.md.
 *
 * Required env vars : FEISHU_URL, SLUG
 * Optional env vars : TITLE, DESCRIPTION, TAGS, CONTENT_TYPE, DRAFT
 *
 * Usage:
 *   FEISHU_URL=https://xxx.feishu.cn/wiki/abc123 \
 *   SLUG=my-post \
 *   TITLE="My Title" \
 *   TAGS="ai,feishu" \
 *   node scripts/publish-feishu.mjs
 */

import { spawnSync } from 'node:child_process';
import {
  readFileSync,
  writeFileSync,
  mkdirSync,
  cpSync,
  existsSync,
} from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// ── Resolve repo root (one level above this script) ──────────────────
const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

// ── Read & validate environment variables ────────────────────────────
const FEISHU_URL = (process.env.FEISHU_URL ?? '').trim();
const SLUG = (process.env.SLUG ?? '').trim();
const TITLE = (process.env.TITLE ?? '').trim();
const DESCRIPTION = (process.env.DESCRIPTION ?? '').trim() || 'Imported from Feishu.';
const TAGS = (process.env.TAGS ?? '').trim();
const CONTENT_TYPE = (process.env.CONTENT_TYPE ?? '').trim() || 'post';
const DRAFT = (process.env.DRAFT ?? '').trim() === 'true';

if (!FEISHU_URL) {
  console.error('Error: FEISHU_URL environment variable is required.');
  process.exit(1);
}
if (!SLUG) {
  console.error('Error: SLUG environment variable is required.');
  process.exit(1);
}

const VALID_TYPES = ['post', 'tool', 'demo'];
if (!VALID_TYPES.includes(CONTENT_TYPE)) {
  console.error(
    `Error: CONTENT_TYPE must be one of: ${VALID_TYPES.join(', ')}. Got: "${CONTENT_TYPE}"`,
  );
  process.exit(1);
}

// ── Prepare cache directory ──────────────────────────────────────────
const cacheDir = join(repoRoot, '.cache', 'feishu', SLUG);
mkdirSync(cacheDir, { recursive: true });

// ── Invoke read-feishu-wiki.sh ───────────────────────────────────────
const scriptPath = join(__dirname, 'read-feishu-wiki.sh');
console.log(`Fetching Feishu document: ${FEISHU_URL}`);

const result = spawnSync('bash', [scriptPath, FEISHU_URL, cacheDir], {
  encoding: 'utf-8',
  // Capture both streams; stderr is printed below on failure or success.
});

// Forward shell-script diagnostics (they live on stderr)
if (result.stderr) process.stderr.write(result.stderr);

if (result.status !== 0) {
  console.error(`Error: read-feishu-wiki.sh exited with status ${result.status}`);
  process.exit(1);
}

// ── Resolve generated Markdown path (last non-empty line of stdout) ──
const stdoutLines = (result.stdout ?? '').trim().split('\n').filter(Boolean);
const mdPath = stdoutLines[stdoutLines.length - 1];

if (!mdPath || !existsSync(mdPath)) {
  console.error(`Error: expected a valid .md path from script stdout, got: "${mdPath}"`);
  process.exit(1);
}

// ── Read Markdown content ────────────────────────────────────────────
let content = readFileSync(mdPath, 'utf-8');

// ── Extract & strip first heading → use as title fallback ────────────
let title = TITLE;
const headingMatch = content.match(/^#\s+(.+)$/m);
if (!title && headingMatch) {
  title = headingMatch[1].trim();
  // Remove the first heading so it doesn't duplicate the frontmatter title
  content = content.replace(/^#\s+.+\n*/m, '');
}
title = title || 'Untitled';

// ── Copy localised assets to public/ (if any) ────────────────────────
const cacheAssetsDir = join(cacheDir, 'assets');
const publicAssetsDir = join(repoRoot, 'public', 'feishu-assets', SLUG);

if (existsSync(cacheAssetsDir)) {
  try {
    mkdirSync(publicAssetsDir, { recursive: true });
    cpSync(cacheAssetsDir, publicAssetsDir, { recursive: true });
    // Rewrite "assets/" references in the Markdown to the public path
    content = content.replace(
      /(?:\.{0,2}\/)?assets\//g,
      `/feishu-assets/${SLUG}/`,
    );
    console.log(`Assets copied to: public/feishu-assets/${SLUG}/`);
  } catch (err) {
    console.error(`Warning: failed to copy assets: ${err.message}`);
  }
}

// ── Build YAML frontmatter ───────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10);
const tagsArray = TAGS
  ? TAGS.split(',').map((t) => t.trim()).filter(Boolean)
  : [];
const tagsYaml =
  tagsArray.length > 0
    ? `[${tagsArray.map((t) => `"${esc(t)}"`).join(', ')}]`
    : '[]';

const frontmatter = [
  '---',
  `title: "${esc(title)}"`,
  `date: ${today}`,
  `type: ${CONTENT_TYPE}`,
  `description: "${esc(DESCRIPTION)}"`,
  `tags: ${tagsYaml}`,
  `draft: ${DRAFT}`,
  `source: "feishu"`,
  `feishu_url: "${esc(FEISHU_URL)}"`,
  '---',
  '',
].join('\n');

// ── Write final content file ─────────────────────────────────────────
const outputDir = join(repoRoot, 'src', 'content', 'posts');
mkdirSync(outputDir, { recursive: true });

const outputPath = join(outputDir, `${SLUG}.md`);
writeFileSync(outputPath, frontmatter + content, 'utf-8');

console.log(`\nPublished: ${outputPath}`);

// ── Helpers ──────────────────────────────────────────────────────────

/** Escape backslashes and double-quotes for safe YAML double-quoted strings. */
function esc(s) {
  return s.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
