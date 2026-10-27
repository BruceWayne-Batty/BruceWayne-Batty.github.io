# Brucy Wu — Portfolio

Eleventy 构建的双语静态个人网站。中文使用根路径，英文使用 `/en/`；最终产物位于 `_site`。

## 本地开发

需要 Node.js 22+：

```bash
npm install
npm run dev
```

构建和完整检查：

```bash
npm run build
npm test
```

检查会验证站内链接、锚点、双语 SEO、canonical、hreflang、sitemap、JSON-LD、首页最新三篇 Notes，以及分享图片。

## 添加 Note

在 `notes/<slug>/` 中创建 `zh.md`、`en.md` 或其中任意一个。缺少翻译是允许的；页面语言切换处会显示暂无翻译。

```yaml
---
title: "文章标题"
description: "用于搜索和分享的摘要"
deck: "文章页标题下的引言"
category: "开发随笔"
slug: "stable-slug"
lang: zh
translationKey: "stable-slug"
author: brucy
date: 2026-10-27
updated: 2026-10-27
logNumber: 6
noteTags: [ai, solo-development]
tags: [notes]
draft: false
layout: layouts/note.njk
permalink: "/notes/stable-slug/index.html"
---
```

英文 permalink 使用 `/en/notes/stable-slug/index.html`。`slug` 和 `translationKey` 应保持稳定；修改标题不会改变 URL。作者与 Tag 必须先在 `src/_data/authors.json` 和 `src/_data/tagDefinitions.json` 中登记。

正文引用其他 Note 时使用稳定 ID：

```liquid
{% noteLink "local-image-mcp", "Local Image MCP 开发记录", lang %}
```

构建器优先链接同语言版本；不存在时链接已有语言并标注语言；目标完全不存在则构建失败。列表、首页最新三篇、作者/Tag 分类和上一篇/下一篇均自动生成。

设置 `draft: true` 可阻止文章输出和进入集合。发布时改为 `false`。

## 内容与模板

- `notes/`：Markdown Notes
- `src/pages/`：首页、项目、列表、分类、sitemap、404 和兼容跳转模板
- `src/_includes/`：公共布局和组件
- `src/_data/`：作者、Tag、项目、站点和页面 metadata
- `assets/`：样式、脚本和图片
- `eleventy.config.js`：路由、集合、内容校验及构建过滤器
- `scripts/check_site.py`：生成站点检查

## URL 与 SEO

主要路由：

```text
/                              /en/
/projects/                     /en/projects/
/notes/                        /en/notes/
/notes/<slug>/                 /en/notes/<slug>/
/notes/tags/<tag>/             /en/notes/tags/<tag>/
/notes/authors/<author>/       /en/notes/authors/<author>/
```

每个页面拥有独立语言的 metadata、自引用 canonical 和真实存在的 hreflang。旧的 `notes-*.html`、`notes.html` 和 `projects.html` 会生成 `noindex` 兼容页。

## 发布

`.github/workflows/pages.yml` 在推送 `main` 后执行 `npm ci`、测试、构建并部署 `_site`。首次使用时，在仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions**。

如修改域名，请同步修改 `src/_data/site.json`、`eleventy.config.js` 和 `robots.txt`。
