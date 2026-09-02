---
title: "用 LangChain 搭一个 RAG 知识问答 Agent：从飞书文档到可对话的知识库"
date: 2026-09-02
type: post
description: "手把手：把飞书文档做成向量知识库，用 LangChain 搭一个能检索回答的 RAG Agent。"
tags: [tutorial, langchain, rag, agent]
draft: false
---

<section>
  <p>
    大模型很强，但它有两个硬伤：<strong>知识过时</strong>和<strong>私有知识盲区</strong>。
    你问它公司内部的文档、最新的产品手册、上周的会议纪要，它只能瞎编。
    RAG（Retrieval-Augmented Generation）就是为了解决这个问题——先检索，再生成。
  </p>

  <h2>为什么要做 RAG</h2>
  <p>
    微调太贵、太慢，而且知识还在不断变化。RAG 的优势在于：
  </p>
  <ul>
    <li>知识可以实时更新，改文档就行，不用重新训练</li>
    <li>成本低，只需要一个向量数据库</li>
    <li>可追溯，回答能附上来源链接</li>
    <li>适合私有知识场景，比如内部文档、产品手册</li>
  </ul>

  <h2>整体架构</h2>
  <p>
    一个完整的 RAG 系统分两步：<strong>离线索引</strong>和<strong>在线问答</strong>。
  </p>
  <ol>
    <li><strong>离线索引</strong>：文档 → 文本切分 → Embedding → 存入向量数据库</li>
    <li><strong>在线问答</strong>：用户提问 → 问题 Embedding → 向量检索 → 取回相关片段 → 拼进 Prompt → LLM 生成回答</li>
  </ol>

  <h2>关键代码：用 LangChain 实现</h2>
  <p>
    下面是一个最小可运行的例子。假设你已经有一批飞书文档导出的 Markdown 文件。
  </p>

  <h3>1. 加载文档</h3>
  <pre><code>from langchain.document_loaders import DirectoryLoader, TextLoader

loader = DirectoryLoader(
    "./docs",
    glob="**/*.md",
    loader_cls=TextLoader,
    loader_kwargs={"encoding": "utf-8"},
)
documents = loader.load()
print(f"Loaded {len(documents)} documents")</code></pre>

  <h3>2. 文本切分</h3>
  <p>
    切分粒度很关键。太大会引入噪音，太小会丢失上下文。
    推荐用 <code>RecursiveCharacterTextSplitter</code>，按段落、句子逐级切分。
  </p>
  <pre><code>from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\n\n", "\n", "。", "，", " "]
)
chunks = text_splitter.split_documents(documents)
print(f"Split into {len(chunks)} chunks")</code></pre>

  <h3>3. Embedding + 向量存储</h3>
  <p>
    这里用 OpenAI 的 embedding 模型，向量库用 FAISS（本地跑）或 Chroma（带持久化）。
  </p>
  <pre><code>from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = FAISS.from_documents(chunks, embeddings)

# 持久化保存
vectorstore.save_local("./vectorstore")</code></pre>

  <h3>4. 检索问答链</h3>
  <p>
    把检索器和 LLM 串起来，形成一个 retrieval chain。
  </p>
  <pre><code>from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

llm = ChatOpenAI(model="gpt-4o", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
    return_source_documents=True,
)

# 提问
result = qa_chain.invoke({"query": "这个产品的核心功能是什么？"})
print(result["result"])
print("Sources:", [doc.metadata["source"] for doc in result["source_documents"]])</code></pre>

  <h2>踩坑记录</h2>
  <ul>
    <li><strong>切分粒度</strong>：500 字符是个起点，但中文文档建议按段落切分，别硬切。可以用 <code>separators=["\n\n", "\n"]</code> 优先保留段落完整性。</li>
    <li><strong>top_k 选择</strong>：k=3 是个保守值。如果问题复杂，可以调到 5-7，但要注意 token 成本。</li>
    <li><strong>Prompt 注入</strong>：检索回来的文档可能包含恶意内容。建议在 system prompt 里明确约束："只根据提供的上下文回答，不要编造"。</li>
    <li><strong>Embedding 模型</strong>：中文场景推荐用 <code>bge-large-zh</code> 或 <code>m3e</code>，比 OpenAI 的通用模型效果更好。</li>
  </ul>

  <h2>如何部署上线</h2>
  <p>
    本地跑通了，下一步是部署。几个选择：
  </p>
  <ul>
    <li><strong>轻量方案</strong>：用 FastAPI 包一层，部署到 Railway 或 Fly.io</li>
    <li><strong>Serverless</strong>：向量库用 Pinecone 或 Qdrant Cloud，函数部署到 Vercel/Cloudflare Workers</li>
    <li><strong>完整方案</strong>：Docker 化，跑在 Kubernetes 上，适合企业级场景</li>
  </ul>
  <p>
    我的建议：先用 FastAPI + FAISS 跑起来，验证效果后再考虑迁移到生产级向量库。
    别一开始就过度工程化。
  </p>

  <blockquote>
    RAG 的核心不是技术栈，而是<strong>数据质量</strong>。
    文档切得好、清洗得干净，比换任何模型都有效。
  </blockquote>
</section>
