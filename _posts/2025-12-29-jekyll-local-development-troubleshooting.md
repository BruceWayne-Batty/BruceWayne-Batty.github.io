---
layout: post
title: "Tiny Problems for Jekyll Local Development"
date: 2025-12-30 12:00:00 +0800
comments: true
category: Jekyll
---

When setting up a Jekyll blog locally, you might encounter several common issues that prevent the site from working correctly. This post documents the problems we encountered and their solutions during a recent Jekyll setup.

## Problem 1: Blank Page with "ERROR '/' not found"

### Symptoms
After running `jekyll serve`, the page appears blank, and the terminal shows:
```
ERROR '/' not found.
```

### Root Cause
The `baseurl` in `_config.yml` was set to `/jekyll-clean` (typically used for GitHub Pages project sites), which causes Jekyll to serve the site at `http://localhost:4000/jekyll-clean/` instead of the root path.

### Solution
Change the `baseurl` in `_config.yml` to an empty string:

```yaml
baseurl: ''
```

**Note:** For GitHub Pages project sites, you'll need to set this back to your project name before deploying, or use `jekyll serve --baseurl=''` for local development while keeping the project name in the config file.

---

## Problem 2: Page Still Blank After Fixing baseurl

### Symptoms
Even after fixing the `baseurl`, the page remains blank, and build warnings appear about conflicts.

### Root Cause
Multiple issues were identified:
1. **File conflicts**: Both `index.html` and `index.markdown` existed, causing Jekyll to generate conflicting output files
2. **Plugin configuration**: The `jekyll-paginate` plugin was listed under `gems` instead of `plugins` (Jekyll 4.x uses `plugins`)
3. **Missing plugin**: The `jekyll-paginate` gem wasn't added to the `Gemfile`

### Solutions

1. **Delete conflicting files**: Remove the `index.markdown` file if `index.html` already exists (or vice versa)

2. **Update `_config.yml`**: Change `gems` to `plugins`:
   ```yaml
   plugins: ['jekyll-paginate']
   ```

3. **Add plugin to Gemfile**: Add `jekyll-paginate` to the `:jekyll_plugins` group:
   ```ruby
   group :jekyll_plugins do
     gem "jekyll-feed", "~> 0.12"
     gem "jekyll-paginate", "~> 1.1"
   end
   ```

4. **Install the plugin**:
   ```bash
   bundle install
   ```

---

## Problem 3: Layout Warnings and File Conflicts

### Symptoms
Build warnings appear:
```
Build Warning: Layout 'page' requested in about.markdown does not exist.
Conflict: The following destination is shared by multiple files.
```

### Root Cause
- Both `about.html` and `about.markdown` existed, causing conflicts
- Some files referenced layouts that didn't exist in the theme (e.g., `page`, `home` layouts)

### Solution
- Delete the redundant file (e.g., remove `about.markdown` if you're using `about.html`)
- Update files to use available layouts (typically `default` or `post` in most themes)

---

## Problem 4: Using Markdown Instead of HTML for Pages

### Requirement
You want to edit pages using Markdown syntax instead of HTML for better readability and easier editing.

### Solution
1. Delete the existing HTML file (e.g., `about.html`)
2. Create a Markdown file (e.g., `about.md`) with the same front matter:

```markdown
---
layout: default
---

<div class="well" markdown="1">

# About Me

Your content here using Markdown syntax.

</div>
```

---

## Problem 5: Markdown Not Rendering Inside HTML Tags

### Symptoms
When using Markdown syntax inside HTML tags (like `<div>`), the Markdown is not processed, and text appears on the same line instead of being properly formatted.

### Root Cause
By default, kramdown (Jekyll's Markdown processor) doesn't process Markdown syntax inside HTML block-level tags to avoid conflicts.

### Solution
Add the `markdown="1"` attribute to the HTML tag:

```markdown
<div class="well" markdown="1">

# Your Heading

Your paragraph text here.

Another paragraph.

</div>
```

This tells kramdown to process the Markdown syntax inside the HTML tag.

### Example

**Before (not working):**
```markdown
<div class="well">

# About me

Test content

</div>
```
Result: Markdown syntax is ignored, text appears inline.

**After (working):**
```markdown
<div class="well" markdown="1">

# About me

Test content

</div>
```
Result: Markdown is properly rendered as HTML (`<h1>` tags, paragraph breaks, etc.).

---

## Key Takeaways

1. **baseurl Configuration**: Always check your `baseurl` setting when running Jekyll locally vs. deploying to GitHub Pages
2. **File Conflicts**: Avoid having both `.html` and `.markdown/.md` versions of the same file
3. **Plugin Configuration**: Use `plugins` (not `gems`) in Jekyll 4.x
4. **Markdown in HTML**: Use `markdown="1"` attribute when you want Markdown processing inside HTML tags
5. **Layout Files**: Ensure you're using layouts that actually exist in your theme

## Testing Your Changes

After making changes:
1. Save your files
2. If `jekyll serve` is running, it will automatically regenerate (watch mode)
3. Refresh your browser at `http://localhost:4000`
4. Check the terminal output for any warnings or errors

If automatic regeneration doesn't work, you can manually build:
```bash
bundle exec jekyll build
```

---

## Conclusion

These are common issues when setting up Jekyll sites, especially when transitioning between local development and GitHub Pages deployment. Understanding these problems and their solutions will help you maintain a smooth development workflow.

Happy Jekyll blogging!

