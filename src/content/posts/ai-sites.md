---
title: "ai-sites"
date: 2024-06-01
type: product
description: "HTML-first 内容发布平台——博客、Demo、产品展示，每篇内容都是一个独立 HTML 页面，AI 生成友好。"
status: "live"
github: "https://github.com/your-username/ai-sites"
draft: false
---

<section>
  <h2>核心理念</h2>
  <p>
    传统内容平台用 Markdown 写作，在服务器端渲染成 HTML。
    <strong>ai-sites 反过来</strong>：内容直接以 HTML 形态存储和发布——
    更丰富的表现力，AI 生成更顺畅，交互能力无限制。
  </p>

  <h2>功能</h2>
  <ul>
    <li>📝 <strong>Blog</strong>：技术文章，支持 Markdown body + 完整 HTML</li>
    <li>🎮 <strong>Demos</strong>：交互式演示，Canvas / WebGL / 原生 JS</li>
    <li>📦 <strong>Products</strong>：产品介绍页，带状态标记（Live / Beta / Coming Soon）</li>
    <li>🗺️ <strong>Roadmap</strong>：看板式进度追踪</li>
  </ul>

  <h2>技术栈</h2>
  <ul>
    <li>Astro 6 — 静态输出，零 JS 默认</li>
    <li>Tailwind CSS 4 — 样式</li>
    <li>GitHub Actions — 自动部署到 GitHub Pages</li>
  </ul>

  <h2>内容工作流</h2>
  <ol>
    <li>AI 生成完整 HTML 内容（或手动编写）</li>
    <li>保存为 <code>src/content/blog/my-post.md</code></li>
    <li><code>git push</code> → GitHub Actions 自动构建并部署</li>
  </ol>
</section>
