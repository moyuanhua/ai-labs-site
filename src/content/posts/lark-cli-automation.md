---
title: "用 lark-cli 把飞书文档变成网站内容：一条命令搞定发布"
date: 2026-09-02
type: post
description: "lark-cli 拉取飞书文档 → pandoc 转 HTML → 落进 Astro 内容集合，把写作和发布彻底解耦。"
tags: [tutorial, feishu, automation, cli]
draft: false
---

<section>
  <p>
    写作和发布是两件事。飞书适合写作，Astro 适合发布。
    问题是：怎么把飞书里的内容无缝搬到网站？手动复制粘贴太蠢，自动化才是正道。
  </p>

  <h2>为什么用飞书写，用 Astro 发</h2>
  <ul>
    <li><strong>飞书</strong>：协作编辑、版本历史、评论、权限管理，写作体验一流</li>
    <li><strong>Astro</strong>：静态生成、SEO 友好、部署简单、完全可控</li>
  </ul>
  <p>
    两者结合的逻辑很清晰：<strong>在飞书里写，用脚本发布到 Astro</strong>。
    写作的人不需要懂代码，发布的人不需要打开飞书。
  </p>

  <h2>lark-cli 是什么</h2>
  <p>
    <code>lark-cli</code> 是一个命令行工具，可以直接操作飞书的文档、云空间、消息等资源。
    它封装了飞书开放平台的 API，让你用一条命令就能拉取文档内容。
  </p>
  <pre><code># 安装
npm install -g lark-cli

# 登录（首次使用需要授权）
lark-cli auth login</code></pre>

  <h2>核心流程：一条命令拉取文档</h2>
  <p>
    假设你有一篇飞书文档，URL 是 <code>https://xxx.feishu.cn/docx/ABC123</code>。
    用 <code>lark-cli docs +fetch</code> 可以直接拉取文档内容：
  </p>
  <pre><code># 拉取文档，输出为 HTML
lark-cli docs +fetch --url "https://xxx.feishu.cn/docx/ABC123" --format html > output.html</code></pre>
  <p>
    这条命令会返回文档的 HTML 内容，包括文本、图片、列表等结构化信息。
  </p>

  <h2>图片本地化</h2>
  <p>
    飞书文档里的图片是临时链接，会过期。必须下载到本地。
    可以用 <code>media-preview</code> 参数获取图片 URL，然后用脚本批量下载：
  </p>
  <pre><code># 拉取文档，包含图片 URL
lark-cli docs +fetch --url "https://xxx.feishu.cn/docx/ABC123" --format html --media-preview > raw.html

# 用脚本提取图片 URL 并下载
# （示例脚本，实际可以用 jq + curl 或 Python）
grep -oP 'https://[^"]+\.(png|jpg|jpeg)' raw.html | while read url; do
  filename=$(basename "$url")
  curl -o "src/assets/images/$filename" "$url"
  sed -i '' "s|$url|/assets/images/$filename|g" raw.html
done</code></pre>

  <h2>用 pandoc 转换格式</h2>
  <p>
    飞书输出的是 HTML，但 Astro 内容集合支持 Markdown。
    可以用 <code>pandoc</code> 把 HTML 转成 Markdown，或者直接保留 HTML（本站就是 HTML-first）。
  </p>
  <pre><code># HTML → Markdown（如果需要）
pandoc -f html -t markdown raw.html -o post.md

# 或者直接保留 HTML，加上 frontmatter
cat > src/content/posts/my-post.md &lt;&lt;EOF
---
title: "我的文章标题"
date: $(date +%Y-%m-%d)
type: post
description: "文章描述"
tags: [feishu, automation]
draft: false
---

$(cat raw.html)
EOF</code></pre>

  <h2>写进 Astro 内容集合</h2>
  <p>
    Astro 的内容集合就是 <code>src/content/posts/</code> 目录下的 <code>.md</code> 文件。
    只要 frontmatter 符合 schema，文件放进去就能被渲染。
  </p>
  <p>
    完整的发布脚本可以这样写：
  </p>
  <pre><code>#!/bin/bash
# scripts/publish-feishu.sh

DOC_URL=$1
TITLE=$2
TAGS=$3

if [ -z "$DOC_URL" ] || [ -z "$TITLE" ]; then
  echo "Usage: $0 &lt;feishu-doc-url&gt; &lt;title&gt; [tags]"
  exit 1
fi

# 1. 拉取文档
echo "Fetching document..."
lark-cli docs +fetch --url "$DOC_URL" --format html --media-preview > /tmp/raw.html

# 2. 本地化图片
echo "Downloading images..."
mkdir -p src/assets/images
grep -oP 'https://[^"]+\.(png|jpg|jpeg)' /tmp/raw.html | while read url; do
  filename=$(basename "$url")
  curl -s -o "src/assets/images/$filename" "$url"
  sed -i '' "s|$url|/assets/images/$filename|g" /tmp/raw.html
done

# 3. 生成 slug
SLUG=$(echo "$TITLE" | tr ' ' '-' | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9-]//g')
FILEPATH="src/content/posts/${SLUG}.md"

# 4. 写入文件
echo "Writing to $FILEPATH..."
cat > "$FILEPATH" &lt;&lt;EOF
---
title: "$TITLE"
date: $(date +%Y-%m-%d)
type: post
description: ""
tags: [${TAGS:-post}]
draft: false
---

$(cat /tmp/raw.html)
EOF

echo "Done! File created at $FILEPATH"</code></pre>

  <h2>GitHub Actions 自动发布</h2>
  <p>
    手动跑脚本还是不够自动化。可以用 GitHub Actions 监听 webhook 或定时触发：
  </p>
  <pre><code># .github/workflows/publish-feishu.yml
name: Publish from Feishu

on:
  repository_dispatch:
    types: [publish-feishu]
  workflow_dispatch:
    inputs:
      doc_url:
        description: 'Feishu doc URL'
        required: true
      title:
        description: 'Post title'
        required: true

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      
      - name: Install lark-cli
        run: npm install -g lark-cli
      
      - name: Install pandoc
        run: sudo apt-get install -y pandoc
      
      - name: Authenticate
        run: lark-cli auth login --token ${{ secrets.FEISHU_TOKEN }}
      
      - name: Publish
        run: |
          chmod +x scripts/publish-feishu.sh
          ./scripts/publish-feishu.sh "${{ github.event.inputs.doc_url }}" "${{ github.event.inputs.title }}"
      
      - name: Commit and push
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add src/content/posts/ src/assets/images/
          git commit -m "Add post from Feishu" || exit 0
          git push</code></pre>
  <p>
    这样，你在飞书里写完文档，触发一次 workflow（或者用飞书机器人自动触发），
    内容就会自动出现在网站上。写作和发布彻底解耦。
  </p>

  <blockquote>
    最好的发布流程是：<strong>写作者感知不到发布的存在</strong>。
    飞书里点一下"完成"，网站上就已经有了。
  </blockquote>
</section>
