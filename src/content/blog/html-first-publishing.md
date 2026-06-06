---
title: "为什么用 HTML 发布内容而不是 Markdown"
date: 2024-06-01
description: "HTML 是 Markdown 的超集——更丰富的表现力、交互能力，以及 AI 时代下无摩擦的生成工作流。"
tags: [html, publishing, ai]
draft: false
---

<section>
  <p>
    Markdown 是写作的利器，但它有一个根本限制：<strong>它只是 HTML 的一个子集</strong>。
    当你需要内嵌交互图表、Canvas 动画、自定义布局时，Markdown 要么依赖插件，要么直接放弃。
  </p>

  <h2>HTML 能做而 Markdown 做不到的事</h2>

  <ul>
    <li>任意 CSS 布局（Grid、Flexbox、自定义样式）</li>
    <li>内嵌 <code>&lt;canvas&gt;</code>、<code>&lt;video&gt;</code>、<code>&lt;iframe&gt;</code></li>
    <li>交互式组件（无需框架，原生 JS 即可）</li>
    <li>精确的排版控制（不被 Markdown 渲染器覆盖）</li>
    <li>自定义数据属性，供 JS 读取</li>
  </ul>

  <h2>AI 时代的优势</h2>
  <p>
    Claude、GPT-4o 生成 HTML 的质量已经相当高。你描述一个布局或交互效果，
    AI 直接输出可运行的 HTML——这个文件本身就是发布单元，无需额外的渲染步骤。
  </p>

  <blockquote>
    Markdown 是给人写的，HTML 是给机器（浏览器、AI）写的。
    AI 时代，这个区别变得更加显著。
  </blockquote>

  <h2>实践方案</h2>
  <p>
    本站使用 <code>.md</code> 文件，但正文支持完整 HTML——
    YAML frontmatter 处理元数据，body 写任意 HTML。
    这意味着：
  </p>
  <ol>
    <li>简单文章：纯 Markdown，快速写作</li>
    <li>复杂内容：HTML body，完整控制</li>
    <li>AI 生成：直接接受 HTML 输出，零转换</li>
  </ol>
</section>
