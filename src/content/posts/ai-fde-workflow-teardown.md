---
title: "拆一个 AI 落地工程师的日常：Agent 如何帮我把活干完"
date: 2026-09-02
type: post
description: "不是造一个全能 Agent，而是把日常任务拆成一组小 Agent：写、查、跑、验，各自可替换。"
tags: [teardown, workflow, agent, productivity]
draft: false
---

<section>
  <p>
    AI FDE（AI Forward Deployed Engineer）的核心定位是<strong>把 AI 从 demo 干到生产</strong>。
    这不是造一个全能 Agent，而是把日常工作拆成一组小 Agent，各自负责一个环节，可替换、可组合。
  </p>

  <h2>AI FDE 的定位</h2>
  <p>
    传统 SDE 写代码、调 bug、做 review。AI FDE 在此基础上多了几件事：
  </p>
  <ul>
    <li><strong>评估 AI 能力边界</strong>：什么能交给 AI，什么必须人做</li>
    <li><strong>设计 AI 工作流</strong>：把任务拆成 AI 可执行的步骤</li>
    <li><strong>落地 AI 工具</strong>：让团队真正用起来，而不是停留在 demo</li>
    <li><strong>持续优化</strong>：根据反馈调整 prompt、工具链、流程</li>
  </ul>
  <p>
    签名是 <strong>SDE = Someone Who Does Everything</strong>，但 AI FDE 的"everything"里，
    有一部分是 AI 帮你做的。
  </p>

  <h2>为什么「单一大 Agent」不如「一组小 Agent」</h2>
  <p>
    很多人第一反应是造一个全能 Agent：给它一个目标，它自己规划、执行、验证。
    听起来很美，实际上问题很多：
  </p>
  <ul>
    <li><strong>上下文爆炸</strong>：一个 Agent 处理所有事，context window 很快用完</li>
    <li><strong>调试困难</strong>：出错了不知道是哪个环节的问题</li>
    <li><strong>不可替换</strong>：某个环节想换模型或工具，整个 Agent 都要改</li>
    <li><strong>难以并行</strong>：所有事串行执行，效率低</li>
  </ul>
  <p>
    更好的方式是<strong>模块化</strong>：每个 Agent 负责一个明确的职责，
    输入输出清晰，可以独立测试、替换、组合。
  </p>

  <h2>我的日常工作流拆解</h2>
  <p>
    下面是一个典型的 AI FDE 工作日，看看各环节用什么 Agent/工具。
  </p>

  <h3>1. 需求理解 → 调研 Agent</h3>
  <p>
    拿到需求后，先让 AI 帮忙调研：
  </p>
  <ul>
    <li>用 <strong>Perplexity</strong> 或 <strong>ChatGPT with browsing</strong> 搜索相关技术方案</li>
    <li>用 <strong>Claude</strong> 分析需求文档，提取关键约束</li>
    <li>用 <strong>GitHub Copilot</strong> 搜索类似实现</li>
  </ul>
  <p>
    输出：一份调研报告，包含可选方案、优劣对比、推荐路径。
  </p>

  <h3>2. 方案设计 → 架构 Agent</h3>
  <p>
    基于调研结果，让 AI 帮忙设计架构：
  </p>
  <ul>
    <li>用 <strong>Claude</strong> 或 <strong>GPT-4o</strong> 生成架构图（Mermaid 语法）</li>
    <li>用 <strong>Cursor</strong> 或 <strong>Copilot Chat</strong> 讨论技术选型</li>
    <li>用 <strong>Excalidraw + AI</strong> 画流程图</li>
  </ul>
  <p>
    输出：架构图、技术选型文档、关键接口定义。
  </p>

  <h3>3. 写码 → 编码 Agent</h3>
  <p>
    这是 AI 介入最深的环节：
  </p>
  <ul>
    <li><strong>Cursor</strong>：主力编码工具，Composer 模式可以跨文件修改</li>
    <li><strong>Claude Code</strong>：复杂逻辑、重构、调试</li>
    <li><strong>GitHub Copilot</strong>：行级补全，快速写样板代码</li>
    <li><strong>OpenCode</strong>：多 Agent 协作，处理复杂任务</li>
  </ul>
  <p>
    关键原则：<strong>AI 写初稿，人做 review</strong>。
    不要盲目接受 AI 的输出，每一段代码都要理解。
  </p>

  <h3>4. 测试 → 验证 Agent</h3>
  <p>
    测试也可以部分自动化：
  </p>
  <ul>
    <li>用 <strong>Copilot</strong> 或 <strong>Cursor</strong> 生成单元测试</li>
    <li>用 <strong>Playwright + AI</strong> 生成 E2E 测试</li>
    <li>用 <strong>AI code review</strong> 工具（如 CodeRabbit）做初步审查</li>
  </ul>
  <p>
    但核心逻辑的测试用例还是要人写，AI 生成的测试往往覆盖不到边界情况。
  </p>

  <h3>5. 部署 → 运维 Agent</h3>
  <p>
    部署流程可以高度自动化：
  </p>
  <ul>
    <li><strong>GitHub Actions</strong>：CI/CD 流水线</li>
    <li><strong>Vercel / Cloudflare</strong>：一键部署</li>
    <li><strong>AI 监控</strong>：用 AI 分析日志、告警，快速定位问题</li>
  </ul>

  <h2>可复用的 Prompt 模式</h2>
  <p>
    在日常工作中，我积累了一些高频 prompt 模式：
  </p>
  <ul>
    <li><strong>需求拆解</strong>："把这个需求拆成 3-5 个独立的技术任务，每个任务有明确的输入输出和验收标准"</li>
    <li><strong>代码审查</strong>："审查这段代码，关注：1) 潜在 bug 2) 性能问题 3) 可读性 4) 安全性。给出具体的改进建议"</li>
    <li><strong>调试辅助</strong>："这个报错信息是 X，代码逻辑是 Y，可能的原因有哪些？如何验证？"</li>
    <li><strong>文档生成</strong>："根据这段代码生成 API 文档，包含：功能描述、参数说明、返回值、示例"</li>
  </ul>

  <h2>落地经验</h2>
  <ul>
    <li><strong>从小处开始</strong>：不要一上来就搞大工程，先在一个小任务上验证 AI 的效果</li>
    <li><strong>量化收益</strong>：记录 AI 帮你省了多少时间，这样才能说服团队和老板</li>
    <li><strong>建立信任</strong>：AI 输出要 review，不要盲目接受。一旦出错，信任就没了</li>
    <li><strong>持续学习</strong>：AI 工具迭代很快，保持关注新工具、新模式</li>
    <li><strong>分享经验</strong>：把成功的案例分享给团队，让更多人用起来</li>
  </ul>

  <blockquote>
    AI FDE 不是替代工程师，而是<strong>放大工程师的能力</strong>。
    你依然是决策者，AI 是你的执行者。
  </blockquote>

  <p>
    这就是我的日常工作流。没有银弹，只有不断的实践和优化。
    如果你也在探索 AI 落地，欢迎交流。
  </p>
</section>
