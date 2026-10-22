# Brucy Wu — Portfolio

暗色、平面、双语的 Obsidian Terminal / 黑曜终端个人主页。

页面包含主页、个人简介、项目和杂谈，支持中英文切换、响应式布局、键盘操作与减少动态效果偏好。

## 本地预览

```bash
python3 -m http.server 8000
```

打开 `http://localhost:8000`。

## 添加图片

参考 `IMAGE_PROMPTS.md` 生成图片，并放入 `assets/images/`：

```text
portrait.webp
slots-champion.webp
new-api-image-mcp.webp
charity-token.webp
```

文件放入后会自动覆盖占位视觉。发布前请在 `index.html` 中替换示例邮箱 `hello@brucywu.design`，双语内容分别保存在 `data-zh` 与 `data-en` 属性中。
