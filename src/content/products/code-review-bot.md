---
title: 'Code Review Bot'
description: 'Automated code review powered by AI. Catch bugs before they ship.'
pubDate: '2024-03-01'
heroImage: '/product-placeholder-2.jpg'
category: 'Developer Tools'
status: 'beta'
---

## Overview

Code Review Bot integrates with GitHub, GitLab, and Bitbucket to automatically review pull requests using AI.

## What It Checks

- **Security vulnerabilities** — SQL injection, XSS, CSRF, and more
- **Performance issues** — N+1 queries, missing indexes, inefficient loops
- **Code style** — Enforces your team's coding conventions
- **Logic errors** — Common programming mistakes and anti-patterns

## GitHub App Installation

1. Visit the [GitHub Marketplace](https://github.com/marketplace)
2. Search for "AI Labs Code Review"
3. Install and grant repository access

## Configuration

Add a `.codereview.yml` to your repository root to customize behavior:

```yaml
languages: [python, typescript, go]
ignore: [vendor/, node_modules/]
severity_threshold: medium
```
