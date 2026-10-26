# Brucy Wu — Portfolio

暗色、平面、双语的 Obsidian Terminal / 黑曜终端个人主页。纯 HTML、CSS 和 JavaScript，无构建步骤。

主页（`index.html`）保留个人简介、一个项目预览和最多三篇杂谈预览。完整项目与杂谈列表分别位于 `projects.html` 和 `notes.html`；导航中的 About 返回主页简介位置，Projects / Notes 打开独立页面。支持中英文切换、响应式布局、键盘操作与减少动态效果偏好。禁用 JavaScript 时，中文正文和导航仍可使用。

## 本地预览与检查

在仓库根目录运行：

```bash
python3 -m http.server 8000
```

打开 `http://localhost:8000`。静态资源、锚点和双语属性检查：

```bash
python3 scripts/check_site.py
node --check assets/js/site.js
```

## 发布

在 GitHub 仓库的 **Settings → Pages** 中选择要发布的分支及根目录 `/`。网站按用户主页根路径部署：`https://brucewayne-batty.github.io/`。

- `404.html`：GitHub Pages 自定义错误页。本地 HTTP server 不会自动调用它，可直接访问 `/404.html` 检查样式。
- `robots.txt` / `sitemap.xml`：允许索引并提供主页、Projects、Notes 和四篇文章的地址。
- `assets/images/favicon.svg`：站点图标。
- `assets/images/social-card.png`：1200 × 630 分享预览；设计源文件为同目录 `social-card.svg`，修改后须重新导出 PNG。
- 如改域名，需同步更新主页、列表页及文章页中的 canonical、Open Graph / Twitter 地址，以及 `robots.txt`、`sitemap.xml`。

## 内容维护

- 页面文案的中文 / 英文分别在 `data-zh` / `data-en` 中；修改中文属性时，也应同步修改元素正文，保持无 JavaScript 的中文版本一致。
- 辅助技术标签的双语内容在 `data-aria-zh` / `data-aria-en` 中。
- 页脚以 “Find Me Anywhere” 标题搭配圆形描边 GitHub 图标按钮，简介也链接到真实 GitHub 主页，页脚另有本站源码入口。新增联系方式时在 `.social-links` 中添加 `.social-button`，使用真实地址、图标和双语辅助标签；尚未添加邮箱、其他社交账号或联系表单。
- MCP 项目的源码入口为 [Local-Image-MCP](https://github.com/BruceWayne-Batty/Local-Image-MCP)。Slots Champion 和 Charity Token 暂不提供源码或链接，仅展示项目介绍，不显示“链接待补充”提示。
- 完整项目列表维护在 `projects.html`；首页 `.project-list` 只保留一个精选项目。
- 三篇杂谈正文分别位于 `notes-last-bug.html`、`notes-ai-efficiency.html`、`notes-solo-development.html`，共用站点样式及语言切换脚本。新增文章时更新 `notes.html` 的完整列表、文章间导航和 sitemap；首页 `.notes-list` 始终只保留三篇预览（不足三篇时全部展示），若更新预览需替换旧条目而非追加第四篇。站点检查会验证首页展示数量及预览是否存在于完整列表中。

## 图片

现有项目概念图：

```text
assets/images/slots-champion.webp
assets/images/new-api-image-mcp.webp
assets/images/charity-token.webp
```

图片生成方向参考 `IMAGE_PROMPTS.md`。概念图不应作为真实产品截图；后续建议补充实际运行截图或演示。

个人照片目前为明确的视觉占位，不请求不存在的图片文件。获得真实照片后，可将照片放在 `assets/images/portrait.webp`，在 `.portrait-placeholder` 样式中使用该地址，并同步修改 `index.html` 的占位标签、图片说明与双语辅助标签。

## 发布前手动检查

- [ ] 确认项目描述、技术栈与实际实现一致，检查已提供的 MCP 源码链接；另外两个项目暂不提供链接。
- [ ] 决定是否使用个人照片，替换占位或保留抽象视觉。
- [ ] 确定是否提供邮箱或其他联系方式（当前仅有 GitHub 入口）。
- [ ] 审阅现有三篇杂谈的中英文正文与文章间导航，确保 Notes 完整列表和主页三篇预览一致。
- [ ] 检查手机与桌面、中英文、键盘 Tab / Escape、禁用 JavaScript、减少动态效果。
- [ ] 部署后验证首页、未知路径的 404、分享预览图片及 sitemap。
