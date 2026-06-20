---
title: "粒子引力场"
date: 2024-06-01
type: demo
description: "用 Canvas 实现粒子间的引力模拟——鼠标移动影响引力中心，纯 HTML + 原生 JS，零依赖。"
tags: [canvas, animation, physics, javascript]
draft: false
---

<div style="text-align:center; margin-bottom: 1rem;">
  <canvas id="gravity-canvas" width="700" height="420"
    style="background:#0a0a1a; border-radius:0.75rem; cursor:crosshair; max-width:100%;"></canvas>
  <p style="font-size:0.8rem; color:#64748b; margin-top:0.5rem;">移动鼠标改变引力中心</p>
</div>

<script>
(function() {
  const canvas = document.getElementById('gravity-canvas');
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let mouse = { x: W / 2, y: H / 2 };

  const PARTICLE_COUNT = 120;
  const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * W,
    y: Math.random() * H,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5,
    size: Math.random() * 2 + 1,
    hue: Math.random() * 60 + 200,
  }));

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = (e.clientX - r.left) * (W / r.width);
    mouse.y = (e.clientY - r.top) * (H / r.height);
  });

  function step() {
    ctx.fillStyle = 'rgba(10,10,26,0.15)';
    ctx.fillRect(0, 0, W, H);

    for (const p of particles) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const force = Math.min(80 / (dist * dist), 0.4);

      p.vx += dx / dist * force;
      p.vy += dy / dist * force;

      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 4) { p.vx = p.vx / speed * 4; p.vy = p.vy / speed * 4; }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) { p.x = 0; p.vx *= -0.7; }
      if (p.x > W) { p.x = W; p.vx *= -0.7; }
      if (p.y < 0) { p.y = 0; p.vy *= -0.7; }
      if (p.y > H) { p.y = H; p.vy *= -0.7; }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, 0.85)`;
      ctx.fill();
    }

    requestAnimationFrame(step);
  }

  step();
})();
</script>

<h2>实现思路</h2>
<p>每帧对所有粒子施加一个指向鼠标位置的引力，引力大小与距离平方成反比。
通过每帧叠加半透明背景（而非完全清空）产生运动轨迹效果。</p>

<p>这个 Demo 展示了 HTML Canvas 的核心特性：</p>
<ul>
  <li>无框架依赖，200 行以内完成物理模拟</li>
  <li>直接内嵌在 <code>.md</code> 文件里，随内容一起发布</li>
  <li>AI 可以直接生成并修改这类代码</li>
</ul>
